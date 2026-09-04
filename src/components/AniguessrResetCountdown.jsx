import { useEffect, useState } from 'react'
import { msUntilNextReset, formatCountdown } from '../lib/aniguessrReset'

export default function AniguessrResetCountdown() {
  const [remaining, setRemaining] = useState(() => msUntilNextReset())

  useEffect(() => {
    const id = setInterval(() => setRemaining(msUntilNextReset()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="ax-card">
      <p className="text-meta">next puzzle in <strong>{formatCountdown(remaining)}</strong></p>
    </div>
  )
}
