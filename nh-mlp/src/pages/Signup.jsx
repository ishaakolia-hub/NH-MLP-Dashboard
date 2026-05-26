import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { C } from '../components/ui'

export default function Signup({ onSwitch }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSignup = async (e) => {
    e.preventDefault()
    setError('')
    if (password !== confirm) { setError('Passwords do not match.'); return }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    setLoading(true)
    const { error: err } = await supabase.auth.signUp({ email, password })
    if (err) setError(err.message)
    else setSuccess(true)
    setLoading(false)
  }

  const inp = {
    width: '100%', padding: '10px 12px', border: `1px solid ${C.border}`,
    borderRadius: 8, background: C.bg, fontFamily: "'DM Sans',sans-serif",
    fontSize: 13, color: C.text, outline: 'none', boxSizing: 'border-box',
  }

  if (success) return (
    <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: '40px 36px', width: 360, textAlign: 'center' }}>
        <div style={{ fontSize: 28, marginBottom: 12 }}>✓</div>
        <div style={{ fontFamily: "'Instrument Serif',serif", fontSize: 22, fontStyle: 'italic', marginBottom: 10 }}>Check your email</div>
        <div style={{ fontSize: 13, color: C.text2, lineHeight: 1.6, marginBottom: 24 }}>
          We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account, then sign in.
        </div>
        <button onClick={onSwitch} style={{ background: C.violet, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 500 }}>
          Go to sign in
        </button>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: '40px 36px', width: 360 }}>
        <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: C.text3, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 4 }}>
          NH Medical-Legal Partnership
        </div>
        <div style={{ fontFamily: "'Instrument Serif',serif", fontSize: 26, fontStyle: 'italic', marginBottom: 28 }}>
          Create account
        </div>

        <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 11, color: C.text2, display: 'block', marginBottom: 5 }}>Email</label>
            <input style={inp} type="email" value={email} onChange={e => setEmail(e.target.value)} required autoFocus />
          </div>
          <div>
            <label style={{ fontSize: 11, color: C.text2, display: 'block', marginBottom: 5 }}>Password</label>
            <input style={inp} type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <div>
            <label style={{ fontSize: 11, color: C.text2, display: 'block', marginBottom: 5 }}>Confirm password</label>
            <input style={inp} type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required />
          </div>

          {error && (
            <div style={{ padding: '8px 12px', background: '#FDEAEA', border: '1px solid #F5C6C6', borderRadius: 7, fontSize: 12, color: C.red }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} style={{
            padding: '11px', background: loading ? C.text3 : C.violet, color: '#fff',
            border: 'none', borderRadius: 8, cursor: loading ? 'default' : 'pointer',
            fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 500, marginTop: 4,
          }}>
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: C.text3 }}>
          Already have an account?{' '}
          <button onClick={onSwitch} style={{ background: 'none', border: 'none', color: C.violet, cursor: 'pointer', fontSize: 12, fontFamily: "'DM Sans',sans-serif" }}>
            Sign in
          </button>
        </div>
      </div>
    </div>
  )
}
