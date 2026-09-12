const COLOR_BY_EMOJI = {
  '🟩': 'green',
  '🟨': 'yellow',
  '⬛': 'gray',
  '⬜': 'gray',
  '🟢': 'green-circle',
  '🟪': 'purple',
}

function colorsFromChars(str) {
  return Array.from(str).map((ch) => COLOR_BY_EMOJI[ch]).filter(Boolean)
}

// Letreco: one guess per line, each line a contiguous run of colored letter
// emoji — except the winning guess, which the game replaces with a bare
// checkmark (✅) instead of revealing an all-green row.
export function parseLetrecoGrid(text) {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean)
  const guesses = []
  for (const line of lines) {
    if (line === '✅') {
      guesses.push({ solved: true })
      continue
    }
    const colors = colorsFromChars(line)
    if (colors.length === 0) continue
    guesses.push({ letters: colors })
  }
  return guesses.length ? guesses : null
}

// Expresso: one guess per line, several space-separated words, each word a
// contiguous run of colored letter emoji.
export function parseExpressoGrid(text) {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean)
  const guesses = []
  for (const line of lines) {
    const segments = line.split(/\s+/).map(colorsFromChars).filter((seg) => seg.length > 0)
    if (segments.length === 0) continue
    guesses.push({ words: segments })
  }
  return guesses.length ? guesses : null
}
