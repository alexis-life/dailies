export default function StrandsHelpModal({ onClose }) {
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
            find all the hidden theme words in the letter grid, tracing them by connecting
            adjacent letters. every puzzle has a theme (like "Hike!") that all the words relate to.
          </p>
        </section>

        <section className="help-section">
          <h2 className="label-micro">the spangram</h2>
          <p className="ax-meta">
            one special word or phrase touches two opposite sides of the board and sums up the
            puzzle's theme. finding it highlights it in a different color from the regular theme
            words.
          </p>
        </section>

        <section className="help-section">
          <h2 className="label-micro">hints</h2>
          <p className="ax-meta">
            stuck? highlight any 3 non-theme letters to earn a hint, which reveals one theme
            word's location. using hints doesn't stop you from solving, but it's worth tracking
            how many you needed.
          </p>
        </section>

        <section className="help-section">
          <h2 className="label-micro">winning</h2>
          <p className="ax-meta">
            you solve the puzzle once every theme word and the spangram have been found — there's
            no limit on guesses or time.
          </p>
        </section>
      </div>
    </div>
  )
}
