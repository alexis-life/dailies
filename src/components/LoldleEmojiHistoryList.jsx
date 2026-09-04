import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { loldlePuzzleDateFor } from '../lib/loldlePuzzleDate'

export default function LoldleEmojiHistoryList({ games, isSignedIn, onEdit, onChanged }) {
  const [busyId, setBusyId] = useState(null)
  const [error, setError] = useState(null)

  const sorted = [...games].sort((a, b) => b.puzzle_number - a.puzzle_number)

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
          const busy = busyId === game.id
          return (
            <div className="history-item" key={game.id}>
              <div className="history-item-row">
                <div className="history-item-row-top">
                  <span className="history-item-puzzle">#{String(game.puzzle_number).padStart(3, '0')}</span>
                  <span className="ax-badge badge-count">
                    {game.guess_count === 1 ? 'one shot!' : `${game.guess_count} tries`}
                  </span>
                  {game.is_daily === false && <span className="ax-badge badge-archive">archive</span>}
                  <span className="text-meta history-item-date">{loldlePuzzleDateFor(game.puzzle_number)}</span>
                </div>
                {(game.solution?.champion || game.emoji_clues) && (
                  <p className="text-meta history-item-note">
                    {[game.solution?.champion, game.emoji_clues].filter(Boolean).join(' — ')}
                  </p>
                )}
                {game.note && <p className="text-meta history-item-note">{game.note}</p>}

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
            </div>
          )
        })}
      </div>
    </div>
  )
}
