import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { computeStats, computeGuessDistribution } from '../../lib/stats'
import StatsPanel from '../../components/StatsPanel'
import GuessDistribution from '../../components/GuessDistribution'
import WordleLogForm from '../../components/WordleLogForm'
import WordleHistoryList from '../../components/WordleHistoryList'

const MAX_ROWS = 6

// Backfilled placeholder entries (see the one-off SQL import) carry this exact
// note so they can count toward stats/distribution without cluttering history,
// since they have no real per-guess data to show in a board replay anyway.
const IMPORTED_NOTE = 'imported from NYT stats (placeholder)'

export default function WordleGame({ isSignedIn }) {
  const [games, setGames] = useState([])
  const [guesses, setGuesses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)

    const gamesRes = await supabase
      .from('dailies_entries')
      .select('*')
      .eq('game', 'wordle')
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
  const distribution = computeGuessDistribution(games, MAX_ROWS)
  const historyGames = games.filter((g) => g.note !== IMPORTED_NOTE)

  return (
    <>
      {error && <p className="ax-meta form-error">error loading data: {error}</p>}
      {loading ? (
        <p className="ax-empty">loading…</p>
      ) : (
        <div className="page-grid">
          <div className="page-col page-col--main">
            <StatsPanel stats={stats} />
            <GuessDistribution distribution={distribution} total={stats.played} />
            <WordleHistoryList
              games={historyGames}
              guessesByGame={guessesByGame}
              isSignedIn={isSignedIn}
              onChanged={loadData}
            />
          </div>
          <div className="page-col page-col--side">
            {isSignedIn ? (
              <WordleLogForm nextPuzzleNumber={nextPuzzleNumber} onSaved={loadData} />
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
