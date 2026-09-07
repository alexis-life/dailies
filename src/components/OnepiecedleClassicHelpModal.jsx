import AttributeSlot from './AttributeSlot'
import { ONEPIECEDLE_COLUMNS } from '../lib/attributeFeedback'

// Built from the user's own real screenshot: a guess whose devil fruit type
// matches the answer's (both Logia) but nothing else does.
const EXAMPLE_STATUSES = ['red', 'red', 'green', 'red', 'down', 'up', 'red', 'up']

export default function OnepiecedleClassicHelpModal({ onClose }) {
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
            guess the daily One Piece character. each guess compares eight properties against
            the answer. guesses are unlimited.
          </p>
        </section>

        <section className="help-section">
          <h2 className="label-micro">reading feedback</h2>
          <p className="ax-meta">
            <strong>green</strong> means an exact match, <strong>amber</strong> means a partial
            match, <strong>red</strong> means no overlap at all. last bounty, height, and first
            arc show an arrow instead of a plain color: ▲ means the answer's value is higher (or
            comes later in the story, for first arc) than your guess, ▼ means lower or earlier.
          </p>
          <div className="help-example-row">
            <div className="attribute-row-slots">
              {ONEPIECEDLE_COLUMNS.map((col, i) => (
                <AttributeSlot key={col.key} type={col.type} value={EXAMPLE_STATUSES[i]} label={col.label} readOnly />
              ))}
            </div>
          </div>
          <p className="ax-meta help-example-caption">
            gender, affiliation, haki, and origin don't match (red); devil fruit matches exactly
            (green, both Logia types); last bounty is lower than the answer's (down arrow), height
            is lower than the answer's (up arrow means the answer is taller), and first arc comes
            before the answer's (up arrow means the answer's debut arc is later).
          </p>
        </section>

        <section className="help-section">
          <h2 className="label-micro">properties</h2>
          <p className="ax-meta">
            <strong>gender</strong>: male, female, or other.<br />
            <strong>affiliation</strong>: the character's crew or organization.<br />
            <strong>devil fruit</strong>: the type of devil fruit eaten, if any (e.g. Logia,
            Paramecia, Zoan), or none.<br />
            <strong>haki</strong>: which haki type(s) the character has; a character can have more
            than one, so this can show amber for a partial overlap.<br />
            <strong>last bounty</strong>: the character's most recent known bounty.<br />
            <strong>height</strong>: the character's height.<br />
            <strong>origin</strong>: the character's region of origin.<br />
            <strong>first arc</strong>: the arc the character debuted in, compared by story
            order.
          </p>
        </section>
      </div>
    </div>
  )
}
