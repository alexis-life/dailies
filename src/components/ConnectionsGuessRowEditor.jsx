import ColorSlot from './ColorSlot'
import { CONNECTIONS_COLORS } from '../lib/colors'

export default function ConnectionsGuessRowEditor({ index, guess, onChange, onRemove, canRemove }) {
  function setColor(slotIndex, color) {
    const colors = [...guess.colors]
    colors[slotIndex] = color
    onChange({ ...guess, colors })
  }

  const filled = guess.colors.every((c) => c)
  const solved = filled && guess.colors.every((c) => c === guess.colors[0])

  return (
    <div className="guess-row-editor">
      <div className="guess-row-top">
        <span className="guess-row-index text-meta">#{index + 1}</span>
        <div className="guess-row-colors">
          {guess.colors.map((c, i) => (
            <ColorSlot key={i} value={c} palette={CONNECTIONS_COLORS} square columns={4} onChange={(color) => setColor(i, color)} />
          ))}
        </div>
        {filled && (
          <span className={`ax-badge ${solved ? 'badge-won' : 'badge-lost'}`}>
            {solved ? 'solved' : 'mistake'}
          </span>
        )}
        {canRemove && (
          <button type="button" className="ax-btn guess-row-remove" onClick={onRemove}>
            remove
          </button>
        )}
      </div>
    </div>
  )
}
