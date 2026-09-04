import { CONNECTIONS_COLORS } from '../lib/colors'

export default function ConnectionsHelpModal({ onClose }) {
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
            find groups of four words that share something in common. there are 4 categories,
            color-coded from straightforward (yellow) to tricky (purple):
          </p>
          <div className="help-swatch-row">
            {CONNECTIONS_COLORS.map((c) => (
              <span key={c.key} className="peg-dot peg-dot--square" style={{ background: c.hex }} title={c.label} />
            ))}
          </div>
        </section>

        <section className="help-section">
          <h2 className="label-micro">making a guess</h2>
          <p className="ax-meta">
            pick which category color you think each of the 4 words belongs to for that guess.
          </p>
        </section>

        <section className="help-section">
          <h2 className="label-micro">reading feedback</h2>
          <p className="ax-meta">
            unlike SPOTS or Wordle, there's nothing to compute: a guess is <strong>solved</strong> the
            moment all 4 colors you picked match each other, and a <strong>mistake</strong> otherwise.
          </p>
          <p className="ax-meta help-example-caption">
            each puzzle has exactly one solution, so watch out for words that seem to belong to
            multiple categories.
          </p>
        </section>

        <section className="help-section">
          <h2 className="label-micro">winning</h2>
          <p className="ax-meta">
            you have up to 4 mistakes before you lose. you win the moment all 4 categories are
            solved.
          </p>
        </section>
      </div>
    </div>
  )
}
