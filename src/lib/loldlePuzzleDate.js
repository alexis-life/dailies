// LoLdle runs one puzzle per calendar day (classic and emoji modes share the
// same daily puzzle number), so any puzzle's date can be derived from its
// number instead of stored. Puzzle #1521 shipped 2026-09-04.
const ANCHOR_PUZZLE_NUMBER = 1521
const ANCHOR_UTC_MS = Date.UTC(2026, 8, 4)
const MS_PER_DAY = 24 * 60 * 60 * 1000

export function loldlePuzzleDateFor(puzzleNumber) {
  const date = new Date(ANCHOR_UTC_MS + (puzzleNumber - ANCHOR_PUZZLE_NUMBER) * MS_PER_DAY)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
}
