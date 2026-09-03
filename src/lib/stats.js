// Games are expected sorted by puzzle_number ascending for streak math.
// A streak requires both a win AND an unbroken run of puzzle numbers —
// an unlogged/skipped puzzle breaks it just like a loss would, matching
// how daily-puzzle games (Wordle, SPOTS) define a streak. Archive puzzles
// (played out of date order) don't participate in streaks at all — only
// played/won/win% count them.
export function computeStats(games) {
  const played = games.length
  const won = games.filter((g) => g.won).length
  const winPct = played ? Math.round((won / played) * 100) : 0

  let running = 0
  let bestStreak = 0
  let prevPuzzle = null
  for (const g of games) {
    if (g.is_daily === false) continue
    const isConsecutive = prevPuzzle !== null && g.puzzle_number === prevPuzzle + 1
    running = g.won && (running === 0 || isConsecutive) ? running + 1 : g.won ? 1 : 0
    bestStreak = Math.max(bestStreak, running)
    prevPuzzle = g.puzzle_number
  }
  const currentStreak = running

  return { played, won, winPct, currentStreak, bestStreak }
}

export function computeGuessDistribution(games) {
  const dist = Array(10).fill(0)
  for (const g of games) {
    if (g.won && g.guess_count >= 1 && g.guess_count <= 10) {
      dist[g.guess_count - 1] += 1
    }
  }
  return dist
}

export function computeColorsUsed(guesses) {
  const counts = {}
  for (const guess of guesses) {
    for (const color of guess.colors ?? []) {
      counts[color] = (counts[color] ?? 0) + 1
    }
  }
  return counts
}
