import { useState, useEffect, createContext, useContext } from 'react'
import { supabase } from './lib/supabase'
import { SEED_CASES, QR_SEED } from './data/seed'
import Dashboard from './pages/Dashboard'
import Cases from './pages/Cases'
import Children from './pages/Children'
import Financial from './pages/Financial'
import Geography from './pages/Geography'
import Equity from './pages/Equity'
import NCMLPMeasures from './pages/NCMLPMeasures'
import Compare from './pages/Compare'
import Login from './pages/Login'
import Signup from './pages/Signup'
import AddCaseModal from './components/AddCaseModal'

export const AppContext = createContext(null)
export function useApp() { return useContext(AppContext) }

const NAV = [
  { id: 'dashboard', label: 'Overview', icon: '◈' },
  { id: 'cases', label: 'All Cases', icon: '≡' },
  { id: 'children', label: 'Children Impact', icon: '◉' },
  { id: 'financial', label: 'Financial Impact', icon: '$' },
  { id: 'geography', label: 'Geography', icon: '◎' },
  { id: 'equity', label: 'Equity Analysis', icon: '⊕' },
  { id: 'ncmlp', label: 'NCMLP Measures', icon: '✦' },
  { id: 'compare', label: 'Benchmark', icon: '⇄' },
]

function App() {
  const [session, setSession] = useState(undefined) // undefined = loading, null = logged out
  const [isAdmin, setIsAdmin] = useState(false)
  const [authScreen, setAuthScreen] = useState('login') // 'login' | 'signup'

  const [page, setPage] = useState('dashboard')
  const [cases, setCases] = useState(() => {
    try { const s = localStorage.getItem('nh_mlp_cases'); return s ? JSON.parse(s) : SEED_CASES } catch { return SEED_CASES }
  })
  const [qrReports, setQrReports] = useState(() => {
    try { const s = localStorage.getItem('nh_mlp_qr'); return s ? JSON.parse(s) : QR_SEED } catch { return QR_SEED }
  })
  const [showModal, setShowModal] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Auth listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) fetchRole(session.user.id)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) fetchRole(session.user.id)
      else setIsAdmin(false)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function fetchRole(userId) {
    const { data } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single()
    setIsAdmin(data?.role === 'admin')
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  useEffect(() => { localStorage.setItem('nh_mlp_cases', JSON.stringify(cases)) }, [cases])
  useEffect(() => { localStorage.setItem('nh_mlp_qr', JSON.stringify(qrReports)) }, [qrReports])

  const addCase = (c) => setCases(prev => [...prev, { ...c, id: Math.max(0, ...prev.map(x => x.id)) + 1 }])
  const addQR = (r) => setQrReports(prev => [...prev, { ...r, id: Math.max(0, ...prev.map(x => x.id)) + 1 }])
  const deleteQR = (id) => setQrReports(prev => prev.filter(r => r.id !== id))
  const exportCSV = () => {
    const headers = ['id','date','program','client','clientAge','nhCivil','childCustody','category','issue','county','dv','disability','numChildren','childrenSupported','childAges','devBucket','financialBenefit','benefitType','benefitMonthly','benefitLump','veteranStatus','outcome','notes']
    const rows = cases.map(c => headers.map(h => { const v = c[h]; return JSON.stringify(Array.isArray(v) ? v.join('; ') : (v ?? '')) }).join(','))
    const csv = [headers.join(','), ...rows].join('\n')
    const a = document.createElement('a'); a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv)
    a.download = `nh_mlp_${new Date().toISOString().slice(0, 10)}.csv`; a.click()
  }

  // Loading state while session resolves
  if (session === undefined) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F4F3EF', fontFamily: "'Instrument Serif',serif", fontSize: 20, fontStyle: 'italic', color: '#9A9888' }}>
        Loading…
      </div>
    )
  }

  // Not logged in
  if (!session) {
    return authScreen === 'login'
      ? <Login onSwitch={() => setAuthScreen('signup')} />
      : <Signup onSwitch={() => setAuthScreen('login')} />
  }

  const pages = { dashboard: Dashboard, cases: Cases, children: Children, financial: Financial, geography: Geography, equity: Equity, ncmlp: NCMLPMeasures, compare: Compare }
  const PageComponent = pages[page] || Dashboard

  return (
    <AppContext.Provider value={{ cases, setCases, qrReports, addCase, addQR, deleteQR, exportCSV, isAdmin }}>
      <div style={{ display: 'flex', height: '100vh', fontFamily: "'DM Sans',sans-serif", background: '#F4F3EF', color: '#1A1916' }}>

        {/* Sidebar */}
        <div style={{ width: sidebarOpen ? 220 : 60, flexShrink: 0, background: '#FAFAF8', borderRight: '1px solid #E0DDD5', display: 'flex', flexDirection: 'column', transition: 'width 0.2s', overflow: 'hidden' }}>
          <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid #E0DDD5', flexShrink: 0 }}>
            {sidebarOpen ? (
              <div>
                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: '#9A9888', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 4 }}>NH Medical-Legal Partnership</div>
                <div style={{ fontFamily: "'Instrument Serif',serif", fontSize: 20, fontStyle: 'italic', lineHeight: 1.2 }}>Case Dashboard</div>
              </div>
            ) : <div style={{ fontFamily: "'Instrument Serif',serif", fontSize: 14, fontStyle: 'italic', textAlign: 'center' }}>MLP</div>}
          </div>
          <nav style={{ padding: '12px 8px', flex: 1, overflowY: 'auto' }}>
            {NAV.map(n => (
              <button key={n.id} onClick={() => setPage(n.id)} style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '9px 10px', border: 'none', borderRadius: 7, cursor: 'pointer', textAlign: 'left', fontFamily: "'DM Sans',sans-serif", fontSize: 13, background: page === n.id ? '#ECEAFF' : 'none', color: page === n.id ? '#6B63D4' : '#5A5850', fontWeight: page === n.id ? 500 : 400, marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden' }}>
                <span style={{ width: 18, textAlign: 'center', fontSize: 14, flexShrink: 0 }}>{n.icon}</span>
                {sidebarOpen && n.label}
              </button>
            ))}
          </nav>
          <div style={{ padding: '12px 8px', borderTop: '1px solid #E0DDD5', flexShrink: 0 }}>
            {isAdmin && (
              <button onClick={() => setShowModal(true)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', padding: '9px 12px', background: '#6B63D4', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 500, marginBottom: 6 }}>
                <span>+</span>{sidebarOpen && 'Add Case'}
              </button>
            )}
            {sidebarOpen && isAdmin && (
              <button onClick={exportCSV} style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '8px 12px', background: 'none', color: '#5A5850', border: '1px solid #E0DDD5', borderRadius: 8, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontSize: 12, marginBottom: 6 }}>↓ Export CSV</button>
            )}
            <button onClick={handleSignOut} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, width: '100%', padding: '8px 12px', background: 'none', color: '#9A9888', border: '1px solid #E0DDD5', borderRadius: 8, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontSize: 12 }}>
              {sidebarOpen ? '→ Sign out' : '→'}
            </button>
          </div>
          {sidebarOpen && (
            <div style={{ padding: '10px 16px 14px', fontFamily: "'DM Mono',monospace", fontSize: 10, color: '#9A9888', lineHeight: 1.7, borderTop: '1px solid #E0DDD5' }}>
              <div>238 cases logged</div>
              <div style={{ color: isAdmin ? '#6B63D4' : '#9A9888' }}>{isAdmin ? 'Admin' : 'Viewer'}</div>
              <div>{session.user.email}</div>
            </div>
          )}
        </div>

        {/* Main content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '16px 28px', borderBottom: '1px solid #E0DDD5', background: '#FAFAF8', display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
            <button onClick={() => setSidebarOpen(s => !s)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 18, color: '#5A5850', padding: '4px 8px' }}>☰</button>
            <div>
              <div style={{ fontFamily: "'Instrument Serif',serif", fontSize: 22, fontStyle: 'italic' }}>{NAV.find(n => n.id === page)?.label || 'Dashboard'}</div>
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: '#9A9888', marginTop: 1 }}>NH MLP - TLC / Moms / ATP - inception through present</div>
            </div>
            {isAdmin && (
              <button onClick={() => setShowModal(true)} style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8, padding: '9px 18px', background: '#6B63D4', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 500 }}>
                + Add Case
              </button>
            )}
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}><PageComponent /></div>
        </div>
      </div>
      {showModal && isAdmin && <AddCaseModal onClose={() => setShowModal(false)} onSave={addCase} totalCases={cases.length} />}
    </AppContext.Provider>
  )
}

export default App
