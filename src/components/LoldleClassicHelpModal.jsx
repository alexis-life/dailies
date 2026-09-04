import AttributeSlot from './AttributeSlot'
import { LOLDLE_COLUMNS } from '../lib/attributeFeedback'

// Mirrors loldle.net's own worked example: guessing Irelia when the answer
// is Annie.
const EXAMPLE_STATUSES = ['green', 'amber', 'amber', 'green', 'red', 'red', 'down']

export default function LoldleClassicHelpModal({ onClose }) {
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
            guess the daily League of Legends champion. each guess compares seven properties
            against the answer. guesses are unlimited.
          </p>
        </section>

        <section className="help-section">
          <h2 className="label-micro">reading feedback</h2>
          <p className="ax-meta">
            <strong>green</strong> means an exact match, <strong>orange</strong> means a partial
            match, <strong>red</strong> means no overlap at all. release year shows an arrow
            instead of a color: ▲ means the answer released after your guess, ▼ means before.
          </p>
          <div className="help-example-row">
            <div className="attribute-row-slots">
              {LOLDLE_COLUMNS.map((col, i) => (
                <AttributeSlot key={col.key} type={col.type} value={EXAMPLE_STATUSES[i]} label={col.label} readOnly />
              ))}
            </div>
          </div>
          <p className="ax-meta help-example-caption">
            guessing Irelia when the answer is Annie: gender matches exactly (green), position and
            species partially overlap (orange — both are Middle champions, both Human), resource
            matches exactly (green), range type and region don't overlap at all (red), and Annie
            released before Irelia (red, down arrow).
          </p>
        </section>

        <section className="help-section">
          <h2 className="label-micro">properties</h2>
          <p className="ax-meta">
            <strong>gender</strong> — male, female, or other.<br />
            <strong>position(s)</strong> — top, jungle, middle, bottom, support; a champion can hold
            more than one, so this can show orange for a partial overlap.<br />
            <strong>species</strong> — human, yordle, vastayan, etc.; also multi-valued, can show
            orange.<br />
            <strong>resource</strong> — mana, energy, manaless, etc.<br />
            <strong>range type</strong> — melee, ranged, or melee+ranged.<br />
            <strong>region(s)</strong> — where the champion is from; "Runeterra" if unknown. also
            multi-valued, can show orange.<br />
            <strong>release year</strong> — any year from 2009 to today.
          </p>
        </section>
      </div>
    </div>
  )
}
