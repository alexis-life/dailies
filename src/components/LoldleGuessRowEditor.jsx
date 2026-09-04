import AttributeSlot from './AttributeSlot'
import { LOLDLE_COLUMNS } from '../lib/attributeFeedback'

export default function LoldleGuessRowEditor({ index, statuses, onChange, onRemove, canRemove }) {
  function setStatus(colIndex, status) {
    const next = [...statuses]
    next[colIndex] = status
    onChange(next)
  }

  const won = statuses.every((s) => s === 'green')

  return (
    <div className="guess-row-editor">
      <div className="guess-row-top">
        <span className="guess-row-index text-meta">#{index + 1}</span>
        <div className="guess-row-colors attribute-row-slots">
          {LOLDLE_COLUMNS.map((col, i) => (
            <AttributeSlot
              key={col.key}
              type={col.type}
              value={statuses[i]}
              label={col.label}
              onChange={(status) => setStatus(i, status)}
            />
          ))}
        </div>
        {canRemove && (
          <button type="button" className="ax-btn guess-row-remove" onClick={onRemove}>
            remove
          </button>
        )}
      </div>
      {won && <div className="loldle-solved-bar">solved</div>}
    </div>
  )
}
