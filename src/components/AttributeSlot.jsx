import { cycleStatus, defaultStatus } from '../lib/attributeFeedback'

const SWATCH_HEX = {
  green: '#a0c35a',
  red: '#ffadad',
  amber: '#ffd6a5',
}

export default function AttributeSlot({ type, value, onChange, readOnly, label }) {
  const status = value ?? defaultStatus(type)
  const isArrow = status === 'up' || status === 'down'

  function handleClick() {
    if (readOnly) return
    onChange?.(cycleStatus(type, status))
  }

  return (
    <button
      type="button"
      className={`attribute-slot ${isArrow ? 'attribute-slot--arrow' : ''} ${readOnly ? 'attribute-slot--readonly' : ''}`}
      style={!isArrow ? { background: SWATCH_HEX[status] } : undefined}
      onClick={handleClick}
      disabled={readOnly}
      title={label}
      aria-label={label ? `${label}: ${status}` : status}
    >
      {isArrow && (status === 'up' ? '▲' : '▼')}
    </button>
  )
}
