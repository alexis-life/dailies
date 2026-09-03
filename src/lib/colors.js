// SPOTS' own peg palette — pastel, per preference, not the rose theme scale.
export const PEG_COLORS = [
  { key: 'red', label: 'red', hex: '#ffadad' },
  { key: 'blue', label: 'blue', hex: '#a0c4ff' },
  { key: 'green', label: 'green', hex: '#b9fbc0' },
  { key: 'gold', label: 'gold', hex: '#ffd6a5' },
  { key: 'purple', label: 'purple', hex: '#bdb2ff' },
  { key: 'white', label: 'white', hex: '#fffffc' },
]

export const PEG_COLOR_MAP = Object.fromEntries(PEG_COLORS.map((c) => [c.key, c]))

export function pegHex(key) {
  return PEG_COLOR_MAP[key]?.hex ?? '#ccc'
}
