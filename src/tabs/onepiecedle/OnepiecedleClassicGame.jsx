import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { computeStats, computeGuessDistribution } from '../../lib/stats'
import OnepiecedleClassicStatsPanel from '../../components/OnepiecedleClassicStatsPanel'
import GuessDistribution from '../../components/GuessDistribution'
import OnepiecedleClassicLogForm from '../../components/OnepiecedleClassicLogForm'
import OnepiecedleClassicHistoryList from '../../components/OnepiecedleClassicHistoryList'
import ResetCountdown from '../../components/ResetCountdown'

const DISTRIBUTION_MAX_ROWS = 15

export default function OnepiecedleClassicGame({ isSignedIn }) {
  const [games, setGames] = useState([])
  const [guesses, setGuesses] = useState([])
  const [editingEntry, setEditingEntry] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)

    const gamesRes = await supabase
      .from('dailies_entries')
      .select('*')
      .eq('game', 'onepiecedle_classic')
      .order('puzzle_number', { ascending: true })

    if (gamesRes.error) {
      setError(gamesRes.error.message)
      setLoading(false)
      return
    }

    const entryIds = (gamesRes.data ?? []).map((g) => g.id)
    const guessesRes = entryIds.length
      ? await supabase
          .from('dailies_entry_guesses')
          .select('*')
          .in('entry_id', entryIds)
          .order('row_index', { ascending: true })
      : { data: [], error: null }

    if (guessesRes.error) {
      setError(guessesRes.error.message)
      setLoading(false)
      return
    }

    setGames(gamesRes.data ?? [])
    setGuesses(guessesRes.data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const guessesByGame = guesses.reduce((acc, g) => {
    (acc[g.entry_id] ??= []).push(g)
    return acc
  }, {})

  const dailyGames = games.filter((g) => g.is_daily !== false)
  const nextPuzzleNumber = dailyGames.length
    ? Math.max(...dailyGames.map((g) => g.puzzle_number)) + 1
    : ''

  const stats = computeStats(games)
  const distribution = computeGuessDistribution(games, DISTRIBUTION_MAX_ROWS)

  return (
    <>
      {error && <p className="ax-meta form-error">error loading data: {error}</p>}
      {loading ? (
        <p className="ax-empty">loading…</p>
      ) : (
        <div className="page-grid">
          <div className="page-col page-col--main">
            <OnepiecedleClassicStatsPanel stats={stats} />
            <GuessDistribution distribution={distribution} total={stats.played} />
            <OnepiecedleClassicHistoryList
              games={games}
              guessesByGame={guessesByGame}
              isSignedIn={isSignedIn}
              onEdit={setEditingEntry}
              onChanged={loadData}
            />
          </div>
          <div className="page-col page-col--side">
            <ResetCountdown mode="utc" utcHour={6} />
            {isSignedIn ? (
              <OnepiecedleClassicLogForm
                nextPuzzleNumber={nextPuzzleNumber}
                onSaved={loadData}
                editingEntry={editingEntry}
                editingGuesses={editingEntry ? guessesByGame[editingEntry.id] : null}
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
