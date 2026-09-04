import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function StrandsLogForm({ nextPuzzleNumber, onSaved }) {
  const [puzzleNumber, setPuzzleNumber] = useState('')
  const [isDaily, setIsDaily] = useState(true)
  const [themeTitle, setThemeTitle] = useState('')
  const [solved, setSolved] = useState(true)
  const [hintsUsed, setHintsUsed] = useState('0')
  const [spangramFirst, setSpangramFirst] = useState(false)
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    setPuzzleNumber((current) => (current === '' ? String(nextPuzzleNumber ?? '') : current))
  }, [nextPuzzleNumber])

  function resetForm() {
    setPuzzleNumber('')
    setIsDaily(true)
    setThemeTitle('')
    setSolved(true)
    setHintsUsed('0')
    setSpangramFirst(false)
    setNote('')
  }

  function validate() {
    if (!puzzleNumber || Number.isNaN(Number(puzzleNumber))) {
      return 'Enter a puzzle number.'
    }
    if (!themeTitle.trim()) {
      return 'Enter the puzzle theme title.'
    }
    if (hintsUsed === '' || Number.isNaN(Number(hintsUsed)) || Number(hintsUsed) < 0) {
      return 'Enter how many hints you used (0 or more).'
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

    const { error: entryError } = await supabase.from('dailies_entries').insert({
      game: 'strands',
      puzzle_number: Number(puzzleNumber),
      won: solved,
      guess_count: 0,
      theme_title: themeTitle.trim(),
      hints_used: Number(hintsUsed),
      spangram_first: spangramFirst,
      note: note.trim() || null,
      is_daily: isDaily,
    })

    if (entryError) {
      setError(entryError.message)
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
        <label className="label-micro">theme title</label>
        <input
          className="ax-input"
          type="text"
          placeholder={'e.g. "Hike!"'}
          value={themeTitle}
          onChange={(e) => setThemeTitle(e.target.value)}
        />
      </div>

      <div className="form-grid-2">
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
          <label className="label-micro">hints used</label>
          <input
            className="ax-input"
            type="number"
            min="0"
            value={hintsUsed}
            onChange={(e) => setHintsUsed(e.target.value)}
          />
        </div>
      </div>

      <label className="auto-solve-toggle">
        <input
          type="checkbox"
          checked={spangramFirst}
          onChange={(e) => setSpangramFirst(e.target.checked)}
        />
        <span className="toggle-switch-track">
          <span className="toggle-switch-thumb" />
        </span>
        <span className="text-meta">found the spangram first</span>
      </label>

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
