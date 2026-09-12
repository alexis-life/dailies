export default function LetrecoHelpModal({ onClose }) {
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
            find the secret word — it can be up to 10 letters, and unlike wordle, your guesses
            don't have to match its length.
          </p>
        </section>

        <section className="help-section">
          <h2 className="label-micro">reading feedback</h2>
          <p className="ax-meta">
            <strong>green</strong> means that letter is correct and in the right position,
            <strong> yellow</strong> means the letter is in the word but in the wrong position.
            letters shown connected together are correct <strong>and</strong> consecutive in the
            secret word (e.g. a connected "EX" at the start means the word begins with those two
            letters in that order).
          </p>
          <div className="help-example-row">
            <div className="board-replay-row">
              <div className="board-replay-colors">
                <span className="letter-slot-group">
                  <span className="letter-slot letter-slot--display letter-slot--green letter-slot--run-start">E</span>
                  <span className="letter-slot letter-slot--display letter-slot--green letter-slot--run-end">X</span>
                </span>
                <span className="letter-slot letter-slot--display letter-slot--yellow">P</span>
                <span className="letter-slot letter-slot--display letter-slot--gray">O</span>
                <span className="letter-slot letter-slot--display letter-slot--gray">S</span>
                <span className="letter-slot letter-slot--display letter-slot--gray">E</span>
                <span className="letter-slot letter-slot--display letter-slot--green letter-slot--pill">D</span>
              </div>
            </div>
          </div>
          <p className="ax-meta help-example-caption">
            E and X are correct and connected at the start, D is correct at the end, P belongs in
            the word but is in the wrong spot, and O, S, E don't belong at all.
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
