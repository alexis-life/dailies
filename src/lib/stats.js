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

export function computeGuessDistribution(games, maxRows = 10) {
  const dist = Array(maxRows).fill(0)
  for (const g of games) {
    if (g.won && g.guess_count >= 1 && g.guess_count <= maxRows) {
      dist[g.guess_count - 1] += 1
    }
  }
  return dist
}

// Connections-specific: a win always takes exactly 4 correct (category) guesses
// plus however many mistakes were made along the way, and a loss always ends
// at exactly 4 mistakes — so mistake count is derivable from guess_count alone,
// without needing the per-guess payload rows.
export function computeMistakeDistribution(games) {
  const dist = Array(5).fill(0)
  for (const g of games) {
    const mistakes = g.won ? g.guess_count - 4 : 4
    if (mistakes >= 0 && mistakes <= 4) dist[mistakes] += 1
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
