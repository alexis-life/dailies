// Aniguessr resets once per day at a fixed UTC instant — confirmed against
// the user's own observed reset of 3:00 PM Pacific (PDT, UTC-7) = 22:00 UTC.
// Anchoring to a fixed UTC hour (rather than a fixed Pacific hour) means this
// stays correct for any viewer's timezone and survives DST shifts on their
// end automatically, since it's always converted from UTC at render time.
const RESET_UTC_HOUR = 22

export function msUntilNextReset(now = new Date()) {
  const next = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), RESET_UTC_HOUR, 0, 0, 0))
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
