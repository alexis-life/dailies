import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { connectionsHex } from '../lib/colors'
import ConnectionsGuessRowEditor from './ConnectionsGuessRowEditor'

const MAX_ROWS = 8
const STARTERS = ['yellow', 'green', 'blue', 'purple']

function emptyGuess() {
  return { colors: [null, null, null, null] }
}

export default function ConnectionsLogForm({ nextPuzzleNumber, onSaved }) {
  const [puzzleNumber, setPuzzleNumber] = useState('')
  const [isDaily, setIsDaily] = useState(true)
  const [note, setNote] = useState('')
  const [guesses, setGuesses] = useState([emptyGuess()])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const filledGuesses = guesses.filter((g) => g.colors.every((c) => c))
  const solvedRows = filledGuesses.filter((g) => g.colors.every((c) => c === g.colors[0]))
  const mistakeRows = filledGuesses.filter((g) => !g.colors.every((c) => c === g.colors[0]))
  const solvedColors = new Set(solvedRows.map((g) => g.colors[0]))
  const won = solvedColors.size === 4
  const lost = !won && mistakeRows.length >= 4
  const lastGuessEmpty = guesses[guesses.length - 1].colors.every((c) => !c)
  const canAddStarter = lastGuessEmpty || guesses.length < MAX_ROWS

  useEffect(() => {
    setPuzzleNumber((current) => (current === '' ? String(nextPuzzleNumber ?? '') : current))
  }, [nextPuzzleNumber])

  function updateGuess(i, next) {
    setGuesses((rows) => rows.map((r, idx) => (idx === i ? next : r)))
  }

  function addRow() {
    setGuesses((rows) => (rows.length >= MAX_ROWS ? rows : [...rows, emptyGuess()]))
  }

  function addStarterRow(color) {
    setGuesses((rows) => {
      const last = rows[rows.length - 1]
      const filled = { colors: [color, color, color, color] }
      if (last.colors.every((c) => !c)) {
        return rows.map((r, idx) => (idx === rows.length - 1 ? filled : r))
      }
      return rows.length >= MAX_ROWS ? rows : [...rows, filled]
    })
  }

  function removeRow(i) {
    setGuesses((rows) => rows.filter((_, idx) => idx !== i))
  }

  function resetForm() {
    setPuzzleNumber('')
    setIsDaily(true)
    setNote('')
    setGuesses([emptyGuess()])
  }

  function validate() {
    if (!puzzleNumber || Number.isNaN(Number(puzzleNumber))) {
      return 'Enter a puzzle number.'
    }
    for (const g of guesses) {
      if (g.colors.some((c) => !c)) {
        return 'Every guess row needs all 4 colors filled in.'
      }
    }
    if (!won && !lost) {
      return 'Not finished yet — keep guessing until you solve all 4 categories or hit 4 mistakes.'
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

    const { data: entry, error: entryError } = await supabase
      .from('dailies_entries')
      .insert({
        game: 'connections',
        puzzle_number: Number(puzzleNumber),
        won,
        guess_count: guesses.length,
        note: note.trim() || null,
        is_daily: isDaily,
      })
      .select()
      .single()

    if (entryError) {
      setError(entryError.message)
      setSaving(false)
      return
    }

    const guessRows = guesses.map((g, i) => ({
      entry_id: entry.id,
      row_index: i,
      payload: { colors: g.colors },
    }))

    const { error: guessesError } = await supabase.from('dailies_entry_guesses').insert(guessRows)

    if (guessesError) {
      await supabase.from('dailies_entries').delete().eq('id', entry.id)
      setError(guessesError.message)
      setSaving(false)
      return
    }

    setSaving(false)
    resetForm()
    onSaved?.()
  }

  return (
    <form className="ax-card log-game-form" onSubmit={handleSubmit}>
      <h2>log a game</h2>

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
        <label className="label-micro">result</label>
        <span className={`ax-badge ${won ? 'badge-won' : 'badge-lost'}`}>
          {won ? 'won' : lost ? 'lost' : 'in progress'}
        </span>
      </div>

      <div className="guess-row-list">
        {guesses.map((g, i) => (
          <ConnectionsGuessRowEditor
            key={i}
            index={i}
            guess={g}
            onChange={(next) => updateGuess(i, next)}
            onRemove={() => removeRow(i)}
            canRemove={guesses.length > 1}
          />
        ))}
      </div>

      <div className="starter-buttons">
        {STARTERS.map((color) => (
          <button
            key={color}
            type="button"
            className="ax-chip starter-btn"
            onClick={() => addStarterRow(color)}
            disabled={!canAddStarter}
            title={`all ${color}`}
          >
            {Array.from({ length: 4 }).map((_, j) => (
              <span key={j} className="peg-dot starter-dot peg-dot--square" style={{ background: connectionsHex(color) }} />
            ))}
          </button>
        ))}
      </div>

      <div className="guess-row-actions">
        <button type="button" className="ax-btn" onClick={addRow} disabled={guesses.length >= MAX_ROWS}>
          + add guess row
        </button>
        <span className="text-meta">{guesses.length} / {MAX_ROWS} rows</span>
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

      <button className="ax-btn ax-btn--solid" type="submit" disabled={saving}>
        {saving ? 'saving…' : 'save game'}
      </button>
    </form>
  )
}
