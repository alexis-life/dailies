import AttributeSlot from './AttributeSlot'
import { LOLDLE_COLUMNS } from '../lib/attributeFeedback'

export default function LoldleBoardReplay({ guesses }) {
  const sorted = [...guesses].sort((a, b) => a.row_index - b.row_index)

  return (
    <div className="board-replay">
      {sorted.map((g) => {
        const statuses = g.payload.statuses ?? []
        return (
          <div className="board-replay-row" key={g.id ?? g.row_index}>
            <span className="board-replay-index text-meta">#{g.row_index + 1}</span>
            <div className="board-replay-colors attribute-row-slots">
              {LOLDLE_COLUMNS.map((col, i) => (
                <AttributeSlot key={col.key} type={col.type} value={statuses[i]} label={col.label} readOnly />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
