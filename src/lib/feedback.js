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
