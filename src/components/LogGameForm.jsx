import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import GuessRowEditor from './GuessRowEditor'

const MAX_ROWS = 10

function emptyGuess() {
  return { colors: [null, null, null, null], green: 0, gold: 0 }
}

export default function LogGameForm({ nextPuzzleNumber, onSaved }) {
  const [puzzleNumber, setPuzzleNumber] = useState('')
  const [isDaily, setIsDaily] = useState(true)
  const [note, setNote] = useState('')
  const [guesses, setGuesses] = useState([emptyGuess()])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const won = guesses[guesses.length - 1].green === 4

  // Prefill the next puzzle number, but never clobber something the user
  // already typed — only fills in while the field is still blank.
  useEffect(() => {
    setPuzzleNumber((current) => (current === '' ? String(nextPuzzleNumber ?? '') : current))
  }, [nextPuzzleNumber])

  function updateGuess(i, next) {
    setGuesses((rows) => rows.map((r, idx) => (idx === i ? next : r)))
  }

  function addRow() {
    setGuesses((rows) => (rows.length >= MAX_ROWS ? rows : [...rows, emptyGuess()]))
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
    if (!won && guesses.length < MAX_ROWS) {
      return `Not a win yet — add more guesses (up to ${MAX_ROWS}) or get 4 greens on the last row.`
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

    const { data: game, error: gameError } = await supabase
      .from('spots_games')
      .insert({
        puzzle_number: Number(puzzleNumber),
        won,
        guess_count: guesses.length,
        note: note.trim() || null,
        is_daily: isDaily,
      })
      .select()
      .single()

    if (gameError) {
      setError(gameError.message)
      setSaving(false)
      return
    }

    const guessRows = guesses.map((g, i) => ({
      game_id: game.id,
      row_index: i,
      colors: g.colors,
      green_pegs: g.green,
      gold_pegs: g.gold,
    }))

    const { error: guessesError } = await supabase.from('spots_guesses').insert(guessRows)

    if (guessesError) {
      await supabase.from('spots_games').delete().eq('id', game.id)
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
          {won ? 'won' : guesses.length >= MAX_ROWS ? 'lost' : 'in progress'}
        </span>
      </div>

      <div className="guess-row-list">
        {guesses.map((g, i) => (
          <GuessRowEditor
            key={i}
            index={i}
            guess={g}
            onChange={(next) => updateGuess(i, next)}
            onRemove={() => removeRow(i)}
            canRemove={guesses.length > 1}
          />
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
