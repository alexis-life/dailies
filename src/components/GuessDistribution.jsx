export default function GuessDistribution({ distribution }) {
  const max = Math.max(1, ...distribution)

  return (
    <div className="ax-card">
      <h2>guess distribution</h2>
      <p className="ax-subtitle">wins only, by number of guesses</p>
      <div className="dist-chart">
        {distribution.map((count, i) => {
          const t = Math.round((i / (distribution.length - 1)) * 100)
          return (
            <div className="dist-row" key={i}>
              <span className="dist-row-label text-meta">{i + 1}</span>
              <div className="dist-bar-track">
                <div
                  className="dist-bar-fill"
                  style={{
                    width: `${(count / max) * 100}%`,
                    background: `color-mix(in oklab, var(--c8) ${t}%, var(--c3))`,
                  }}
                />
              </div>
              <span className="dist-row-count text-meta">{count}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
