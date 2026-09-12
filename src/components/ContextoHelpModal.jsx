export default function ContextoHelpModal({ onClose }) {
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
            guess the daily secret word. after each guess, you're told its rank: how close it is
            to the answer based on meaning, not spelling. rank 1 is the answer itself; a lower
            number means a closer guess.
          </p>
        </section>

        <section className="help-section">
          <h2 className="label-micro">reading feedback</h2>
          <p className="ax-meta">
            each guess is colored by how close its rank is. <strong>green</strong> means a close
            guess, <strong>yellow</strong> means a medium guess, and <strong>red</strong> means a
            far guess.
          </p>
          <div className="help-example-row">
            <div className="status-cycle-row">
              <span className="status-cycle-dot status-cycle-dot--green" />
              <span className="status-cycle-dot status-cycle-dot--yellow" />
              <span className="status-cycle-dot status-cycle-dot--red" />
            </div>
          </div>
        </section>

        <section className="help-section">
          <h2 className="label-micro">scoring</h2>
          <p className="ax-meta">
            there's no win/lose here, just how many guesses (and optional hints) it took to reach
            rank 1.
          </p>
        </section>
      </div>
    </div>
  )
}
