import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { puzzleNumberFromDateInput, dateInputFromPuzzleNumber, todaysDateInputValue } from '../lib/daydashPuzzleDate'
import { parseDaydashShareText } from '../lib/daydashShareText'

export default function ContextoLogForm({ onSaved, editingEntry, onCancelEdit }) {
  const [date, setDate] = useState(todaysDateInputValue())
  const [word, setWord] = useState('')
  const [guesses, setGuesses] = useState('')
  const [hints, setHints] = useState('')
  const [note, setNote] = useState('')
  const [pasteText, setPasteText] = useState('')
  const [pasteError, setPasteError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!editingEntry) return
    setDate(dateInputFromPuzzleNumber(editingEntry.puzzle_number))
    setWord(editingEntry.solution?.word ?? '')
    setGuesses(String(editingEntry.guess_count ?? ''))
    setHints(String(editingEntry.hints_used ?? ''))
    setNote(editingEntry.note ?? '')
  }, [editingEntry])

  function resetForm() {
    setDate(todaysDateInputValue())
    setWord('')
    setGuesses('')
    setHints('')
    setNote('')
    setPasteText('')
    setPasteError(null)
  }

  function handleParsePaste() {
    setPasteError(null)
    const parsed = parseDaydashShareText(pasteText)
    if (!parsed) {
      setPasteError("Couldn't find a date or guess count in that text.")
      return
    }
    if (parsed.date) setDate(parsed.date)
    if (parsed.guessCount != null) setGuesses(String(parsed.guessCount))
    if (parsed.hints != null) setHints(String(parsed.hints))
    setNote(pasteText.trim())
  }

  function validate() {
    if (!date) return 'Enter a date.'
    if (!guesses || Number.isNaN(Number(guesses)) || Number(guesses) < 1) {
      return 'Enter how many guesses it took.'
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
      game: 'contexto',
      puzzle_number: puzzleNumberFromDateInput(date),
      won: true,
      guess_count: Number(guesses),
      hints_used: hints.trim() ? Number(hints) : 0,
      solution: word.trim() ? { word: word.trim().toLowerCase() } : null,
      note: note.trim() || null,
      is_daily: true,
    }

    if (editingEntry) {
      const { error: entryError } = await supabase
        .from('dailies_entries')
        .update(fields)
        .eq('id', editingEntry.id)
      if (entryError) {
        setError(entryError.message)
        setSaving(false)
        return
      }
    } else {
      const { error: entryError } = await supabase.from('dailies_entries').insert(fields)
      if (entryError) {
        setError(entryError.message)
        setSaving(false)
        return
      }
    }

    setSaving(false)
    resetForm()
    onSaved?.()
    onCancelEdit?.()
  }

  return (
    <form className="ax-card log-game-form" onSubmit={handleSubmit}>
      <h2>{editingEntry ? 'edit day' : 'log a game'}</h2>

      <div className="form-row">
        <label className="label-micro">paste result (optional)</label>
        <textarea
          className="ax-input"
          rows={3}
          placeholder={'paste the "I played contexto.me…" share text here…'}
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

      <div className="form-row">
        <label className="label-micro">date</label>
        <input
          className="ax-input"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>

      <div className="form-row">
        <label className="label-micro">answer word (optional)</label>
        <input
          className="ax-input"
          type="text"
          placeholder={'e.g. "mantle"'}
          value={word}
          onChange={(e) => setWord(e.target.value)}
        />
      </div>

      <div className="form-grid-2">
        <div className="form-row">
          <label className="label-micro">guesses</label>
          <input
            className="ax-input"
            type="number"
            min="1"
            value={guesses}
            onChange={(e) => setGuesses(e.target.value)}
            required
          />
        </div>
        <div className="form-row">
          <label className="label-micro">hints used</label>
          <input
            className="ax-input"
            type="number"
            min="0"
            value={hints}
            onChange={(e) => setHints(e.target.value)}
          />
        </div>
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
