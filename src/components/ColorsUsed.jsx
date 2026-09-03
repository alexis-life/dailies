import { PEG_COLORS } from '../lib/colors'

export default function ColorsUsed({ counts }) {
  const max = Math.max(1, ...Object.values(counts))

  return (
    <div className="ax-card">
      <h2>colors used</h2>
      <div className="colors-used-list">
        {PEG_COLORS.map((c) => {
          const count = counts[c.key] ?? 0
          return (
            <div className="colors-used-row" key={c.key}>
              <span className="peg-dot peg-dot--sm" style={{ background: c.hex }} />
              <span className="text-meta colors-used-name">{c.label}</span>
              <div className="dist-bar-track">
                <div className="dist-bar-fill" style={{ width: `${(count / max) * 100}%`, background: c.hex }} />
              </div>
              <span className="text-meta colors-used-count">{count}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
