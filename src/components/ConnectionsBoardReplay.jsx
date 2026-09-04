import { connectionsHex } from '../lib/colors'

export default function ConnectionsBoardReplay({ guesses }) {
  const sorted = [...guesses].sort((a, b) => a.row_index - b.row_index)

  return (
    <div className="board-replay">
      {sorted.map((g) => {
        const { colors } = g.payload
        const solved = colors.every((c) => c === colors[0])
        return (
          <div className="board-replay-row" key={g.id ?? g.row_index}>
            <span className="board-replay-index text-meta">#{g.row_index + 1}</span>
            <div className="board-replay-colors">
              {colors.map((c, i) => (
                <span key={i} className="peg-dot peg-dot--sm peg-dot--square" style={{ background: connectionsHex(c) }} />
              ))}
            </div>
            <span className={`ax-badge ${solved ? 'badge-won' : 'badge-lost'}`} style={{ marginLeft: 'auto' }}>
              {solved ? 'solved' : 'mistake'}
            </span>
          </div>
        )
      })}
    </div>
  )
}
