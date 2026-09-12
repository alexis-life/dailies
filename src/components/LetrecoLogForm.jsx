import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { puzzleNumberFromDateInput, dateInputFromPuzzleNumber, todaysDateInputValue } from '../lib/daydashPuzzleDate'
import { parseDaydashShareText } from '../lib/daydashShareText'
import { parseLetrecoGrid } from '../lib/daydashGridText'

export default function LetrecoLogForm({ onSaved, editingEntry, onCancelEdit }) {
  const [date, setDate] = useState(todaysDateInputValue())
  const [word, setWord] = useState('')
  const [guesses, setGuesses] = useState('')
  const [note, setNote] = useState('')
  const [grid, setGrid] = useState(null)
  const [pasteText, setPasteText] = useState('')
  const [pasteError, setPasteError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!editingEntry) return
    setDate(dateInputFromPuzzleNumber(editingEntry.puzzle_number))
    setWord(editingEntry.solution?.word ?? '')
    setGuesses(String(editingEntry.guess_count ?? ''))
    setNote(editingEntry.note ?? '')
    setGrid(editingEntry.solution?.guesses ?? null)
  }, [editingEntry])

  function resetForm() {
    setDate(todaysDateInputValue())
    setWord('')
    setGuesses('')
    setNote('')
    setGrid(null)
    setPasteText('')
    setPasteError(null)
  }

  function handleParsePaste() {
    setPasteError(null)
    const parsed = parseDaydashShareText(pasteText)
    const parsedGrid = parseLetrecoGrid(pasteText)
    if (!parsed && !parsedGrid) {
      setPasteError("Couldn't find a date, guess count, or guess grid in that text.")
      return
    }
    if (parsed?.date) setDate(parsed.date)
    if (parsed?.guessCount != null) {
      setGuesses(String(parsed.guessCount))
    } else if (parsedGrid) {
      setGuesses(String(parsedGrid.length))
    }
    if (parsedGrid) setGrid(parsedGrid)
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

    const solution = {
      ...(word.trim() ? { word: word.trim().toLowerCase() } : {}),
      ...(grid ? { guesses: grid } : {}),
    }

    const fields = {
      game: 'letreco',
      puzzle_number: puzzleNumberFromDateInput(date),
      won: true,
      guess_count: Number(guesses),
      solution: Object.keys(solution).length ? solution : null,
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
          placeholder={'paste the "I played letroso.com…" share text here…'}
          value={pasteText}
          onChange={(e) => setPasteText(e.target.value)}
        />
        <div className="guess-row-actions">
          <button type="button" className="ax-btn" onClick={handleParsePaste} disabled={!pasteText.trim()}>
            parse
          </button>
        </div>
        {pasteError && <p className="ax-meta form-error">{pasteError}</p>}
        {grid && !pasteError && (
          <p className="text-meta">saved {grid.length} guess row{grid.length === 1 ? '' : 's'} of colors.</p>
        )}
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
        <label className="label-micro">secret word (optional)</label>
        <input
          className="ax-input"
          type="text"
          placeholder={'e.g. "example"'}
          value={word}
          onChange={(e) => setWord(e.target.value)}
        />
      </div>

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
