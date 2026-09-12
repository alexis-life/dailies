import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { daydashPuzzleDateFor } from '../lib/daydashPuzzleDate'
import ExpressoBoardReplay from './ExpressoBoardReplay'

export default function ExpressoHistoryList({ games, isSignedIn, onEdit, onChanged }) {
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
                  <span className="ax-badge badge-count">
                    {game.guess_count} {game.guess_count === 1 ? 'guess' : 'guesses'}
                  </span>
                  <span className="text-meta history-item-date">{daydashPuzzleDateFor(game.puzzle_number)}</span>
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
                  <ExpressoBoardReplay guesses={game.solution?.guesses} />
                  {game.solution?.expression && (
                    <p className="text-meta history-answer">expression: {game.solution.expression}</p>
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
