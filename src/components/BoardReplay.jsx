import { pegHex } from '../lib/colors'

export default function BoardReplay({ guesses }) {
  const sorted = [...guesses].sort((a, b) => a.row_index - b.row_index)

  return (
    <div className="board-replay">
      {sorted.map((g) => {
        const grayCount = 4 - g.green_pegs - g.gold_pegs
        return (
          <div className="board-replay-row" key={g.id ?? g.row_index}>
            <div className="board-replay-colors">
              {g.colors.map((c, i) => (
                <span key={i} className="peg-dot peg-dot--sm" style={{ background: pegHex(c) }} />
              ))}
            </div>
            <div className="board-replay-feedback">
              {Array.from({ length: g.green_pegs }).map((_, i) => (
                <span key={`g${i}`} className="feedback-peg feedback-peg--green" />
              ))}
              {Array.from({ length: g.gold_pegs }).map((_, i) => (
                <span key={`y${i}`} className="feedback-peg feedback-peg--gold" />
              ))}
              {Array.from({ length: Math.max(0, grayCount) }).map((_, i) => (
                <span key={`x${i}`} className="feedback-peg feedback-peg--gray" />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
