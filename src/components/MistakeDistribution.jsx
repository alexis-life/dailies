const BAR_SCALE = {
  0: 'var(--c1)',
  1: 'var(--c2)',
  2: 'var(--c3)',
  3: 'var(--c5)',
  4: 'var(--c7)',
}

export default function MistakeDistribution({ distribution, total }) {
  const totalGames = total ?? distribution.reduce((sum, count) => sum + count, 0)
  const max = Math.max(1, ...distribution)

  return (
    <div className="ax-card">
      <h2>mistake distribution</h2>
      <p className="ax-subtitle">by number of mistakes made (4 mistakes = loss)</p>
      <div className="dist-chart">
        {distribution.map((count, i) => {
          const pct = totalGames ? Math.round((count / totalGames) * 100) : 0
          return (
            <div className="dist-row" key={i}>
              <span className="dist-row-label text-meta">{i}</span>
              <div className="dist-bar-track">
                <div
                  className="dist-bar-fill"
                  style={{
                    width: `${(count / max) * 100}%`,
                    background: BAR_SCALE[i],
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
