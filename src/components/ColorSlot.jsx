import { useEffect, useRef, useState } from 'react'
import { PEG_COLORS, pegHex } from '../lib/colors'

export default function ColorSlot({ value, onChange }) {
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

  return (
    <div className="color-slot-wrap" ref={ref}>
      <button
        type="button"
        className="peg-dot peg-dot--slot"
        style={{ background: value ? pegHex(value) : 'transparent', borderStyle: value ? 'solid' : 'dashed' }}
        onClick={() => setOpen((o) => !o)}
        aria-label={value ? `Guess color: ${value}` : 'Pick a color'}
      />
      {open && (
        <div className="color-swatch-popover card">
          {PEG_COLORS.map((c) => (
            <button
              key={c.key}
              type="button"
              className="peg-dot peg-dot--swatch"
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
