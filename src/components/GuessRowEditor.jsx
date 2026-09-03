import ColorSlot from './ColorSlot'
import PegStepper from './PegStepper'

export default function GuessRowEditor({ index, guess, onChange, onRemove, canRemove, feedback, autoSolve }) {
  function setColor(slotIndex, color) {
    const colors = [...guess.colors]
    colors[slotIndex] = color
    onChange({ ...guess, colors })
  }

  function setGreen(green) {
    const gold = Math.min(guess.gold, 4 - green)
    onChange({ ...guess, green, gold })
  }

  function setGold(gold) {
    const green = Math.min(guess.green, 4 - gold)
    onChange({ ...guess, green, gold })
  }

  return (
    <div className="guess-row-editor">
      <div className="guess-row-top">
        <span className="guess-row-index text-meta">#{index + 1}</span>
        <div className="guess-row-colors">
          {guess.colors.map((c, i) => (
            <ColorSlot key={i} value={c} onChange={(color) => setColor(i, color)} />
          ))}
        </div>
        {autoSolve && (
          <div className="guess-row-feedback">
            {Array.from({ length: feedback ? feedback.green : 0 }).map((_, i) => (
              <span key={`g${i}`} className="feedback-peg feedback-peg--green" />
            ))}
            {Array.from({ length: feedback ? feedback.yellow : 0 }).map((_, i) => (
              <span key={`y${i}`} className="feedback-peg feedback-peg--gold" />
            ))}
            {Array.from({ length: feedback ? Math.max(0, 4 - feedback.green - feedback.yellow) : 4 }).map((_, i) => (
              <span key={`x${i}`} className="feedback-peg feedback-peg--gray" />
            ))}
          </div>
        )}
        {canRemove && (
          <button type="button" className="ax-btn guess-row-remove" onClick={onRemove}>
            remove
          </button>
        )}
      </div>
      {!autoSolve && (
        <div className="guess-row-pegs">
          <PegStepper label="green" value={guess.green} onChange={setGreen} max={4 - guess.gold} />
          <PegStepper label="yellow" value={guess.gold} onChange={setGold} max={4 - guess.green} />
        </div>
      )}
    </div>
  )
}
