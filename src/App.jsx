import { useCallback, useEffect, useState } from 'react'
import { supabase } from './lib/supabaseClient'
import { useSession } from './lib/useSession'
import { computeStats, computeGuessDistribution, computeColorsUsed } from './lib/stats'
import LoginScreen from './components/LoginScreen'
import HelpModal from './components/HelpModal'
import StatsPanel from './components/StatsPanel'
import GuessDistribution from './components/GuessDistribution'
import ColorsUsed from './components/ColorsUsed'
import LogGameForm from './components/LogGameForm'
import HistoryList from './components/HistoryList'

export default function App() {
  const session = useSession()
  const [games, setGames] = useState([])
  const [guesses, setGuesses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showLogin, setShowLogin] = useState(false)
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

  async function handleSignOut() {
    await supabase.auth.signOut()
  }

  const guessesByGame = guesses.reduce((acc, g) => {
    (acc[g.game_id] ??= []).push(g)
    return acc
  }, {})

  const stats = computeStats(games)
  const distribution = computeGuessDistribution(games)
  const colorCounts = computeColorsUsed(guesses)
  const isSignedIn = Boolean(session)

  return (
    <>
      <header className="ax-header">
        <div className="ax-header-titles spots-header-titles">
          <div>
            <h1 className="ax-title">spots tracker</h1>
            <p className="ax-subtitle">personal results tracker for spots</p>
          </div>
          <div className="spots-account-actions">
            <button className="ax-btn spots-account-link" onClick={() => setShowHelp(true)}>how to play</button>
            {session === undefined ? null : isSignedIn ? (
              <button className="ax-btn spots-account-link" onClick={handleSignOut}>sign out</button>
            ) : (
              <button className="ax-btn spots-account-link" onClick={() => setShowLogin(true)}>sign in</button>
            )}
          </div>
        </div>
      </header>

      <main className="page-content">
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
                <LogGameForm onSaved={loadData} />
              ) : (
                <div className="ax-card">
                  <h2>log a game</h2>
                  <p className="ax-meta log-game-signed-out">sign in to log a new game.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {showLogin && <LoginScreen onClose={() => setShowLogin(false)} />}
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
    </>
  )
}
