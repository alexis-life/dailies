const MODES = [
  { label: 'screenshot', max: 10000, desc: 'guess the anime from a random screenshot.' },
  { label: 'characters', max: 8000, desc: 'guess the anime from a character portrait.' },
  { label: 'opening', max: 2500, desc: "guess the anime from its opening clip." },
  { label: 'ending', max: 5000, desc: "guess the anime from its ending clip." },
  { label: 'anidle', max: 8000, desc: 'an attribute-comparison mode: guess the title and compare year, studio, source, score, genres, and tags against the answer.' },
]

export default function AniguessrHelpModal({ onClose }) {
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
            each day has five modes, each scored independently. your daily total is the sum of
            all five scores.
          </p>
        </section>

        <section className="help-section">
          <h2 className="label-micro">the five modes</h2>
          <p className="ax-meta">
            {MODES.map((m) => (
              <span key={m.label} style={{ display: 'block', marginBottom: 6 }}>
                <strong>{m.label}</strong> (max {m.max.toLocaleString()}) — {m.desc}
              </span>
            ))}
          </p>
        </section>

        <section className="help-section">
          <h2 className="label-micro">scoring</h2>
          <p className="ax-meta">
            a perfect day scores 33,500 points (10,000 + 8,000 + 2,500 + 5,000 + 8,000). "hard
            mode" (unlimited anidle) doesn't count toward the daily score, so it isn't tracked
            here.
          </p>
        </section>
      </div>
    </div>
  )
}
