import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { connectionsHex } from '../lib/colors'

export default function StrandsLogForm({ nextPuzzleNumber, onSaved, editingEntry, editingGuesses, onCancelEdit }) {
  const [puzzleNumber, setPuzzleNumber] = useState('')
  const [isDaily, setIsDaily] = useState(true)
  const [themeTitle, setThemeTitle] = useState('')
  const [solved, setSolved] = useState(true)
  const [sequence, setSequence] = useState([])
  const [note, setNote] = useState('')
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
    setThemeTitle(editingEntry.theme_title ?? '')
    setSolved(editingEntry.won)
    setSequence(sortedGuesses.map((g) => g.payload.type))
    setNote(editingEntry.note ?? '')
  }, [editingEntry, editingGuesses])

  function resetForm() {
    setPuzzleNumber('')
    setIsDaily(true)
    setThemeTitle('')
    setSolved(true)
    setSequence([])
    setNote('')
  }

  function addToSequence(type) {
    setSequence((rows) => [...rows, type])
  }

  function removeFromSequence(i) {
    setSequence((rows) => rows.filter((_, idx) => idx !== i))
  }

  function validate() {
    if (!puzzleNumber || Number.isNaN(Number(puzzleNumber))) {
      return 'Enter a puzzle number.'
    }
    if (!themeTitle.trim()) {
      return 'Enter the puzzle theme title.'
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
      game: 'strands',
      puzzle_number: Number(puzzleNumber),
      won: solved,
      guess_count: 0,
      theme_title: themeTitle.trim(),
      hints_used: sequence.filter((type) => type === 'hint').length,
      spangram_first: sequence[0] === 'spangram',
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

    if (sequence.length) {
      const guessRows = sequence.map((type, i) => ({
        entry_id: entry.id,
        row_index: i,
        payload: { type },
      }))

      const { error: guessesError } = await supabase.from('dailies_entry_guesses').insert(guessRows)

      if (guessesError) {
        if (!editingEntry) await supabase.from('dailies_entries').delete().eq('id', entry.id)
        setError(guessesError.message)
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
        <label className="label-micro">theme title</label>
        <input
          className="ax-input"
          type="text"
          placeholder={'e.g. "Hike!"'}
          value={themeTitle}
          onChange={(e) => setThemeTitle(e.target.value)}
        />
      </div>

      <div className="form-row">
        <label className="label-micro">result</label>
        <div className="puzzle-type-toggle">
          <button
            type="button"
            className={`ax-btn ${solved ? 'ax-btn--solid' : ''}`}
            onClick={() => setSolved(true)}
          >
            solved
          </button>
          <button
            type="button"
            className={`ax-btn ${!solved ? 'ax-btn--solid' : ''}`}
            onClick={() => setSolved(false)}
          >
            not solved
          </button>
        </div>
      </div>

      <div className="form-row">
        <label className="label-micro">found order (optional)</label>
        <div className="strands-sequence-row">
          {sequence.map((type, i) => (
            <button
              key={i}
              type="button"
              className="peg-dot strands-sequence-dot"
              style={{ background: type === 'hint' ? '#9e9e9e' : connectionsHex(type === 'spangram' ? 'yellow' : 'blue') }}
              title={`${type} (click to remove)`}
              onClick={() => removeFromSequence(i)}
            />
          ))}
          {sequence.length === 0 && (
            <span className="peg-dot peg-dot--slot" style={{ borderStyle: 'dashed' }} />
          )}
        </div>
        <div className="strands-add-buttons">
          <button
            type="button"
            className="ax-btn"
            onClick={() => addToSequence('spangram')}
            disabled={sequence.includes('spangram')}
          >
            + spangram
          </button>
          <button type="button" className="ax-btn" onClick={() => addToSequence('word')}>
            + word
          </button>
          <button type="button" className="ax-btn" onClick={() => addToSequence('hint')}>
            + hint
          </button>
        </div>
        <p className="text-meta strands-sequence-count">
          {sequence.length} found · {sequence.filter((t) => t === 'hint').length} hints
        </p>
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
