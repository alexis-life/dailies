// All three Daydash games share the same summary-line phrasing:
// "I played <site> MM/DD/YYYY and got it in N guesses[ and M hints]."
// Contexto's line adds the trailing "and M hints" clause; Letreco/Expresso don't.
export function parseDaydashShareText(text) {
  const dateMatch = text.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/)
  const guessMatch = text.match(/(\d+)\s*guesses?/i)
  const hintsMatch = text.match(/(\d+)\s*hints?/i)

  if (!dateMatch && !guessMatch) return null

  const date = dateMatch
    ? `${dateMatch[3]}-${dateMatch[1].padStart(2, '0')}-${dateMatch[2].padStart(2, '0')}`
    : null

  return {
    date,
    guessCount: guessMatch ? Number(guessMatch[1]) : null,
    hints: hintsMatch ? Number(hintsMatch[1]) : null,
  }
}
