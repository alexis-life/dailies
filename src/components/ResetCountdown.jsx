import { useEffect, useState } from 'react'
import { msUntilNextLocalMidnight, msUntilNextUtcHour, formatCountdown } from '../lib/resetCountdown'

function computeMs(mode, utcHour) {
  return mode === 'utc' ? msUntilNextUtcHour(utcHour) : msUntilNextLocalMidnight()
}

export default function ResetCountdown({ mode = 'local', utcHour }) {
  const [remaining, setRemaining] = useState(() => computeMs(mode, utcHour))

  useEffect(() => {
    const id = setInterval(() => setRemaining(computeMs(mode, utcHour)), 1000)
    return () => clearInterval(id)
  }, [mode, utcHour])

  return (
    <div className="ax-card">
      <p className="text-meta">next puzzle in <strong>{formatCountdown(remaining)}</strong></p>
    </div>
  )
}
