// Classic mode has unlimited guesses, so there's no way to actually lose —
// an entry is either "solved" or still "in progress." "win %" would be a
// misleading label here, so this mirrors Strands' "completed"/"solve %"
// wording instead of Wordle's win/lose framing.
export default function LoldleClassicStatsPanel({ stats }) {
  const primary = [
    { label: 'completed', value: stats.played },
    { label: 'solve %', value: `${stats.winPct}%` },
    { label: 'current streak', value: stats.currentStreak },
    { label: 'max streak', value: stats.bestStreak },
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
    </div>
  )
}
