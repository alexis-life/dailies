// SPOTS runs one puzzle per calendar day. Puzzle #1 shipped 2024-07-13,
// so any puzzle's date can be derived from its number instead of stored.
const EPOCH_UTC_MS = Date.UTC(2024, 6, 13)
const MS_PER_DAY = 24 * 60 * 60 * 1000

export function puzzleDateFor(puzzleNumber) {
  const date = new Date(EPOCH_UTC_MS + (puzzleNumber - 1) * MS_PER_DAY)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
}
