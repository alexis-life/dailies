const EXAMPLE_GRID = [
  ['B', 'A', 'N', 'A'],
  ['N', 'A', 'I', 'T'],
  ['F', 'R', 'U', 'L'],
  ['I', 'E', 'E', 'P'],
  ['M', 'L', 'A', 'P'],
]

// F-R-U-I-T is the spangram in this example (touches the left and right
// edges); every other letter belongs to a theme word like BANANA or APPLE.
const SPANGRAM_CELLS = new Set(['2-0', '2-1', '2-2', '1-2', '1-3'])

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
            find theme words that fill the entire board. every puzzle has a theme (like "Hike!")
            that all the words relate to, and no theme words overlap.
          </p>
        </section>

        <section className="help-section">
          <h2 className="label-micro">the spangram</h2>
          <p className="ax-meta">
            one theme word or phrase touches two opposite sides of the board and sums up the
            puzzle's theme, and it highlights in yellow when found, while regular theme words
            highlight in blue.
          </p>
          <div className="help-example-row">
            <div className="strands-grid-example">
              {EXAMPLE_GRID.map((row, r) =>
                row.map((letter, c) => (
                  <span
                    key={`${r}-${c}`}
                    className={`strands-grid-letter ${SPANGRAM_CELLS.has(`${r}-${c}`) ? 'strands-grid-letter--spangram' : 'strands-grid-letter--theme'}`}
                  >
                    {letter}
                  </span>
                ))
              )}
            </div>
          </div>
          <p className="ax-meta help-example-caption">
            here FRUIT is the spangram (yellow), while BANANA and other theme words fill the rest
            of the board (blue).
          </p>
        </section>

        <section className="help-section">
          <h2 className="label-micro">hints</h2>
          <p className="ax-meta">
            stuck? every 3 non-theme words you find earns you a hint, which reveals the letters
            of one theme word. using hints doesn't stop you from solving, but it's worth tracking
            how many you needed.
          </p>
        </section>

        <section className="help-section">
          <h2 className="label-micro">winning</h2>
          <p className="ax-meta">
            you solve the puzzle once every theme word and the spangram have been found. there's
            no limit on guesses or time.
          </p>
        </section>
      </div>
    </div>
  )
}
