import { useMemo, useState } from 'react'
import { ANIGUESSR_MODE_COLORS } from '../lib/colors'
import { ANIGUESSR_MODES } from './AniguessrLogForm'
import { aniguessrPuzzleDateFor } from '../lib/aniguessrPuzzleDate'

const RANGES = [
  { key: '7d', label: '7 days', days: 7 },
  { key: '1m', label: '1 month', days: 30 },
  { key: '3m', label: '3 months', days: 90 },
]

const CHART_WIDTH = 640
const CHART_HEIGHT = 220
const PADDING_LEFT = 44
const PADDING_BOTTOM = 20
const PADDING_TOP = 10

function niceMax(value) {
  if (value <= 0) return 10000
  const step = value <= 50000 ? 5000 : 10000
  return Math.ceil(value / step) * step
}

export default function AniguessrTrendChart({ games }) {
  const [range, setRange] = useState('7d')
  const [visibleModes, setVisibleModes] = useState(() => new Set(ANIGUESSR_MODES.map((m) => m.key)))

  const gameByPuzzle = useMemo(() => {
    const map = new Map()
    games.forEach((g) => map.set(g.puzzle_number, g))
    return map
  }, [games])

  const days = useMemo(() => {
    const rangeConfig = RANGES.find((r) => r.key === range)
    const dailyGames = games.filter((g) => g.is_daily !== false)
    const latestPuzzle = dailyGames.length ? Math.max(...dailyGames.map((g) => g.puzzle_number)) : null
    if (latestPuzzle === null) return []
    const list = []
    for (let i = rangeConfig.days - 1; i >= 0; i--) {
      const puzzleNumber = latestPuzzle - i
      list.push({ puzzleNumber, game: gameByPuzzle.get(puzzleNumber) ?? null })
    }
    return list
  }, [games, gameByPuzzle, range])

  const maxValue = useMemo(() => {
    let max = 0
    for (const { game } of days) {
      if (!game) continue
      for (const mode of ANIGUESSR_MODES) {
        if (!visibleModes.has(mode.key)) continue
        max = Math.max(max, game[mode.key] ?? 0)
      }
    }
    return niceMax(max)
  }, [days, visibleModes])

  function toggleMode(key) {
    setVisibleModes((cur) => {
      const next = new Set(cur)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const plotWidth = CHART_WIDTH - PADDING_LEFT
  const plotHeight = CHART_HEIGHT - PADDING_TOP - PADDING_BOTTOM
  const xFor = (i) => PADDING_LEFT + (days.length > 1 ? (i / (days.length - 1)) * plotWidth : plotWidth / 2)
  const yFor = (value) => PADDING_TOP + plotHeight - (value / maxValue) * plotHeight

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(maxValue * f))

  if (days.length === 0) {
    return (
      <div className="ax-card">
        <h2>trend</h2>
        <p className="ax-empty">no days logged yet.</p>
      </div>
    )
  }

  return (
    <div className="ax-card">
      <div className="guess-row-actions" style={{ justifyContent: 'space-between' }}>
        <h2 style={{ margin: 0 }}>trend</h2>
        <div className="puzzle-type-toggle">
          {RANGES.map((r) => (
            <button
              key={r.key}
              type="button"
              className={`ax-btn ${range === r.key ? 'ax-btn--solid' : ''}`}
              onClick={() => setRange(r.key)}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <svg viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`} width="100%" style={{ marginTop: 10 }}>
        {yTicks.map((tick) => (
          <g key={tick}>
            <line
              x1={PADDING_LEFT}
              x2={CHART_WIDTH}
              y1={yFor(tick)}
              y2={yFor(tick)}
              stroke="var(--c1)"
              strokeWidth="1"
            />
            <text x={0} y={yFor(tick) + 4} fontSize="10" fill="var(--c7)">
              {tick.toLocaleString()}
            </text>
          </g>
        ))}

        {ANIGUESSR_MODES.filter((mode) => visibleModes.has(mode.key)).map((mode) => {
          const color = ANIGUESSR_MODE_COLORS[mode.key]
          const segments = []
          let current = []
          days.forEach((day, i) => {
            const value = day.game?.[mode.key]
            if (value == null) {
              if (current.length) segments.push(current)
              current = []
              return
            }
            current.push([i, value])
          })
          if (current.length) segments.push(current)

          return (
            <g key={mode.key}>
              {segments.map((seg, segIdx) => {
                const points = seg.map(([i, v]) => `${xFor(i)},${yFor(v)}`).join(' ')
                return (
                  <polyline
                    key={segIdx}
                    points={points}
                    fill="none"
                    stroke={color}
                    strokeWidth="2"
                  />
                )
              })}
              {segments.length > 1 && segments.slice(0, -1).map((seg, segIdx) => {
                const next = segments[segIdx + 1]
                const [i1, v1] = seg[seg.length - 1]
                const [i2, v2] = next[0]
                return (
                  <line
                    key={`gap-${segIdx}`}
                    x1={xFor(i1)}
                    y1={yFor(v1)}
                    x2={xFor(i2)}
                    y2={yFor(v2)}
                    stroke={color}
                    strokeWidth="2"
                    strokeDasharray="4 3"
                    opacity="0.6"
                  />
                )
              })}
              {days.map((day, i) => {
                const value = day.game?.[mode.key]
                if (value == null) return null
                return <circle key={i} cx={xFor(i)} cy={yFor(value)} r="2.5" fill={color} />
              })}
            </g>
          )
        })}

        {days.map((day, i) => {
          if (i % Math.ceil(days.length / 6) !== 0) return null
          return (
            <text key={i} x={xFor(i)} y={CHART_HEIGHT - 4} fontSize="9" fill="var(--c7)" textAnchor="middle">
              {aniguessrPuzzleDateFor(day.puzzleNumber).replace(/, \d{4}$/, '')}
            </text>
          )
        })}
      </svg>

      <div className="stats-grid" style={{ marginTop: 12 }}>
        {ANIGUESSR_MODES.map((mode) => (
          <label key={mode.key} className="text-meta" style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={visibleModes.has(mode.key)}
              onChange={() => toggleMode(mode.key)}
              style={{ accentColor: ANIGUESSR_MODE_COLORS[mode.key] }}
            />
            {mode.label}
          </label>
        ))}
      </div>
    </div>
  )
}
