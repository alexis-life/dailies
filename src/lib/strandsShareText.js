// Strands' own share text lists puzzle number, theme title (in quotes), and
// a flat found-order sequence of emoji wrapped arbitrarily across lines
// (e.g. 4 per row) — the wrapping carries no meaning, so this just scans the
// whole block in order for 💡 (hint), 🟡 (spangram), 🔵 (word).
const EMOJI_TO_TYPE = {
  '💡': 'hint',
  '🟡': 'spangram',
  '🔵': 'word',
}

export function parseStrandsShareText(text) {
  const emojiMatches = text.match(/[💡🟡🔵]/gu) ?? []
  const sequence = emojiMatches.map((e) => EMOJI_TO_TYPE[e])

  const puzzleMatch = text.match(/#(\d+)/)
  const themeMatch = text.match(/[“"]([^”"]+)[”"]/)

  if (!sequence.length && !puzzleMatch && !themeMatch) return null

  return {
    sequence,
    puzzleNumber: puzzleMatch ? Number(puzzleMatch[1]) : null,
    themeTitle: themeMatch ? themeMatch[1].trim() : null,
  }
}
