import AttributeSlot from './AttributeSlot'
import { ONEPIECEDLE_COLUMNS } from '../lib/attributeFeedback'

export default function OnepiecedleBoardReplay({ guesses }) {
  const sorted = [...guesses].sort((a, b) => a.row_index - b.row_index)

  return (
    <div className="board-replay">
      {sorted.map((g) => {
        const statuses = g.payload.statuses ?? []
        return (
          <div className="board-replay-row" key={g.id ?? g.row_index}>
            <span className="board-replay-index text-meta">#{g.row_index + 1}</span>
            <div className="board-replay-colors attribute-row-slots">
              {ONEPIECEDLE_COLUMNS.map((col, i) => (
                <AttributeSlot key={col.key} type={col.type} value={statuses[i]} label={col.label} readOnly />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
