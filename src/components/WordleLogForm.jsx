import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { computeLetterFeedback } from '../lib/feedback'
import WordleGuessRowEditor from './WordleGuessRowEditor'

const MAX_ROWS = 6
const WORD_LENGTH = 5

const STARTERS = ['PENIS']

function emptyGuess() {
  return { letters: Array(WORD_LENGTH).fill(null), statuses: Array(WORD_LENGTH).fill('gray') }
}

export default function WordleLogForm({ nextPuzzleNumber, onSaved, editingEntry, editingGuesses, onCancelEdit }) {
  const [puzzleNumber, setPuzzleNumber] = useState('')
  const [isDaily, setIsDaily] = useState(true)
  const [autoSolve, setAutoSolve] = useState(true)
  const [note, setNote] = useState('')
  const [guesses, setGuesses] = useState([emptyGuess()])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const rowCap = autoSolve ? MAX_ROWS + 1 : MAX_ROWS
  const hasRevealRow = autoSolve && guesses.length > MAX_ROWS
  const revealRow = hasRevealRow ? guesses[MAX_ROWS] : null
  const revealFilled = revealRow ? revealRow.letters.every((c) => c) : false

  const realGuesses = guesses.slice(0, MAX_ROWS)
  const filledRealGuesses = realGuesses.filter((g) => g.letters.every((c) => c))
  const lastFilledRealGuess = filledRealGuesses[filledRealGuesses.length - 1]

  const solution = hasRevealRow
    ? (revealFilled ? revealRow.letters : null)
    : (lastFilledRealGuess?.letters ?? null)
  const solutionReady = autoSolve && Boolean(solution)

  const lastGuess = guesses[guesses.length - 1]
  const won = hasRevealRow
    ? false
    : autoSolve
      ? solutionReady
      : lastGuess.statuses.every((s) => s === 'green')
  const lastGuessEmpty = lastGuess.letters.every((c) => !c)
  const canAddStarter = !hasRevealRow && (lastGuessEmpty || guesses.length < rowCap)

  const feedbackByRow = guesses.map((g, i) => {
    if (hasRevealRow && i === MAX_ROWS) return null
    if (!solutionReady) return null
    return g.letters.every((c) => c) ? computeLetterFeedback(g.letters, solution) : null
  })

  useEffect(() => {
    if (editingEntry) return
    setPuzzleNumber((current) => (current === '' ? String(nextPuzzleNumber ?? '') : current))
  }, [nextPuzzleNumber, editingEntry])

  useEffect(() => {
    if (!editingEntry) return
    const sortedGuesses = [...(editingGuesses ?? [])].sort((a, b) => a.row_index - b.row_index)
    setPuzzleNumber(String(editingEntry.puzzle_number))
    setIsDaily(editingEntry.is_daily !== false)
    setAutoSolve(false)
    setNote(editingEntry.note ?? '')
    setGuesses(
      sortedGuesses.length
        ? sortedGuesses.map((g) => ({ letters: g.payload.letters, statuses: g.payload.statuses }))
        : [emptyGuess()]
    )
  }, [editingEntry, editingGuesses])

  function updateGuess(i, next) {
    setGuesses((rows) => rows.map((r, idx) => (idx === i ? next : r)))
  }

  function addRow() {
    setGuesses((rows) => (rows.length >= rowCap ? rows : [...rows, emptyGuess()]))
  }

  function addStarterRow(word) {
    setGuesses((rows) => {
      const last = rows[rows.length - 1]
      const filled = { letters: word.split(''), statuses: Array(WORD_LENGTH).fill('gray') }
      if (last.letters.every((c) => !c)) {
        return rows.map((r, idx) => (idx === rows.length - 1 ? filled : r))
      }
      return rows.length >= rowCap ? rows : [...rows, filled]
    })
  }

  function removeRow(i) {
    setGuesses((rows) => rows.filter((_, idx) => idx !== i))
  }

  function resetForm() {
    setPuzzleNumber('')
    setIsDaily(true)
    setAutoSolve(true)
    setNote('')
    setGuesses([emptyGuess()])
  }

  function validate() {
    if (!puzzleNumber || Number.isNaN(Number(puzzleNumber))) {
      return 'Enter a puzzle number.'
    }
    for (const g of realGuesses) {
      if (g.letters.some((c) => !c)) {
        return `Every guess row needs all ${WORD_LENGTH} letters filled in.`
      }
    }
    if (hasRevealRow) {
      if (!revealFilled) {
        return `Fill in the revealed solution's ${WORD_LENGTH} letters before saving.`
      }
      return null
    }
    if (autoSolve && !solutionReady) {
      return `Fill in all ${WORD_LENGTH} letters on your final (winning) guess so feedback can be calculated.`
    }
    if (!won && guesses.length < MAX_ROWS) {
      return `Not a win yet: add more guesses (up to ${MAX_ROWS}) or mark all ${WORD_LENGTH} letters green on the last row.`
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

    const fields = {
      game: 'wordle',
      puzzle_number: Number(puzzleNumber),
      won,
      guess_count: hasRevealRow ? MAX_ROWS : guesses.length,
      note: note.trim() || null,
      is_daily: isDaily,
      solution: editingEntry ? editingEntry.solution : hasRevealRow ? revealRow.letters : null,
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

    const guessRows = realGuesses.map((g, i) => {
      const feedback = feedbackByRow[i]
      return {
        entry_id: entry.id,
        row_index: i,
        payload: {
          letters: g.letters,
          statuses: feedback ? feedback.statuses : g.statuses,
        },
      }
    })

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
        <label className="label-micro">result</label>
        <span className={`ax-badge ${won ? 'badge-won' : 'badge-lost'}`}>
          {won ? 'won' : hasRevealRow || guesses.length >= MAX_ROWS ? 'lost' : 'in progress'}
        </span>
      </div>

      <label className="auto-solve-toggle">
        <input
          type="checkbox"
          checked={autoSolve}
          onChange={(e) => setAutoSolve(e.target.checked)}
        />
        <span className="toggle-switch-track">
          <span className="toggle-switch-thumb" />
        </span>
        <span className="text-meta">auto-calculate feedback</span>
      </label>

      <div className="guess-row-list">
        {guesses.map((g, i) => (
          <WordleGuessRowEditor
            key={i}
            feedback={feedbackByRow[i]}
            autoSolve={autoSolve}
            isRevealRow={hasRevealRow && i === MAX_ROWS}
            index={i}
            guess={g}
            onChange={(next) => updateGuess(i, next)}
            onRemove={() => removeRow(i)}
            canRemove={guesses.length > 1}
          />
        ))}
      </div>

      <div className="starter-buttons">
        {STARTERS.map((word) => (
          <button
            key={word}
            type="button"
            className="ax-chip starter-btn"
            onClick={() => addStarterRow(word)}
            disabled={!canAddStarter}
            title={word}
          >
            {word}
          </button>
        ))}
      </div>

      <div className="guess-row-actions">
        <button type="button" className="ax-btn" onClick={addRow} disabled={guesses.length >= rowCap}>
          {autoSolve && guesses.length === MAX_ROWS ? '+ add solution' : '+ add guess row'}
        </button>
        <span className="text-meta">{guesses.length} / {rowCap} rows</span>
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
