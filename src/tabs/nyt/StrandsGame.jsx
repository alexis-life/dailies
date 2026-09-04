import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { computeStats } from '../../lib/stats'
import StrandsStatsPanel from '../../components/StrandsStatsPanel'
import StrandsLogForm from '../../components/StrandsLogForm'
import StrandsHistoryList from '../../components/StrandsHistoryList'

// Backfilled placeholder entries (see the one-off SQL import) carry this exact
// note so they can count toward stats/streaks without cluttering history,
// since they have no real theme/note data worth showing.
const IMPORTED_NOTE = 'imported from NYT stats (placeholder)'

export default function StrandsGame({ isSignedIn }) {
  const [games, setGames] = useState([])
  const [guesses, setGuesses] = useState([])
  const [spangramFirstSeed, setSpangramFirstSeed] = useState(0)
  const [editingEntry, setEditingEntry] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)

    const gamesRes = await supabase
      .from('dailies_entries')
      .select('*')
      .eq('game', 'strands')
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
        .eq('game', 'strands')
        .eq('key', 'spangram_first_seed')
        .maybeSingle(),
    ])

    if (guessesRes.error) {
      setError(guessesRes.error.message)
      setLoading(false)
      return
    }

    setGames(gamesRes.data ?? [])
    setGuesses(guessesRes.data ?? [])
    setSpangramFirstSeed(counterRes.data?.value ?? 0)
    setLoading(false)
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const dailyGames = games.filter((g) => g.is_daily !== false)
  const nextPuzzleNumber = dailyGames.length
    ? Math.max(...dailyGames.map((g) => g.puzzle_number)) + 1
    : ''

  const guessesByGame = guesses.reduce((acc, g) => {
    (acc[g.entry_id] ??= []).push(g)
    return acc
  }, {})

  const stats = computeStats(games)
  const solvedWithoutHints = games.filter((g) => g.won && (g.hints_used ?? 0) === 0).length
  const spangramFirst = spangramFirstSeed + games.filter((g) => {
    const sequence = guessesByGame[g.id]
    return sequence?.length ? sequence[0].payload.type === 'spangram' : g.spangram_first
  }).length
  const historyGames = games.filter((g) => g.note !== IMPORTED_NOTE)

  return (
    <>
      {error && <p className="ax-meta form-error">error loading data: {error}</p>}
      {loading ? (
        <p className="ax-empty">loading…</p>
      ) : (
        <div className="page-grid">
          <div className="page-col page-col--main">
            <StrandsStatsPanel stats={stats} spangramFirst={spangramFirst} solvedWithoutHints={solvedWithoutHints} />
            <StrandsHistoryList
              games={historyGames}
              guessesByGame={guessesByGame}
              isSignedIn={isSignedIn}
              onEdit={setEditingEntry}
              onChanged={loadData}
            />
          </div>
          <div className="page-col page-col--side">
            {isSignedIn ? (
              <StrandsLogForm
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
