export default function OnepiecedleDevilFruitHelpModal({ onClose }) {
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
            each day names a devil fruit by its Japanese name (e.g. "Mera Mera no Mi") and asks
            which character ate it. after a few tries you unlock clues to help you find the
            answer: its type, its translated name, or an explanation. if the translated name
            isn't available in your language, you'll see it in English.
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
