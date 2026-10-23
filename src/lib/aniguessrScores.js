// Aniguessr mode columns on dailies_entries. Anidle is the only optional one:
// a day can be saved with it blank, which is stored as NULL and means the
// mode was not played. A stored 0 is a real score.
export const ANIGUESSR_MODES = [
  { key: 'screenshot_score', label: 'screenshot' },
  { key: 'characters_score', label: 'characters' },
  { key: 'opening_score', label: 'opening' },
  { key: 'ending_score', label: 'ending' },
  { key: 'anidle_score', label: 'anidle', optional: true },
]

export function emptyAniguessrScores() {
  return {
    screenshot_score: '',
    characters_score: '',
    opening_score: '',
    ending_score: '',
    anidle_score: '',
  }
}

export function aniguessrScoreWasPlayed(value) {
  return value != null && value !== ''
}

// Sum the mode scores that exist. A skipped anidle (blank or null) adds nothing.
export function aniguessrDailyTotal(scores) {
  return ANIGUESSR_MODES.reduce((sum, mode) => {
    const value = scores?.[mode.key]
    if (!aniguessrScoreWasPlayed(value)) return sum
    const n = Number(value)
    return Number.isNaN(n) ? sum : sum + n
  }, 0)
}

export function validateAniguessrEntry({ puzzleNumber, scores }) {
  if (puzzleNumber === '' || puzzleNumber == null || Number.isNaN(Number(puzzleNumber))) {
    return 'Enter a puzzle number.'
  }
  for (const mode of ANIGUESSR_MODES) {
    const value = scores?.[mode.key]
    if (mode.optional && !aniguessrScoreWasPlayed(value)) continue
    if (!aniguessrScoreWasPlayed(value) || Number.isNaN(Number(value))) {
      return `Enter a score for ${mode.label}.`
    }
  }
  return null
}

// Optional blank scores become NULL. Every other score is stored as a number.
export function aniguessrScoresForSave(scores) {
  const fields = {}
  for (const mode of ANIGUESSR_MODES) {
    const value = scores?.[mode.key]
    fields[mode.key] = mode.optional && !aniguessrScoreWasPlayed(value) ? null : Number(value)
  }
  return fields
}

// Non-optional modes keep the historical average: null counts as 0 and the
// denominator is every logged day. Anidle's average uses only days it was
// played, so a skip does not pull the average down to 0. Returns null when
// there are logged days but anidle was never played.
export function aniguessrModeAverage(games, mode) {
  if (!games.length) return 0
  if (mode.optional) {
    const played = games.filter((g) => aniguessrScoreWasPlayed(g[mode.key]))
    if (!played.length) return null
    const sum = played.reduce((s, g) => s + Number(g[mode.key]), 0)
    return Math.round(sum / played.length)
  }
  const sum = games.reduce((s, g) => s + (g[mode.key] ?? 0), 0)
  return Math.round(sum / games.length)
}

export function aniguessrModePlayedCount(games, mode) {
  if (!mode.optional) return games.length
  return games.filter((g) => aniguessrScoreWasPlayed(g[mode.key])).length
}
