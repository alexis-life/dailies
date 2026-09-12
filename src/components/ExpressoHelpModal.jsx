export default function ExpressoHelpModal({ onClose }) {
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
            find the secret expression — several words of fixed lengths guessed all at once, one
            word per slot, every guess.
          </p>
        </section>

        <section className="help-section">
          <h2 className="label-micro">reading feedback</h2>
          <p className="ax-meta">
            each letter gets its own color, per word: <strong>green</strong> means correct
            position, <strong>yellow</strong> means the letter is in that word but the wrong spot,
            <strong> gray</strong> means it's not in that word at all. <strong>purple</strong> is
            unique to expresso — it means the letter appears somewhere else in the overall
            expression, just not in this word's slot.
          </p>
          <div className="help-example-row">
            <div className="board-replay-row">
              <div className="board-replay-colors">
                <span className="letter-slot letter-slot--display letter-slot--green">S</span>
                <span className="letter-slot letter-slot--display letter-slot--yellow">O</span>
                <span className="letter-slot letter-slot--display letter-slot--purple">U</span>
                <span className="letter-slot letter-slot--display letter-slot--gray">P</span>
              </div>
            </div>
          </div>
          <p className="ax-meta help-example-caption">
            S is correct and in the right spot, O belongs in this word but is in the wrong spot,
            U appears elsewhere in the expression but not in this word, and P doesn't belong
            anywhere in the expression.
          </p>
        </section>

        <section className="help-section">
          <h2 className="label-micro">scoring</h2>
          <p className="ax-meta">
            there's no win/lose here, just how many guesses it took — solving it on your very
            first guess is a "one shot."
          </p>
        </section>
      </div>
    </div>
  )
}
