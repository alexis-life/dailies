// Standard Mastermind-style scoring: green for exact color+position matches,
// yellow for remaining color overlaps (duplicate-color safe).
export function computeFeedback(guessColors, solutionColors) {
  const solutionRemaining = [...solutionColors]
  const unmatchedGuesses = []
  let green = 0

  guessColors.forEach((color, i) => {
    if (color === solutionColors[i]) {
      green += 1
      solutionRemaining[i] = null
    } else {
      unmatchedGuesses.push(color)
    }
  })

  let yellow = 0
  for (const color of unmatchedGuesses) {
    const idx = solutionRemaining.indexOf(color)
    if (idx !== -1) {
      yellow += 1
      solutionRemaining[idx] = null
    }
  }

  return { green, yellow }
}

// Same duplicate-safe algorithm as computeFeedback, but returns a per-position
// status ('green' | 'yellow' | 'gray') instead of just counts — needed for games
// like Wordle where feedback is shown directly on each guessed tile, not as a
// separate unordered peg cluster.
export function computeLetterFeedback(guessValues, solutionValues) {
  const statuses = Array(guessValues.length).fill('gray')
  const solutionRemaining = [...solutionValues]

  guessValues.forEach((value, i) => {
    if (value === solutionValues[i]) {
      statuses[i] = 'green'
      solutionRemaining[i] = null
    }
  })

  guessValues.forEach((value, i) => {
    if (statuses[i] === 'green') return
    const idx = solutionRemaining.indexOf(value)
    if (idx !== -1) {
      statuses[i] = 'yellow'
      solutionRemaining[idx] = null
    }
  })

  const green = statuses.filter((s) => s === 'green').length
  const yellow = statuses.filter((s) => s === 'yellow').length
  return { statuses, green, yellow }
}
