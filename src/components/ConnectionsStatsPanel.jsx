export default function ConnectionsStatsPanel({ stats, perfectPuzzles, purpleFirst }) {
  const primary = [
    { label: 'completed', value: stats.played },
    { label: 'win %', value: `${stats.winPct}%` },
    { label: 'current streak', value: stats.currentStreak },
    { label: 'max streak', value: stats.bestStreak },
  ]
  const secondary = [
    { label: 'perfect puzzles', value: perfectPuzzles },
    { label: 'purple first', value: purpleFirst },
  ]

  return (
    <div className="ax-card">
      <h2>stats</h2>
      <div className="stats-grid stats-grid--four">
        {primary.map((item) => (
          <div className="ax-stat" key={item.label}>
            <div className="ax-stat-value">{item.value}</div>
            <div className="ax-stat-label">{item.label}</div>
          </div>
        ))}
      </div>
      <div className="stats-grid stats-grid--two">
        {secondary.map((item) => (
          <div className="ax-stat" key={item.label}>
            <div className="ax-stat-value">{item.value}</div>
            <div className="ax-stat-label">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
