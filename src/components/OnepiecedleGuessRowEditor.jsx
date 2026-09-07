import AttributeSlot from './AttributeSlot'
import { ONEPIECEDLE_COLUMNS } from '../lib/attributeFeedback'

export default function OnepiecedleGuessRowEditor({ index, statuses, onChange, onRemove, canRemove }) {
  function setStatus(colIndex, status) {
    const next = [...statuses]
    next[colIndex] = status
    onChange(next)
  }

  return (
    <div className="guess-row-editor">
      <div className="guess-row-top">
        <span className="guess-row-index text-meta">#{index + 1}</span>
        <div className="guess-row-colors attribute-row-slots">
          {ONEPIECEDLE_COLUMNS.map((col, i) => (
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
          <button type="button" className="ax-btn guess-row-remove" onClick={onRemove} aria-label="remove guess">
            ×
          </button>
        )}
      </div>
    </div>
  )
}
