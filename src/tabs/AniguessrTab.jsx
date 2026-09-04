import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import AniguessrResetCountdown from '../components/AniguessrResetCountdown'
import AniguessrStatsPanel from '../components/AniguessrStatsPanel'
import AniguessrLogForm from '../components/AniguessrLogForm'
import AniguessrHistoryList from '../components/AniguessrHistoryList'

export default function AniguessrTab({ isSignedIn }) {
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
      .eq('game', 'aniguessr')
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

  const dailyGames = games.filter((g) => g.is_daily !== false)
  const nextPuzzleNumber = dailyGames.length
    ? Math.max(...dailyGames.map((g) => g.puzzle_number)) + 1
    : ''

  return (
    <>
      {error && <p className="ax-meta form-error">error loading data: {error}</p>}
      {loading ? (
        <p className="ax-empty">loading…</p>
      ) : (
        <div className="page-grid">
          <div className="page-col page-col--main">
            <AniguessrResetCountdown />
            <AniguessrStatsPanel games={games} />
            <AniguessrHistoryList
              games={games}
              isSignedIn={isSignedIn}
              onEdit={setEditingEntry}
              onChanged={loadData}
            />
          </div>
          <div className="page-col page-col--side">
            {isSignedIn ? (
              <AniguessrLogForm
                nextPuzzleNumber={nextPuzzleNumber}
                onSaved={loadData}
                editingEntry={editingEntry}
                onCancelEdit={() => setEditingEntry(null)}
              />
            ) : (
              <div className="ax-card">
                <h2>log a day</h2>
                <p className="ax-meta log-game-signed-out">sign in to log a new day.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
