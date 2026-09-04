import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { computeStats, computeGuessDistribution, computeColorsUsed } from '../lib/stats'
import HelpModal from '../components/HelpModal'
import StatsPanel from '../components/StatsPanel'
import GuessDistribution from '../components/GuessDistribution'
import ColorsUsed from '../components/ColorsUsed'
import LogGameForm from '../components/LogGameForm'
import HistoryList from '../components/HistoryList'

export default function SpotsTab({ isSignedIn }) {
  const [games, setGames] = useState([])
  const [guesses, setGuesses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showHelp, setShowHelp] = useState(false)

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)

    const [gamesRes, guessesRes] = await Promise.all([
      supabase.from('spots_games').select('*').order('puzzle_number', { ascending: true }),
      supabase.from('spots_guesses').select('*').order('row_index', { ascending: true }),
    ])

    if (gamesRes.error) {
      setError(gamesRes.error.message)
      setLoading(false)
      return
    }
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
    (acc[g.game_id] ??= []).push(g)
    return acc
  }, {})

  const dailyGames = games.filter((g) => g.is_daily !== false)
  const nextPuzzleNumber = dailyGames.length
    ? Math.max(...dailyGames.map((g) => g.puzzle_number)) + 1
    : ''

  const stats = computeStats(games)
  const distribution = computeGuessDistribution(games)
  const colorCounts = computeColorsUsed(guesses)

  return (
    <>
      <div className="tab-content-head">
        <button className="ax-btn dailies-account-link" onClick={() => setShowHelp(true)}>how to play</button>
      </div>

      {error && <p className="ax-meta form-error">error loading data: {error}</p>}
      {loading ? (
        <p className="ax-empty">loading…</p>
      ) : (
        <div className="page-grid">
          <div className="page-col page-col--main">
            <StatsPanel stats={stats} />
            <GuessDistribution distribution={distribution} />
            <ColorsUsed counts={colorCounts} />
            <HistoryList
              games={games}
              guessesByGame={guessesByGame}
              isSignedIn={isSignedIn}
              onChanged={loadData}
            />
          </div>
          <div className="page-col page-col--side">
            {isSignedIn ? (
              <LogGameForm nextPuzzleNumber={nextPuzzleNumber} onSaved={loadData} />
            ) : (
              <div className="ax-card">
                <h2>log a game</h2>
                <p className="ax-meta log-game-signed-out">sign in to log a new game.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
    </>
  )
}
