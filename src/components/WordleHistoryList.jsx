import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { wordlePuzzleDateFor } from '../lib/wordlePuzzleDate'
import WordleBoardReplay from './WordleBoardReplay'

export default function WordleHistoryList({ games, guessesByGame, isSignedIn, onChanged }) {
  const [expandedId, setExpandedId] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [noteDraft, setNoteDraft] = useState('')
  const [busyId, setBusyId] = useState(null)
  const [error, setError] = useState(null)

  const sorted = [...games].sort((a, b) => b.puzzle_number - a.puzzle_number)

  function toggleExpand(id) {
    setExpandedId((cur) => (cur === id ? null : id))
  }

  function startEdit(game) {
    setEditingId(game.id)
    setNoteDraft(game.note ?? '')
  }

  async function saveNote(id) {
    setBusyId(id)
    setError(null)
    const { error: updateError } = await supabase
      .from('dailies_entries')
      .update({ note: noteDraft.trim() || null })
      .eq('id', id)
    setBusyId(null)
    if (updateError) {
      setError(updateError.message)
      return
    }
    setEditingId(null)
    onChanged?.()
  }

  async function deleteGame(id) {
    if (!window.confirm('Delete this game and its guesses?')) return
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
        <p className="ax-empty">no games logged yet.</p>
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
          const editing = editingId === game.id
          const busy = busyId === game.id
          return (
            <div className="history-item" key={game.id}>
              <button type="button" className="history-item-row" onClick={() => toggleExpand(game.id)}>
                <div className="history-item-row-top">
                  <span className="history-item-puzzle">#{String(game.puzzle_number).padStart(3, '0')}</span>
                  <span className={`ax-badge ${game.won ? 'badge-won' : 'badge-lost'}`}>
                    {game.won ? 'won' : 'lost'}
                  </span>
                  <span className="ax-badge badge-count">
                    {game.guess_count} {game.guess_count === 1 ? 'guess' : 'guesses'}
                  </span>
                  {game.is_daily === false && <span className="ax-badge badge-archive">archive</span>}
                  <span className="text-meta history-item-date">{wordlePuzzleDateFor(game.puzzle_number)}</span>
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
                {game.note && <p className="text-meta history-item-note">{game.note}</p>}
              </button>

              {expanded && (
                <div className="history-item-detail">
                  {game.is_daily === false && <div className="history-archive-banner">archive</div>}
                  <WordleBoardReplay guesses={guessesByGame[game.id] ?? []} />
                  {game.solution && <p className="text-meta history-answer">answer: {game.solution.join('')}</p>}

                  {isSignedIn && (
                    <div className="history-item-actions">
                      {editing ? (
                        <>
                          <textarea
                            className="ax-input"
                            rows={2}
                            value={noteDraft}
                            onChange={(e) => setNoteDraft(e.target.value)}
                          />
                          <div className="history-item-actions-row">
                            <button className="ax-btn ax-btn--solid" disabled={busy} onClick={() => saveNote(game.id)}>
                              save note
                            </button>
                            <button className="ax-btn" disabled={busy} onClick={() => setEditingId(null)}>
                              cancel
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="history-item-actions-row">
                          <button className="ax-btn" disabled={busy} onClick={() => startEdit(game)}>
                            edit note
                          </button>
                          <button className="ax-btn" disabled={busy} onClick={() => deleteGame(game.id)}>
                            {busy ? 'deleting…' : 'delete'}
                          </button>
                        </div>
                      )}
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
