import { useEffect, useRef, useState } from 'react'
import { PEG_COLORS } from '../lib/colors'

export default function ColorSlot({ value, onChange, palette = PEG_COLORS, square = false, columns = 3 }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    function onDocClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [open])

  const hex = palette.find((c) => c.key === value)?.hex

  return (
    <div className="color-slot-wrap" ref={ref}>
      <button
        type="button"
        className={`peg-dot peg-dot--slot ${square ? 'peg-dot--square' : ''}`}
        style={{ background: value ? hex : 'transparent', borderStyle: value ? 'solid' : 'dashed' }}
        onClick={() => setOpen((o) => !o)}
        aria-label={value ? `Guess color: ${value}` : 'Pick a color'}
      />
      {open && (
        <div className="color-swatch-popover card" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {palette.map((c) => (
            <button
              key={c.key}
              type="button"
              className={`peg-dot peg-dot--swatch ${square ? 'peg-dot--square' : ''}`}
              style={{ background: c.hex }}
              title={c.label}
              onClick={() => { onChange(c.key); setOpen(false) }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
