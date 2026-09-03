export default function StatsPanel({ stats }) {
  const items = [
    { label: 'played', value: stats.played },
    { label: 'won', value: stats.won },
    { label: 'win %', value: `${stats.winPct}%` },
    { label: 'current streak', value: stats.currentStreak },
    { label: 'best streak', value: stats.bestStreak },
  ]

  return (
    <div className="ax-card">
      <h2>stats</h2>
      <div className="stats-grid">
        {items.map((item) => (
          <div className="ax-stat" key={item.label}>
            <div className="ax-stat-value">{item.value}</div>
            <div className="ax-stat-label">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
