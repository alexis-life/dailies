// SPOTS' own peg palette — pastel, per preference, not the rose theme scale.
export const PEG_COLORS = [
  { key: 'red', label: 'red', hex: '#ffadad' },
  { key: 'blue', label: 'blue', hex: '#a0c4ff' },
  { key: 'green', label: 'green', hex: '#b9fbc0' },
  { key: 'gold', label: 'yellow', hex: '#ffd6a5' },
  { key: 'purple', label: 'purple', hex: '#bdb2ff' },
  { key: 'white', label: 'white', hex: '#fffffc' },
]

export const PEG_COLOR_MAP = Object.fromEntries(PEG_COLORS.map((c) => [c.key, c]))

export function pegHex(key) {
  return PEG_COLOR_MAP[key]?.hex ?? '#ccc'
}

// NYT Connections' own fixed category palette — yellow is always the
// easiest category, purple always the trickiest.
export const CONNECTIONS_COLORS = [
  { key: 'yellow', label: 'yellow', hex: '#f9df6d' },
  { key: 'green', label: 'green', hex: '#a0c35a' },
  { key: 'blue', label: 'blue', hex: '#b0c4ef' },
  { key: 'purple', label: 'purple', hex: '#ba81c5' },
]

export function connectionsHex(key) {
  return CONNECTIONS_COLORS.find((c) => c.key === key)?.hex ?? '#ccc'
}
