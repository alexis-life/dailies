export default function WordleHelpModal({ onClose }) {
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
            guess the secret 5-letter word.
          </p>
        </section>

        <section className="help-section">
          <h2 className="label-micro">making a guess</h2>
          <p className="ax-meta">
            type any valid 5-letter word for each guess, then move on to the next row.
          </p>
        </section>

        <section className="help-section">
          <h2 className="label-micro">reading feedback</h2>
          <p className="ax-meta">
            after each guess, every letter tile changes color. a <strong>green</strong> tile means
            that letter is correct and in the right spot. a <strong>yellow</strong> tile means the
            letter is in the word but in the wrong spot. a <strong>gray</strong> tile means the
            letter isn't in the word at all — unlike SPOTS, the colors sit directly on the letters
            you guessed, not as a separate set of pegs.
          </p>
          <div className="help-example-row">
            <div className="board-replay-row">
              <div className="board-replay-colors">
                <span className="letter-slot letter-slot--display letter-slot--gray">C</span>
                <span className="letter-slot letter-slot--display letter-slot--yellow">R</span>
                <span className="letter-slot letter-slot--display letter-slot--gray">A</span>
                <span className="letter-slot letter-slot--display letter-slot--green">N</span>
                <span className="letter-slot letter-slot--display letter-slot--gray">E</span>
              </div>
            </div>
          </div>
          <p className="ax-meta help-example-caption">
            N is correct and in the right spot, R belongs in the word but is in the wrong spot,
            and C, A, E don't belong at all.
          </p>
        </section>

        <section className="help-section">
          <h2 className="label-micro">winning</h2>
          <p className="ax-meta">
            you have up to 6 guesses to find the word. you win the moment a guess comes back all
            green.
          </p>
        </section>
      </div>
    </div>
  )
}
