import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function OnepiecedleDevilFruitLogForm({ nextPuzzleNumber, onSaved, editingEntry, onCancelEdit }) {
  const [puzzleNumber, setPuzzleNumber] = useState('')
  const [isDaily, setIsDaily] = useState(true)
  const [character, setCharacter] = useState('')
  const [devilFruit, setDevilFruit] = useState('')
  const [tries, setTries] = useState('')
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (editingEntry) return
    setPuzzleNumber((current) => (current === '' ? String(nextPuzzleNumber ?? '') : current))
  }, [nextPuzzleNumber, editingEntry])

  useEffect(() => {
    if (!editingEntry) return
    setPuzzleNumber(String(editingEntry.puzzle_number))
    setIsDaily(editingEntry.is_daily !== false)
    setCharacter((editingEntry.solution?.character ?? '').toLowerCase())
    setDevilFruit((editingEntry.devil_fruit ?? '').toLowerCase())
    setTries(String(editingEntry.guess_count ?? ''))
    setNote(editingEntry.note ?? '')
  }, [editingEntry])

  function resetForm() {
    setPuzzleNumber('')
    setIsDaily(true)
    setCharacter('')
    setDevilFruit('')
    setTries('')
    setNote('')
  }

  function validate() {
    if (!puzzleNumber || Number.isNaN(Number(puzzleNumber))) {
      return 'Enter a puzzle number.'
    }
    if (!tries || Number.isNaN(Number(tries)) || Number(tries) < 1) {
      return 'Enter how many tries it took.'
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
      game: 'onepiecedle_devilfruit',
      puzzle_number: Number(puzzleNumber),
      won: true,
      guess_count: Number(tries),
      solution: character.trim() ? { character: character.trim() } : null,
      devil_fruit: devilFruit.trim() || null,
      note: note.trim() || null,
      is_daily: isDaily,
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
      <h2>{editingEntry ? `edit day #${editingEntry.puzzle_number}` : 'log a game'}</h2>

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
        <label className="label-micro">tries</label>
        <input
          className="ax-input"
          type="number"
          min="1"
          value={tries}
          onChange={(e) => setTries(e.target.value)}
          required
        />
      </div>

      <div className="form-row">
        <label className="label-micro">devil fruit (optional)</label>
        <input
          className="ax-input"
          type="text"
          placeholder={'e.g. "mera mera no mi"'}
          value={devilFruit}
          onChange={(e) => setDevilFruit(e.target.value.toLowerCase())}
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
