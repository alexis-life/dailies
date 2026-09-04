import { useRef } from 'react'
import LetterSlot from './LetterSlot'

const STATUS_ORDER = ['gray', 'yellow', 'green']

export default function WordleGuessRowEditor({ index, guess, onChange, onRemove, canRemove, feedback, autoSolve, isRevealRow }) {
  const displayStatuses = autoSolve && feedback ? feedback.statuses : guess.statuses
  const slotRefs = useRef([])

  function setLetter(slotIndex, letter) {
    const letters = [...guess.letters]
    letters[slotIndex] = letter
    onChange({ ...guess, letters })
    if (letter && slotIndex < letters.length - 1) {
      slotRefs.current[slotIndex + 1]?.focus()
    }
  }

  function handleKeyDown(slotIndex, e) {
    if (e.key === 'Backspace' && !guess.letters[slotIndex] && slotIndex > 0) {
      slotRefs.current[slotIndex - 1]?.focus()
    }
  }

  function cycleStatus(slotIndex) {
    const statuses = [...guess.statuses]
    const next = STATUS_ORDER[(STATUS_ORDER.indexOf(statuses[slotIndex]) + 1) % STATUS_ORDER.length]
    statuses[slotIndex] = next
    onChange({ ...guess, statuses })
  }

  return (
    <div className="guess-row-editor">
      <div className="guess-row-top">
        <span className="guess-row-index text-meta">{isRevealRow ? 'answer' : `#${index + 1}`}</span>
        <div className="guess-row-colors">
          {guess.letters.map((c, i) => (
            <LetterSlot
              key={i}
              ref={(el) => { slotRefs.current[i] = el }}
              value={c}
              status={isRevealRow ? null : displayStatuses[i]}
              onChange={(letter) => setLetter(i, letter)}
              onKeyDown={(e) => handleKeyDown(i, e)}
            />
          ))}
        </div>
        {canRemove && (
          <button type="button" className="ax-btn guess-row-remove" onClick={onRemove}>
            remove
          </button>
        )}
      </div>
      {!autoSolve && !isRevealRow && (
        <div className="status-cycle-row">
          <span className="text-meta">tap to set color:</span>
          {guess.statuses.map((s, i) => (
            <button
              key={i}
              type="button"
              className={`status-cycle-dot status-cycle-dot--${s}`}
              onClick={() => cycleStatus(i)}
              aria-label={`set letter ${i + 1} status`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
