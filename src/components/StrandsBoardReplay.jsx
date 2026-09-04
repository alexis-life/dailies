import { connectionsHex } from '../lib/colors'

export default function StrandsBoardReplay({ guesses }) {
  const sorted = [...guesses].sort((a, b) => a.row_index - b.row_index)

  if (sorted.length === 0) return null

  return (
    <div className="strands-sequence-row">
      {sorted.map((g) => {
        const { type } = g.payload
        const hex = type === 'hint' ? '#9e9e9e' : connectionsHex(type === 'spangram' ? 'yellow' : 'blue')
        return (
          <span
            key={g.id ?? g.row_index}
            className="peg-dot peg-dot--sm"
            style={{ background: hex }}
            title={type}
          />
        )
      })}
      <span className="text-meta">
        {sorted.length} found · {sorted.filter((g) => g.payload.type === 'hint').length} hints
      </span>
    </div>
  )
}
