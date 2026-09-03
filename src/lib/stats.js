// Games are expected sorted by puzzle_number ascending for streak math.
export function computeStats(games) {
  const played = games.length
  const won = games.filter((g) => g.won).length
  const winPct = played ? Math.round((won / played) * 100) : 0

  let currentStreak = 0
  let bestStreak = 0
  let running = 0
  for (const g of games) {
    if (g.won) {
      running += 1
      bestStreak = Math.max(bestStreak, running)
    } else {
      running = 0
    }
  }
  // current streak counts back from the most recent game.
  for (let i = games.length - 1; i >= 0; i--) {
    if (games[i].won) currentStreak += 1
    else break
  }

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
