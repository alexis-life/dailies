import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { aniguessrPuzzleDateFor } from '../lib/aniguessrPuzzleDate'
import { ANIGUESSR_MODES } from './AniguessrLogForm'

function totalFor(game) {
  return ANIGUESSR_MODES.reduce((sum, mode) => sum + (game[mode.key] ?? 0), 0)
}

export default function AniguessrHistoryList({ games, isSignedIn, onEdit, onChanged }) {
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
          const total = totalFor(game)
          return (
            <div className="history-item" key={game.id}>
              <button type="button" className="history-item-row" onClick={() => toggleExpand(game.id)}>
                <div className="history-item-row-top">
                  <span className="history-item-puzzle">#{String(game.puzzle_number).padStart(3, '0')}</span>
                  <span className="ax-badge badge-count">{total.toLocaleString()} pts</span>
                  {game.is_daily === false && <span className="ax-badge badge-archive">archive</span>}
                  <span className="text-meta history-item-date">{aniguessrPuzzleDateFor(game.puzzle_number)}</span>
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
                  <div className="stats-grid">
                    {ANIGUESSR_MODES.map((mode) => (
                      <div className="ax-stat" key={mode.key}>
                        <div className="ax-stat-value">{(game[mode.key] ?? 0).toLocaleString()}</div>
                        <div className="ax-stat-label">{mode.label}</div>
                      </div>
                    ))}
                  </div>
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
