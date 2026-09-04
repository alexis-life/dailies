// Connections runs one puzzle per calendar day. Puzzle #1180 shipped 2026-09-03,
// so any puzzle's date can be derived from its number instead of stored.
const ANCHOR_PUZZLE_NUMBER = 1180
const ANCHOR_UTC_MS = Date.UTC(2026, 8, 3)
const MS_PER_DAY = 24 * 60 * 60 * 1000

export function connectionsPuzzleDateFor(puzzleNumber) {
  const date = new Date(ANCHOR_UTC_MS + (puzzleNumber - ANCHOR_PUZZLE_NUMBER) * MS_PER_DAY)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
}
