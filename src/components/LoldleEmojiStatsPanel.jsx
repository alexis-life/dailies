import { computeStats } from '../lib/stats'

// Emoji mode has no win/lose, so `won` is always true on its entries — that
// makes computeStats' streak math (won + consecutive puzzle numbers) resolve
// to a "played every day" streak for free, same trick used for Aniguessr.
export default function LoldleEmojiStatsPanel({ games }) {
  const stats = computeStats(games)
  const avgTries = stats.played
    ? Math.round((games.reduce((sum, g) => sum + g.guess_count, 0) / stats.played) * 10) / 10
    : 0
  const oneShots = games.filter((g) => g.guess_count === 1).length

  const primary = [
    { label: 'played', value: stats.played },
    { label: 'avg tries', value: stats.played ? avgTries : '—' },
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
      <p className="text-meta" style={{ marginTop: 10 }}>{oneShots} one-shot {oneShots === 1 ? 'day' : 'days'}</p>
    </div>
  )
}
