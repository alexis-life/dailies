import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import ExpressoStatsPanel from '../../components/ExpressoStatsPanel'
import ExpressoLogForm from '../../components/ExpressoLogForm'
import ExpressoHistoryList from '../../components/ExpressoHistoryList'

export default function ExpressoGame({ isSignedIn }) {
  const [games, setGames] = useState([])
  const [editingEntry, setEditingEntry] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)

    const gamesRes = await supabase
      .from('dailies_entries')
      .select('*')
      .eq('game', 'expresso')
      .order('puzzle_number', { ascending: true })

    if (gamesRes.error) {
      setError(gamesRes.error.message)
      setLoading(false)
      return
    }

    setGames(gamesRes.data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  return (
    <>
      {error && <p className="ax-meta form-error">error loading data: {error}</p>}
      {loading ? (
        <p className="ax-empty">loading…</p>
      ) : (
        <div className="page-grid">
          <div className="page-col page-col--main">
            <ExpressoStatsPanel games={games} />
            <ExpressoHistoryList
              games={games}
              isSignedIn={isSignedIn}
              onEdit={setEditingEntry}
              onChanged={loadData}
            />
          </div>
          <div className="page-col page-col--side">
            {isSignedIn ? (
              <ExpressoLogForm
                onSaved={loadData}
                editingEntry={editingEntry}
                onCancelEdit={() => setEditingEntry(null)}
              />
            ) : (
              <div className="ax-card">
                <h2>log a game</h2>
                <p className="ax-meta log-game-signed-out">sign in to log a new game.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
