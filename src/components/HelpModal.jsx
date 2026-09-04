import { PEG_COLORS, pegHex } from '../lib/colors'

export default function HelpModal({ onClose }) {
  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose?.() }}>
      <div className="ax-card modal-panel help-modal">
        <div className="help-modal-head">
          <h1 className="ax-title">how to play</h1>
          <button className="ax-btn" type="button" onClick={() => onClose?.()}>close</button>
        </div>

        <section className="help-section">
          <h2 className="label-micro">objective</h2>
          <p className="ax-meta">
            guess the secret 4-color code. there are 6 possible colors, and a color can repeat
            in the code.
          </p>
          <div className="help-swatch-row">
            {PEG_COLORS.map((c) => (
              <span key={c.key} className="peg-dot" style={{ background: c.hex }} title={c.label} />
            ))}
          </div>
        </section>

        <section className="help-section">
          <h2 className="label-micro">making a guess</h2>
          <p className="ax-meta">
            pick a color for each of the 4 slots in a row, then move on to the next row for your
            next guess.
          </p>
        </section>

        <section className="help-section">
          <h2 className="label-micro">reading feedback</h2>
          <p className="ax-meta">
            after each guess you get feedback pegs. a <strong>green</strong> peg means a correct
            color in the correct position. a <strong>yellow</strong> peg means a correct color in
            the wrong position. any leftover pegs are gray. the feedback pegs don't line up with
            the guess slots, they're just counts.
          </p>
          <div className="help-example-row">
            <div className="board-replay-row">
              <div className="board-replay-colors">
                <span className="peg-dot peg-dot--sm" style={{ background: pegHex('red') }} />
                <span className="peg-dot peg-dot--sm" style={{ background: pegHex('blue') }} />
                <span className="peg-dot peg-dot--sm" style={{ background: pegHex('red') }} />
                <span className="peg-dot peg-dot--sm" style={{ background: pegHex('green') }} />
              </div>
              <div className="board-replay-feedback">
                <span className="feedback-peg feedback-peg--green" />
                <span className="feedback-peg feedback-peg--green" />
                <span className="feedback-peg feedback-peg--gold" />
                <span className="feedback-peg feedback-peg--gray" />
              </div>
            </div>
          </div>
          <p className="ax-meta help-example-caption">
            2 green, 1 yellow, 1 gray: meaning 2 of these 4 colors are exactly right, 1 more
            color is right but in the wrong slot, and 1 doesn't belong.
          </p>
        </section>

        <section className="help-section">
          <h2 className="label-micro">winning</h2>
          <p className="ax-meta">
            you have up to 10 guesses to crack the code. you win the moment a guess comes back
            all green.
          </p>
        </section>
      </div>
    </div>
  )
}
