import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { loldlePuzzleDateFor } from '../lib/loldlePuzzleDate'

// Splits into user-perceived characters (grapheme clusters) so a multi-
// codepoint emoji like the "4️⃣" keycap renders as one tile, not three.
const segmenter = typeof Intl !== 'undefined' && Intl.Segmenter
  ? new Intl.Segmenter('en', { granularity: 'grapheme' })
  : null

function splitEmoji(str) {
  if (segmenter) return [...segmenter.segment(str)].map((s) => s.segment)
  return [...str]
}

export default function LoldleEmojiHistoryList({ games, isSignedIn, onEdit, onChanged }) {
  const [expandedId, setExpandedId] = useState(null)
  const [busyId, setBusyId] = useState(null)
  const [error, setError] = useState(null)

  const sorted = [...games].sort((a, b) => b.puzzle_number - a.puzzle_number)

  function toggleExpand(id) {
    setExpandedId((cur) => (cur === id ? null : id))
  }

  async function deleteGame(id) {
    if (!window.confirm('Delete this day?')) return
    setBusyId(id)
    setError(null)
    const { error: deleteError } = await supabase.from('dailies_entries').delete().eq('id', id)
    setBusyId(null)
    if (deleteError) {
      setError(deleteError.message)
      return
    }
    onChanged?.()
  }

  if (sorted.length === 0) {
    return (
      <div className="ax-card">
        <h2>history</h2>
        <p className="ax-empty">no days logged yet.</p>
      </div>
    )
  }

  return (
    <div className="ax-card">
      <h2>history</h2>
      {error && <p className="ax-meta form-error">{error}</p>}
      <div className="history-list">
        {sorted.map((game) => {
          const expanded = expandedId === game.id
          const busy = busyId === game.id
          return (
            <div className="history-item" key={game.id}>
              <button type="button" className="history-item-row" onClick={() => toggleExpand(game.id)}>
                <div className="history-item-row-top">
                  <span className="history-item-puzzle">#{String(game.puzzle_number).padStart(3, '0')}</span>
                  <span className="ax-badge badge-count">
                    {game.guess_count === 1 ? 'one shot!' : `${game.guess_count} tries`}
                  </span>
                  {game.is_daily === false && <span className="ax-badge badge-archive">archive</span>}
                  <span className="text-meta history-item-date">{loldlePuzzleDateFor(game.puzzle_number)}</span>
                  <svg
                    className={`history-item-chevron ${expanded ? 'is-expanded' : ''}`}
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                  >
                    <path d="M3 5.5L7 9.5L11 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </button>

              {expanded && (
                <div className="history-item-detail">
                  {game.is_daily === false && <div className="history-archive-banner">archive</div>}
                  {game.emoji_clues && (
                    <div className="attribute-row-slots" style={{ marginBottom: 8 }}>
                      {splitEmoji(game.emoji_clues).map((clue, i) => (
                        <span key={i} className="emoji-clue-tile">{clue}</span>
                      ))}
                    </div>
                  )}
                  {game.solution?.champion && (
                    <p className="text-meta history-answer">champion: {game.solution.champion}</p>
                  )}
                  {game.note && <p className="ax-meta">{game.note}</p>}

                  {isSignedIn && (
                    <div className="history-item-actions">
                      <div className="history-item-actions-row">
                        <button className="ax-btn" disabled={busy} onClick={() => onEdit?.(game)}>
                          edit
                        </button>
                        <button className="ax-btn" disabled={busy} onClick={() => deleteGame(game.id)}>
                          {busy ? 'deleting…' : 'delete'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
