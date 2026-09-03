import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function LoginScreen({ onClose }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    if (signInError) {
      setError(signInError.message)
      setLoading(false)
      return
    }
    setLoading(false)
    onClose?.()
  }

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose?.() }}>
      <div className="ax-card modal-panel" style={{ maxWidth: 360 }}>
        <h1 className="ax-title" style={{ marginBottom: 4 }}>sign in</h1>
        <p className="ax-subtitle" style={{ marginBottom: 20 }}>sign in to log or edit games — viewing stats never requires it.</p>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label className="label-micro">email</label>
            <input
              className="ax-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="form-row">
            <label className="label-micro">password</label>
            <input
              className="ax-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="ax-meta form-error">{error}</p>}
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button className="ax-btn ax-btn--solid" type="submit" disabled={loading}>
              {loading ? 'signing in…' : 'sign in'}
            </button>
            <button className="ax-btn" type="button" onClick={() => onClose?.()}>cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}
