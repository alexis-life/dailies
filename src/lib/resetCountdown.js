// Two reset shapes across this app's games: some reset at a fixed UTC
// instant (confirmed against a real observed reset time, e.g. Aniguessr's
// 22:00 UTC or LoLdle's stated "midnight America, UTC-6" = 06:00 UTC), and
// others (SPOTS, the NYT games) reset at midnight in each viewer's own local
// device time — no timezone anchor needed there at all.
export function msUntilNextLocalMidnight(now = new Date()) {
  const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0)
  return next - now
}

export function msUntilNextUtcHour(utcHour, now = new Date()) {
  const next = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), utcHour, 0, 0, 0))
  if (next <= now) next.setUTCDate(next.getUTCDate() + 1)
  return next - now
}

export function formatCountdown(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000))
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return [hours, minutes, seconds].map((n) => String(n).padStart(2, '0')).join(':')
}
