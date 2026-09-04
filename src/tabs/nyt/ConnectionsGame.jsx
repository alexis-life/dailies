import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { computeStats, computeMistakeDistribution } from '../../lib/stats'
import ConnectionsStatsPanel from '../../components/ConnectionsStatsPanel'
import MistakeDistribution from '../../components/MistakeDistribution'
import ConnectionsLogForm from '../../components/ConnectionsLogForm'
import ConnectionsHistoryList from '../../components/ConnectionsHistoryList'

// Backfilled placeholder entries (see the one-off SQL import) carry this exact
// note so they can count toward stats/streaks without cluttering history,
// since they have no real per-guess data to show in a board replay anyway.
const IMPORTED_NOTE = 'imported from NYT stats (placeholder)'

export default function ConnectionsGame({ isSignedIn }) {
  const [games, setGames] = useState([])
  const [guesses, setGuesses] = useState([])
  const [purpleFirstSeed, setPurpleFirstSeed] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)

    const gamesRes = await supabase
      .from('dailies_entries')
      .select('*')
      .eq('game', 'connections')
      .order('puzzle_number', { ascending: true })

    if (gamesRes.error) {
      setError(gamesRes.error.message)
      setLoading(false)
      return
    }

    const entryIds = (gamesRes.data ?? []).map((g) => g.id)
    const [guessesRes, counterRes] = await Promise.all([
      entryIds.length
        ? supabase
            .from('dailies_entry_guesses')
            .select('*')
            .in('entry_id', entryIds)
            .order('row_index', { ascending: true })
        : Promise.resolve({ data: [], error: null }),
      supabase
        .from('dailies_counters')
        .select('value')
        .eq('game', 'connections')
        .eq('key', 'purple_first_seed')
        .maybeSingle(),
    ])

    if (guessesRes.error) {
      setError(guessesRes.error.message)
      setLoading(false)
      return
    }

    setGames(gamesRes.data ?? [])
    setGuesses(guessesRes.data ?? [])
    setPurpleFirstSeed(counterRes.data?.value ?? 0)
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
  const historyGames = games.filter((g) => g.note !== IMPORTED_NOTE)
  const mistakeDistribution = computeMistakeDistribution(games)
  const perfectPuzzles = mistakeDistribution[0]

  const purpleFirstFromReal = games.reduce((count, g) => {
    const rows = (guessesByGame[g.id] ?? []).slice().sort((a, b) => a.row_index - b.row_index)
    const firstSolved = rows.find((r) => r.payload.colors.every((c) => c === r.payload.colors[0]))
    return count + (firstSolved?.payload.colors[0] === 'purple' ? 1 : 0)
  }, 0)
  const purpleFirst = purpleFirstSeed + purpleFirstFromReal

  return (
    <>
      {error && <p className="ax-meta form-error">error loading data: {error}</p>}
      {loading ? (
        <p className="ax-empty">loading…</p>
      ) : (
        <div className="page-grid">
          <div className="page-col page-col--main">
            <ConnectionsStatsPanel stats={stats} perfectPuzzles={perfectPuzzles} purpleFirst={purpleFirst} />
            <MistakeDistribution distribution={mistakeDistribution} total={stats.played} />
            <ConnectionsHistoryList
              games={historyGames}
              guessesByGame={guessesByGame}
              isSignedIn={isSignedIn}
              onChanged={loadData}
            />
          </div>
          <div className="page-col page-col--side">
            {isSignedIn ? (
              <ConnectionsLogForm nextPuzzleNumber={nextPuzzleNumber} onSaved={loadData} />
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
