// Aniguessr's daily share text lists each mode's score by its in-game label,
// e.g. "- Guess The Anime: 10000" — map those labels onto the dailies_entries
// columns from supabase/migrations/008_add_aniguessr_columns.sql.
// A skipped Anidle is omitted from the share entirely (no "Anidle" line).
const LABEL_TO_KEY = {
  'guess the anime': 'screenshot_score',
  'guess the characters': 'characters_score',
  'guess the opening': 'opening_score',
  'guess the ending': 'ending_score',
  'anidle': 'anidle_score',
}

const OTHER_MODE_KEYS = [
  'screenshot_score',
  'characters_score',
  'opening_score',
  'ending_score',
]

// Returns { scores, puzzleNumber } where scores has keys for labels found in
// the text (a partial paste still fills what it can), or null if nothing
// recognizable was found at all. When the paste is a complete day and Anidle
// was left out, scores.anidle_score is '' so the form clears that field.
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

  const mentionsAnidle = lines.some((line) => line.toLowerCase().includes('anidle'))
  const hasAllOtherModes = OTHER_MODE_KEYS.every((key) => Object.hasOwn(scores, key))
  if (!mentionsAnidle && hasAllOtherModes && !Object.hasOwn(scores, 'anidle_score')) {
    scores.anidle_score = ''
  }

  const puzzleMatch = text.match(/#(\d+)/)
  return { scores, puzzleNumber: puzzleMatch ? Number(puzzleMatch[1]) : null }
}
