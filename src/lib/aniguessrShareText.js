// Aniguessr's daily share text lists each mode's score by its in-game label,
// e.g. "- Guess The Anime: 10000" — map those labels onto the dailies_entries
// columns from supabase/migrations/008_add_aniguessr_columns.sql.
const LABEL_TO_KEY = {
  'guess the anime': 'screenshot_score',
  'guess the characters': 'characters_score',
  'guess the opening': 'opening_score',
  'guess the ending': 'ending_score',
  'anidle': 'anidle_score',
}

// Returns { scores, puzzleNumber } where scores only has keys for labels
// actually found in the text (a partial paste still fills what it can), or
// null if nothing recognizable was found at all.
export function parseAniguessrShareText(text) {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean)
  const scores = {}

  for (const line of lines) {
    const match = line.match(/^-\s*(.+?):\s*([\d,]+)\s*$/)
    if (!match) continue
    const key = LABEL_TO_KEY[match[1].trim().toLowerCase()]
    if (!key) continue
    scores[key] = Number(match[2].replace(/,/g, ''))
  }

  if (Object.keys(scores).length === 0) return null

  const puzzleMatch = text.match(/#(\d+)/)
  return { scores, puzzleNumber: puzzleMatch ? Number(puzzleMatch[1]) : null }
}
