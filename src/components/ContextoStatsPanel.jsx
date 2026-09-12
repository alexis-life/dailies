import { computeStats } from '../lib/stats'

// No win/lose in Contexto (you always eventually find the word), so `won`
// is always true on its entries — that makes computeStats' streak math
// (won + consecutive puzzle numbers) resolve to a "played every day"
// streak for free, same trick used for Aniguessr/LoLdle Emoji.
export default function ContextoStatsPanel({ games }) {
  const stats = computeStats(games)
  const avgGuesses = stats.played
    ? Math.round(games.reduce((sum, g) => sum + g.guess_count, 0) / stats.played)
    : 0

  const primary = [
    { label: 'played', value: stats.played },
    { label: 'avg guesses', value: stats.played ? avgGuesses : '—' },
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
