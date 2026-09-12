// Contexto/Letreco/Expresso (the "Daydash" game family) never show a puzzle
// number anywhere in their UI or share text — only a calendar date (e.g.
// "09/06/2026"). Rather than inventing an anchor puzzle number that doesn't
// actually exist in these games, puzzle_number here just IS the date,
// encoded as YYYYMMDD (e.g. 20260906) — deterministic and reversible via
// plain string manipulation, no Date-object/timezone handling needed.

// For the log form's <input type="date">, which uses "YYYY-MM-DD".
export function puzzleNumberFromDateInput(value) {
  return Number(value.replace(/-/g, ''))
}

export function dateInputFromPuzzleNumber(puzzleNumber) {
  const s = String(puzzleNumber)
  return `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`
}

export function todaysDateInputValue() {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function daydashPuzzleDateFor(puzzleNumber) {
  const s = String(puzzleNumber)
  const date = new Date(Date.UTC(Number(s.slice(0, 4)), Number(s.slice(4, 6)) - 1, Number(s.slice(6, 8))))
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
}
