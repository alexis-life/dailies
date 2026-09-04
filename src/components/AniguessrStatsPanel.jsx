import { computeStats } from '../lib/stats'
import { ANIGUESSR_MODES } from './AniguessrLogForm'

const MAX_TOTAL = ANIGUESSR_MODES.reduce((sum, mode) => sum + mode.max, 0)

// Aniguessr has no win/lose concept, so `won` is always true on its entries —
// that makes computeStats' streak math (which requires won + consecutive
// puzzle numbers) resolve to exactly the "played every day" streak the site
// itself tracks, for free.
export default function AniguessrStatsPanel({ games }) {
  const stats = computeStats(games)
  const totals = games.map((g) => ANIGUESSR_MODES.reduce((sum, mode) => sum + (g[mode.key] ?? 0), 0))
  const avgTotal = stats.played ? Math.round(totals.reduce((sum, t) => sum + t, 0) / stats.played) : 0
  const perfectDays = totals.filter((t) => t === MAX_TOTAL).length

  const primary = [
    { label: 'played', value: stats.played },
    { label: 'avg total', value: avgTotal.toLocaleString() },
    { label: 'current streak', value: stats.currentStreak },
    { label: 'max streak', value: stats.bestStreak },
  ]

  const modeAverages = ANIGUESSR_MODES.map((mode) => {
    const sum = games.reduce((s, g) => s + (g[mode.key] ?? 0), 0)
    return { label: mode.label, value: stats.played ? Math.round(sum / stats.played).toLocaleString() : 0 }
  })

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
      <p className="text-meta" style={{ marginTop: 10 }}>{perfectDays} perfect {perfectDays === 1 ? 'day' : 'days'} (all {MAX_TOTAL.toLocaleString()} pts)</p>
      <p className="label-micro" style={{ marginTop: 14 }}>average by mode</p>
      <div className="stats-grid">
        {modeAverages.map((item) => (
          <div className="ax-stat" key={item.label}>
            <div className="ax-stat-value">{item.value}</div>
            <div className="ax-stat-label">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
