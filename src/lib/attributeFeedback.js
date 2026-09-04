// LoLdle Classic's attribute-comparison grid: each column compares the
// guessed champion against the answer differently depending on whether the
// underlying value is a single category, a set (multiple positions/species/
// regions), or a number with direction. Shared shape so OnePiecedle (same
// style of grid) can reuse it later.
export const LOLDLE_COLUMNS = [
  { key: 'gender', label: 'Gender', type: 'exact' },
  { key: 'positions', label: 'Position(s)', type: 'multi' },
  { key: 'species', label: 'Species', type: 'multi' },
  { key: 'resource', label: 'Resource', type: 'exact' },
  { key: 'rangeType', label: 'Range Type', type: 'exact' },
  { key: 'regions', label: 'Region(s)', type: 'multi' },
  { key: 'releaseYear', label: 'Release Year', type: 'numeric' },
]

// Cycle order per column type — tapping a cell steps through these in order.
export const STATUS_CYCLES = {
  exact: ['red', 'green'],
  multi: ['red', 'amber', 'green'],
  numeric: ['down', 'up', 'green'],
}

export function cycleStatus(type, current) {
  const cycle = STATUS_CYCLES[type]
  const next = cycle[(cycle.indexOf(current) + 1) % cycle.length]
  return next ?? cycle[0]
}

export function defaultStatus(type) {
  return STATUS_CYCLES[type][0]
}

const EMOJI_TO_STATUS = {
  '🟩': 'green',
  '🟥': 'red',
  '🟨': 'amber',
  '🟧': 'amber',
  '⬆️': 'up',
  '⬇️': 'down',
}

// Parses a pasted LoLdle share-text block into guess rows. Each real guess
// line is a run of column glyphs (colors + optional trailing arrow for the
// numeric column) — one glyph per column, in LOLDLE_COLUMNS order. Any line
// that isn't made entirely of recognized glyphs (the "I found #LoLdle..."
// header, blank lines, the URL) is skipped rather than treated as an error.
//
// LoLdle's own share text lists guesses newest-first (the winning all-green
// row is line 1), the opposite of this app's row_index convention (row #1 is
// the first guess, the last row is the winning one) — so the parsed rows are
// reversed before being returned.
export function parseShareText(text, columns = LOLDLE_COLUMNS) {
  const glyphPattern = /🟩|🟥|🟨|🟧|⬆️|⬇️/gu
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean)
  const rows = []

  for (const line of lines) {
    const glyphs = line.match(glyphPattern) ?? []
    const stripped = line.replace(glyphPattern, '').trim()
    if (glyphs.length !== columns.length || stripped) continue

    const statuses = glyphs.map((g) => EMOJI_TO_STATUS[g])
    if (statuses.some((s) => !s)) continue
    rows.push(statuses)
  }

  return rows.reverse()
}

// Pulls a puzzle number out of share text like "champion #1521" if present.
export function parsePuzzleNumber(text) {
  const match = text.match(/#(\d+)/)
  return match ? Number(match[1]) : null
}
