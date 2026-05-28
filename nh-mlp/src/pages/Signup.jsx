import { useState } from 'react'
import { supabase } from '../lib/supabase'

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

  const inputStyle = {
    width: '100%', padding: '11px 14px',
    background: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: 10,
    fontFamily: "'DM Sans',sans-serif", fontSize: 13,
    color: '#0F172A', outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.15s, box-shadow 0.15s',
  }

  const cardStyle = {
    background: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: 22, padding: '44px 40px', width: 390,
    boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
    animation: 'fadeSlideUp 0.4s cubic-bezier(0.16,1,0.3,1) forwards',
  }

  const pageWrap = {
    minHeight: '100vh',
    background: '#F8FAFC',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  }

  if (success) return (
    <div style={pageWrap}>
      <div style={{ ...cardStyle, textAlign: 'center' }}>
        <div style={{
          width: 54, height: 54,
          background: 'rgba(5,150,105,0.1)',
          border: '1px solid rgba(5,150,105,0.25)',
          borderRadius: 15, display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px', fontSize: 26, color: '#059669',
        }}>✓</div>
        <div style={{ fontFamily: "'Instrument Serif',serif", fontSize: 24, color: '#0F172A', marginBottom: 12 }}>
          Check your email
        </div>
        <div style={{ fontSize: 13, color: '#64748B', lineHeight: 1.7, marginBottom: 28 }}>
          We sent a confirmation link to <strong style={{ color: '#0F172A' }}>{email}</strong>.
          <br/>Click it to activate your account, then sign in.
        </div>
        <button onClick={onSwitch} style={{
          background: 'linear-gradient(135deg, #14B8A6 0%, #0891B2 100%)',
          color: '#fff', border: 'none', borderRadius: 10, padding: '11px 28px',
          cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600,
          boxShadow: '0 2px 12px rgba(20,184,166,0.28)',
        }}>
          Go to sign in
        </button>
      </div>
    </div>
  )

  return (
    <div style={pageWrap}>
      <div style={cardStyle}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 54, height: 54,
            background: 'rgba(124,58,237,0.08)',
            border: '1px solid rgba(124,58,237,0.2)',
            borderRadius: 15, display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px', fontSize: 24,
          }}>
            ✦
          </div>
          <div style={{ fontSize: 9, fontWeight: 700, color: '#0D9488', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 7 }}>
            NH Medical-Legal Partnership
          </div>
          <div style={{ fontFamily: "'Instrument Serif',serif", fontSize: 28, color: '#0F172A', lineHeight: 1.2 }}>
            Create account
          </div>
        </div>

        <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            { label: 'Email',            key: 'email', type: 'email',    val: email,    set: setEmail },
            { label: 'Password',         key: 'pw',    type: 'password', val: password, set: setPassword },
            { label: 'Confirm password', key: 'cpw',   type: 'password', val: confirm,  set: setConfirm },
          ].map(({ label, key, type, val, set }) => (
            <div key={key}>
              <label style={{ fontSize: 10, fontWeight: 700, color: '#94A3B8', display: 'block', marginBottom: 7, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{label}</label>
              <input
                style={inputStyle} type={type} value={val}
                onChange={e => set(e.target.value)}
                required autoFocus={key === 'email'}
                onFocus={e => { e.target.style.borderColor = 'rgba(124,58,237,0.45)'; e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.07)' }}
                onBlur={e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.boxShadow = 'none' }}
              />
            </div>
          ))}

          {error && (
            <div style={{
              padding: '10px 14px',
              background: 'rgba(225,29,72,0.06)',
              border: '1px solid rgba(225,29,72,0.2)',
              borderRadius: 9, fontSize: 12, color: '#E11D48', lineHeight: 1.5,
            }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} style={{
            padding: '12px',
            background: loading ? '#F1F5F9' : 'linear-gradient(135deg, #A78BFA 0%, #6366F1 100%)',
            color: loading ? '#94A3B8' : '#fff',
            border: 'none', borderRadius: 11,
            cursor: loading ? 'default' : 'pointer',
            fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 600,
            marginTop: 6,
            boxShadow: loading ? 'none' : '0 2px 12px rgba(167,139,250,0.3)',
            transition: 'all 0.15s',
          }}>
            {loading ? 'Creating account…' : 'Create account →'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 24, fontSize: 12, color: '#94A3B8' }}>
          Already have an account?{' '}
          <button onClick={onSwitch} style={{
            background: 'none', border: 'none', color: '#14B8A6',
            cursor: 'pointer', fontSize: 12, fontFamily: "'DM Sans',sans-serif", fontWeight: 500,
          }}>
            Sign in
          </button>
        </div>
      </div>
    </div>
  )
}
