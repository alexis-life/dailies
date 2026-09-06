import { computeStats } from '../lib/stats'
import { aniguessrPuzzleDateFor } from '../lib/aniguessrPuzzleDate'
import { ANIGUESSR_MODES } from './AniguessrLogForm'

// Aniguessr has no win/lose concept, so `won` is always true on its entries —
// that makes computeStats' streak math (which requires won + consecutive
// puzzle numbers) resolve to exactly the "played every day" streak the site
// itself tracks, for free.
export default function AniguessrStatsPanel({ games }) {
  const stats = computeStats(games)
  const totals = games.map((g) => ANIGUESSR_MODES.reduce((sum, mode) => sum + (g[mode.key] ?? 0), 0))
  const avgTotal = stats.played ? Math.round(totals.reduce((sum, t) => sum + t, 0) / stats.played) : 0

  let highest = null
  games.forEach((g, i) => {
    if (highest === null || totals[i] > highest.total) highest = { total: totals[i], puzzleNumber: g.puzzle_number }
  })

  const primary = [
    { label: 'total active days', value: stats.played },
    { label: 'avg total', value: avgTotal.toLocaleString() },
    { label: 'current streak', value: stats.currentStreak },
    { label: 'max streak', value: stats.bestStreak },
  ]
  if (highest) {
    primary.push({
      label: 'highest daily score',
      value: highest.total.toLocaleString(),
      caption: aniguessrPuzzleDateFor(highest.puzzleNumber),
    })
  }

  const modeAverages = ANIGUESSR_MODES.map((mode) => {
    const sum = games.reduce((s, g) => s + (g[mode.key] ?? 0), 0)
    return { label: mode.label, value: stats.played ? Math.round(sum / stats.played).toLocaleString() : 0 }
  })

  return (
    <div className="ax-card">
      <h2>stats</h2>
      <div className="stats-grid">
        {primary.map((item) => (
          <div className="ax-stat" key={item.label}>
            <div className="ax-stat-value">{item.value}</div>
            <div className="ax-stat-label">{item.label}</div>
            {item.caption && <div className="text-meta">{item.caption}</div>}
          </div>
        ))}
      </div>
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
