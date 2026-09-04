const EXAMPLE_CLUES = ['4️⃣', '🎭', '🪷', '🔫']

export default function LoldleEmojiHelpModal({ onClose }) {
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
            guess the same daily champion as classic mode, but from a set of emoji clues instead of
            an attribute grid. each wrong guess reveals one more emoji, and everyone sees the same
            clue set that day.
          </p>
          <div className="help-example-row">
            <div className="attribute-row-slots">
              {EXAMPLE_CLUES.map((clue, i) => (
                <span key={i} className="emoji-clue-tile">{clue}</span>
              ))}
            </div>
          </div>
          <p className="ax-meta help-example-caption">
            these four emojis (mask, lotus, gun) clue Jhin — a theatrical marksman.
          </p>
        </section>

        <section className="help-section">
          <h2 className="label-micro">scoring</h2>
          <p className="ax-meta">
            there's no win/lose here, just how many tries it took — solving it on your very first
            guess is a "one shot."
          </p>
        </section>
      </div>
    </div>
  )
}
