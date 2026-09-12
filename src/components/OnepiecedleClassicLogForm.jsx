import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { ONEPIECEDLE_COLUMNS, defaultStatus, parseShareText, parsePuzzleNumber, parseGuessCount } from '../lib/attributeFeedback'
import OnepiecedleGuessRowEditor from './OnepiecedleGuessRowEditor'

function emptyRow() {
  return ONEPIECEDLE_COLUMNS.map((col) => defaultStatus(col.type))
}

export default function OnepiecedleClassicLogForm({ nextPuzzleNumber, onSaved, editingEntry, editingGuesses, onCancelEdit }) {
  const [puzzleNumber, setPuzzleNumber] = useState('')
  const [isDaily, setIsDaily] = useState(true)
  const [character, setCharacter] = useState('')
  const [guesses, setGuesses] = useState([emptyRow()])
  const [tries, setTries] = useState('1')
  const [note, setNote] = useState('')
  const [pasteText, setPasteText] = useState('')
  const [pasteError, setPasteError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (editingEntry) return
    setPuzzleNumber((current) => (current === '' ? String(nextPuzzleNumber ?? '') : current))
  }, [nextPuzzleNumber, editingEntry])

  useEffect(() => {
    if (!editingEntry) return
    const sortedGuesses = [...(editingGuesses ?? [])].sort((a, b) => a.row_index - b.row_index)
    setPuzzleNumber(String(editingEntry.puzzle_number))
    setIsDaily(editingEntry.is_daily !== false)
    setCharacter((editingEntry.solution?.character ?? '').toLowerCase())
    setNote(editingEntry.note ?? '')
    const rows = sortedGuesses.length ? sortedGuesses.map((g) => g.payload.statuses) : [emptyRow()]
    setGuesses(rows)
    setTries(String(editingEntry.guess_count ?? rows.length))
  }, [editingEntry, editingGuesses])

  function resetForm() {
    setPuzzleNumber('')
    setIsDaily(true)
    setCharacter('')
    setGuesses([emptyRow()])
    setTries('1')
    setNote('')
    setPasteText('')
    setPasteError(null)
  }

  function updateGuess(i, next) {
    setGuesses((rows) => rows.map((r, idx) => (idx === i ? next : r)))
  }

  function addRow() {
    setGuesses((rows) => {
      const next = [...rows, emptyRow()]
      setTries((t) => (Number(t) === rows.length ? String(next.length) : t))
      return next
    })
  }

  function removeRow(i) {
    setGuesses((rows) => {
      const next = rows.filter((_, idx) => idx !== i)
      setTries((t) => (Number(t) === rows.length ? String(next.length) : t))
      return next
    })
  }

  function handleParsePaste() {
    setPasteError(null)
    const rows = parseShareText(pasteText, ONEPIECEDLE_COLUMNS)
    if (!rows.length) {
      setPasteError("Couldn't find any valid guess rows in that text.")
      return
    }
    setGuesses(rows)
    const parsedTries = parseGuessCount(pasteText)
    setTries(String(parsedTries && parsedTries > rows.length ? parsedTries : rows.length))
    const puzzle = parsePuzzleNumber(pasteText)
    if (puzzle) setPuzzleNumber(String(puzzle))
  }

  function validate() {
    if (!puzzleNumber || Number.isNaN(Number(puzzleNumber))) {
      return 'Enter a puzzle number.'
    }
    if (!tries || Number.isNaN(Number(tries)) || Number(tries) < guesses.length) {
      return 'Tries must be a number at least as large as the number of guess rows.'
    }
    return null
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }
    setSaving(true)
    setError(null)

    const totalTries = Number(tries)
    const truncated = totalTries > guesses.length
    const won = truncated || (guesses.length > 0 && guesses[guesses.length - 1].every((s) => s === 'green'))

    const fields = {
      game: 'onepiecedle_classic',
      puzzle_number: Number(puzzleNumber),
      won,
      guess_count: totalTries,
      solution: character.trim() ? { character: character.trim() } : null,
      note: note.trim() || null,
      is_daily: isDaily,
    }

    let entry
    if (editingEntry) {
      const { data, error: entryError } = await supabase
        .from('dailies_entries')
        .update(fields)
        .eq('id', editingEntry.id)
        .select()
        .single()
      if (entryError) {
        setError(entryError.message)
        setSaving(false)
        return
      }
      entry = data
      const { error: deleteError } = await supabase.from('dailies_entry_guesses').delete().eq('entry_id', entry.id)
      if (deleteError) {
        setError(deleteError.message)
        setSaving(false)
        return
      }
    } else {
      const { data, error: entryError } = await supabase
        .from('dailies_entries')
        .insert(fields)
        .select()
        .single()
      if (entryError) {
        setError(entryError.message)
        setSaving(false)
        return
      }
      entry = data
    }

    const guessRows = guesses.map((statuses, i) => ({
      entry_id: entry.id,
      row_index: i,
      payload: { statuses },
    }))

    const { error: guessesError } = await supabase.from('dailies_entry_guesses').insert(guessRows)

    if (guessesError) {
      if (!editingEntry) await supabase.from('dailies_entries').delete().eq('id', entry.id)
      setError(guessesError.message)
      setSaving(false)
      return
    }

    setSaving(false)
    resetForm()
    onSaved?.()
    onCancelEdit?.()
  }

  return (
    <form className="ax-card log-game-form" onSubmit={handleSubmit}>
      <h2>{editingEntry ? `edit game #${editingEntry.puzzle_number}` : 'log a game'}</h2>

      <div className="form-grid-2">
        <div className="form-row">
          <label className="label-micro">puzzle number</label>
          <input
            className="ax-input"
            type="number"
            value={puzzleNumber}
            onChange={(e) => setPuzzleNumber(e.target.value)}
            required
          />
        </div>
        <div className="form-row">
          <label className="label-micro">puzzle type</label>
          <div className="puzzle-type-toggle">
            <button
              type="button"
              className={`ax-btn ${isDaily ? 'ax-btn--solid' : ''}`}
              onClick={() => setIsDaily(true)}
            >
              daily
            </button>
            <button
              type="button"
              className={`ax-btn ${!isDaily ? 'ax-btn--solid' : ''}`}
              onClick={() => setIsDaily(false)}
            >
              archive
            </button>
          </div>
        </div>
      </div>

      <div className="form-row">
        <label className="label-micro">character (optional)</label>
        <input
          className="ax-input"
          type="text"
          placeholder={'e.g. "ace"'}
          value={character}
          onChange={(e) => setCharacter(e.target.value.toLowerCase())}
        />
      </div>

      <div className="form-row">
        <label className="label-micro">paste result (optional)</label>
        <textarea
          className="ax-input"
          rows={3}
          placeholder={'paste the classic share text here…'}
          value={pasteText}
          onChange={(e) => setPasteText(e.target.value)}
        />
        <div className="guess-row-actions">
          <button type="button" className="ax-btn" onClick={handleParsePaste} disabled={!pasteText.trim()}>
            parse
          </button>
        </div>
        {pasteError && <p className="ax-meta form-error">{pasteError}</p>}
      </div>

      <div className="guess-row-list">
        {guesses.map((statuses, i) => (
          <OnepiecedleGuessRowEditor
            key={i}
            index={i}
            statuses={statuses}
            onChange={(next) => updateGuess(i, next)}
            onRemove={() => removeRow(i)}
            canRemove={guesses.length > 1}
          />
        ))}
      </div>

      <div className="guess-row-actions">
        <button type="button" className="ax-btn" onClick={addRow}>
          + add guess row
        </button>
        <span className="text-meta">{guesses.length} rows</span>
      </div>

      <div className="form-row">
        <label className="label-micro">tries</label>
        <input
          className="ax-input"
          type="number"
          min={guesses.length}
          value={tries}
          onChange={(e) => setTries(e.target.value)}
          required
        />
        {Number(tries) > guesses.length && (
          <p className="text-meta">
            share text only showed {guesses.length} of {tries} guesses — the rest were hidden by the game.
          </p>
        )}
      </div>

      <div className="form-row">
        <label className="label-micro">note (optional)</label>
        <textarea
          className="ax-input"
          rows={2}
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      {error && <p className="ax-meta form-error">{error}</p>}

      <div className="guess-row-actions">
        <button className="ax-btn ax-btn--solid" type="submit" disabled={saving}>
          {saving ? 'saving…' : editingEntry ? 'save changes' : 'save game'}
        </button>
        {editingEntry && (
          <button type="button" className="ax-btn" onClick={() => { resetForm(); onCancelEdit?.() }}>
            cancel edit
          </button>
        )}
      </div>
    </form>
  )
}
