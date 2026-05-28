import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Login({ onSwitch }) {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    if (err) setError(err.message)
    setLoading(false)
  }

  const inputStyle = {
    width: '100%', padding: '11px 14px',
    background: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: 8,
    fontFamily: "'DM Sans',sans-serif", fontSize: 13,
    color: '#1A202C', outline: 'none',
    transition: 'border-color 0.15s, box-shadow 0.15s',
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F7FAFC',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: 16,
        padding: '44px 40px',
        width: 380,
        boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
        animation: 'fadeSlideUp 0.4s cubic-bezier(0.16,1,0.3,1) forwards',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
<div style={{ fontSize: 9, fontWeight: 700, color: '#0D9488', textTransform: 'uppercase', letterSpacing: '0.16em', marginBottom: 7 }}>
            NH Medical-Legal Partnership
          </div>
          <div style={{ fontFamily: "'Instrument Serif',serif", fontSize: 26, color: '#1A202C', lineHeight: 1.2 }}>
            Case Dashboard
          </div>
        </div>

        <div style={{ fontSize: 13, color: '#718096', marginBottom: 22 }}>
          Sign in to your account
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 10, fontWeight: 700, color: '#718096', display: 'block', marginBottom: 7, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Email
            </label>
            <input
              style={inputStyle} type="email" value={email}
              onChange={e => setEmail(e.target.value)} required autoFocus
              onFocus={e => { e.target.style.borderColor = '#0D9488'; e.target.style.boxShadow = '0 0 0 3px rgba(13,148,136,0.10)' }}
              onBlur={e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.boxShadow = 'none' }}
            />
          </div>
          <div>
            <label style={{ fontSize: 10, fontWeight: 700, color: '#718096', display: 'block', marginBottom: 7, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Password
            </label>
            <input
              style={inputStyle} type="password" value={password}
              onChange={e => setPassword(e.target.value)} required
              onFocus={e => { e.target.style.borderColor = '#0D9488'; e.target.style.boxShadow = '0 0 0 3px rgba(13,148,136,0.10)' }}
              onBlur={e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.boxShadow = 'none' }}
            />
          </div>

          {error && (
            <div style={{
              padding: '10px 14px',
              background: 'rgba(192,57,43,0.06)',
              border: '1px solid rgba(192,57,43,0.20)',
              borderRadius: 8, fontSize: 12, color: '#C0392B', lineHeight: 1.5,
            }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} style={{
            padding: '12px',
            background: loading ? '#E2E8F0' : '#1B2334',
            color: loading ? '#718096' : '#FFFFFF',
            border: 'none', borderRadius: 8,
            cursor: loading ? 'default' : 'pointer',
            fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 600,
            marginTop: 4,
            transition: 'all 0.15s',
          }}>
            {loading ? 'Signing in…' : 'Sign in →'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 22, fontSize: 12, color: '#718096' }}>
          No account?{' '}
          <button onClick={onSwitch} style={{
            background: 'none', border: 'none', color: '#0D9488',
            cursor: 'pointer', fontSize: 12, fontFamily: "'DM Sans',sans-serif", fontWeight: 600,
          }}>
            Request access
          </button>
        </div>
      </div>
    </div>
  )
}
