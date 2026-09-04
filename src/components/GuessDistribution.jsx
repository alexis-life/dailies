const BAR_SCALE = {
  1: 'var(--c1)',
  2: 'var(--c1)',
  3: 'var(--c2)',
  4: 'var(--c3)',
  5: 'var(--c3)',
  6: 'var(--c4)',
  7: 'var(--c5)',
  8: 'var(--c6)',
  9: 'var(--c7)',
  10: 'var(--c8)',
}

export default function GuessDistribution({ distribution, total }) {
  const totalGames = total ?? distribution.reduce((sum, count) => sum + count, 0)
  const max = Math.max(1, ...distribution)

  return (
    <div className="ax-card">
      <h2>guess distribution</h2>
      <p className="ax-subtitle">wins only, by number of guesses</p>
      <div className="dist-chart">
        {distribution.map((count, i) => {
          const pct = totalGames ? Math.round((count / totalGames) * 100) : 0
          return (
            <div className="dist-row" key={i}>
              <span className="dist-row-label text-meta">{i + 1}</span>
              <div className="dist-bar-track">
                <div
                  className="dist-bar-fill"
                  style={{
                    width: `${(count / max) * 100}%`,
                    background: BAR_SCALE[i + 1],
                  }}
                />
              </div>
              <span className="dist-row-count text-meta">{count}</span>
              <span className="dist-row-pct text-meta">({pct}%)</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
