import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { parseAniguessrShareText } from '../lib/aniguessrShareText'

const MODES = [
  { key: 'screenshot_score', label: 'screenshot', max: 10000 },
  { key: 'characters_score', label: 'characters', max: 8000 },
  { key: 'opening_score', label: 'opening', max: 2500 },
  { key: 'ending_score', label: 'ending', max: 5000 },
  { key: 'anidle_score', label: 'anidle', max: 8000 },
]

function emptyScores() {
  return { screenshot_score: '', characters_score: '', opening_score: '', ending_score: '', anidle_score: '' }
}

export default function AniguessrLogForm({ nextPuzzleNumber, onSaved, editingEntry, onCancelEdit }) {
  const [puzzleNumber, setPuzzleNumber] = useState('')
  const [isDaily, setIsDaily] = useState(true)
  const [scores, setScores] = useState(emptyScores)
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
    setPuzzleNumber(String(editingEntry.puzzle_number))
    setIsDaily(editingEntry.is_daily !== false)
    setScores({
      screenshot_score: editingEntry.screenshot_score ?? '',
      characters_score: editingEntry.characters_score ?? '',
      opening_score: editingEntry.opening_score ?? '',
      ending_score: editingEntry.ending_score ?? '',
      anidle_score: editingEntry.anidle_score ?? '',
    })
    setNote(editingEntry.note ?? '')
  }, [editingEntry])

  function resetForm() {
    setPuzzleNumber('')
    setIsDaily(true)
    setScores(emptyScores())
    setNote('')
    setPasteText('')
    setPasteError(null)
  }

  function setScore(key, value) {
    setScores((cur) => ({ ...cur, [key]: value }))
  }

  function handleParsePaste() {
    setPasteError(null)
    const parsed = parseAniguessrShareText(pasteText)
    if (!parsed) {
      setPasteError("Couldn't find any scores in that text.")
      return
    }
    setScores((cur) => ({ ...cur, ...parsed.scores }))
    if (parsed.puzzleNumber) setPuzzleNumber(String(parsed.puzzleNumber))
  }

  function validate() {
    if (!puzzleNumber || Number.isNaN(Number(puzzleNumber))) {
      return 'Enter a puzzle number.'
    }
    for (const mode of MODES) {
      const value = scores[mode.key]
      if (value === '' || Number.isNaN(Number(value))) {
        return `Enter a score for ${mode.label}.`
      }
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
      game: 'aniguessr',
      puzzle_number: Number(puzzleNumber),
      won: true,
      guess_count: 0,
      screenshot_score: Number(scores.screenshot_score),
      characters_score: Number(scores.characters_score),
      opening_score: Number(scores.opening_score),
      ending_score: Number(scores.ending_score),
      anidle_score: Number(scores.anidle_score),
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

  const total = MODES.reduce((sum, mode) => sum + (Number(scores[mode.key]) || 0), 0)

  return (
    <form className="ax-card log-game-form" onSubmit={handleSubmit}>
      <h2>{editingEntry ? `edit day #${editingEntry.puzzle_number}` : 'log a day'}</h2>

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
        <label className="label-micro">paste result (optional)</label>
        <textarea
          className="ax-input"
          rows={3}
          placeholder={'paste the summary share text here…'}
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

      <div className="form-grid-2">
        {MODES.map((mode) => (
          <div className="form-row" key={mode.key}>
            <label className="label-micro">{mode.label} (max {mode.max.toLocaleString()})</label>
            <input
              className="ax-input"
              type="number"
              min="0"
              max={mode.max}
              value={scores[mode.key]}
              onChange={(e) => setScore(mode.key, e.target.value)}
              required
            />
          </div>
        ))}
      </div>

      <p className="text-meta">total: {total.toLocaleString()}</p>

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
          {saving ? 'saving…' : editingEntry ? 'save changes' : 'save day'}
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

export { MODES as ANIGUESSR_MODES }
