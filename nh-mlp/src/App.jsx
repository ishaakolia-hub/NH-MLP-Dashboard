import { useState, useEffect, createContext, useContext } from 'react'
import { LayoutDashboard, FolderOpen, Users, TrendingUp, Map, Scale, Target, GitCompare, Search, Bell, Plus, Download, LogOut, ClipboardList } from 'lucide-react'
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

function App() {
  const [session, setSession]       = useState(undefined)
  const [isAdmin, setIsAdmin]       = useState(false)
  const [authScreen, setAuthScreen] = useState('login')
  const [page, setPage]             = useState('dashboard')
  const [cases, setCases]           = useState(() => {
    try { const s = localStorage.getItem('nh_mlp_cases'); return s ? JSON.parse(s) : SEED_CASES } catch { return SEED_CASES }
  })
  const [qrReports, setQrReports] = useState(() => {
    try { const s = localStorage.getItem('nh_mlp_qr'); return s ? JSON.parse(s) : QR_SEED } catch { return QR_SEED }
  })
  const [showModal, setShowModal]   = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)

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
    const { data } = await supabase.from('profiles').select('role').eq('id', userId).single()
    setIsAdmin(data?.role === 'admin')
  }

  const handleSignOut = async () => { await supabase.auth.signOut() }

  useEffect(() => { localStorage.setItem('nh_mlp_cases', JSON.stringify(cases)) }, [cases])
  useEffect(() => { localStorage.setItem('nh_mlp_qr', JSON.stringify(qrReports)) }, [qrReports])

  const addCase  = (c) => setCases(prev => [...prev, { ...c, id: Math.max(0, ...prev.map(x => x.id)) + 1 }])
  const addQR    = (r) => setQrReports(prev => [...prev, { ...r, id: Math.max(0, ...prev.map(x => x.id)) + 1 }])
  const deleteQR = (id) => setQrReports(prev => prev.filter(r => r.id !== id))

  const exportCSV = () => {
    const headers = ['id','date','program','client','clientAge','nhCivil','childCustody','category','issue','county','dv','disability','numChildren','childrenSupported','childAges','devBucket','financialBenefit','benefitType','benefitMonthly','benefitLump','veteranStatus','outcome','notes']
    const rows = cases.map(c => headers.map(h => { const v = c[h]; return JSON.stringify(Array.isArray(v) ? v.join('; ') : (v ?? '')) }).join(','))
    const csv = [headers.join(','), ...rows].join('\n')
    const a = document.createElement('a')
    a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv)
    a.download = `nh_mlp_${new Date().toISOString().slice(0,10)}.csv`
    a.click()
  }

  const NAV_GROUPS = [
    {
      items: [
        { id: 'dashboard', label: 'Overview', Icon: LayoutDashboard },
      ],
    },
    {
      label: 'Population & Needs',
      items: [
        { id: 'cases',     label: 'All Cases',        Icon: FolderOpen },
        { id: 'children',  label: 'Children Impact',  Icon: Users },
        { id: 'geography', label: 'Geography',        Icon: Map },
        { id: 'equity',    label: 'Equity Analysis',  Icon: Scale },
      ],
    },
    {
      label: 'Impact & Outcomes',
      items: [
        { id: 'financial', label: 'Financial Impact',    Icon: TrendingUp },
        { id: 'ncmlp',     label: 'NCMLP Measures',      Icon: Target },
        { id: 'compare',   label: 'National Comparison', Icon: GitCompare },
      ],
    },
    ...(isAdmin ? [{
      label: 'Administration',
      items: [
        { id: 'mgmt',   label: 'Case Management', Icon: ClipboardList, action: () => setShowModal(true) },
        { id: 'export', label: 'Export Data',     Icon: Download,      action: exportCSV },
      ],
    }] : []),
  ]

  const allNavItems = NAV_GROUPS.flatMap(g => g.items)

  if (session === undefined) {
    return (
      <div style={{ minHeight: '100vh', background: '#EDF2F7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: "'Instrument Serif',serif", fontSize: 20, color: '#0D9488' }}>Loading…</div>
      </div>
    )
  }

  if (!session) {
    return authScreen === 'login'
      ? <Login onSwitch={() => setAuthScreen('signup')} />
      : <Signup onSwitch={() => setAuthScreen('login')} />
  }

  const pages = { dashboard: Dashboard, cases: Cases, children: Children, financial: Financial, geography: Geography, equity: Equity, ncmlp: NCMLPMeasures, compare: Compare }
  const PageComponent = pages[page] || Dashboard
  const activeNav = allNavItems.find(n => n.id === page)

  return (
    <AppContext.Provider value={{ cases, setCases, qrReports, addCase, addQR, deleteQR, exportCSV, isAdmin }}>
      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', fontFamily: "'DM Sans',sans-serif" }}>

        {/* ── Sidebar ── */}
        <div style={{
          width: sidebarOpen ? 230 : 64,
          flexShrink: 0,
          background: '#1B2334',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.25s cubic-bezier(0.4,0,0.2,1)',
          overflow: 'hidden',
        }}>

          {/* Logo */}
          <div style={{ padding: sidebarOpen ? '20px 18px 16px' : '20px 14px 16px', borderBottom: '1px solid rgba(255,255,255,0.10)', flexShrink: 0 }}>
            {sidebarOpen ? (
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 6 }}>
                  NH Medical-Legal Partnership
                </div>
                <div style={{ fontFamily: "'Instrument Serif',serif", fontSize: 20, color: '#FFFFFF', lineHeight: 1.2 }}>
                  Case Dashboard
                </div>
              </div>
            ) : (
              <div style={{ fontFamily: "'Instrument Serif',serif", fontSize: 13, color: '#FFFFFF', textAlign: 'center' }}>
                MLP
              </div>
            )}
          </div>

          {/* Nav */}
          <nav style={{ padding: '8px 8px', flex: 1, overflowY: 'auto' }}>
            {NAV_GROUPS.map((group, gi) => (
              <div key={gi} style={{ marginBottom: gi < NAV_GROUPS.length - 1 ? 4 : 0 }}>

                {/* Section header (expanded) */}
                {group.label && sidebarOpen && (
                  <div style={{
                    fontSize: 9,
                    fontWeight: 700,
                    color: 'rgba(255,255,255,0.62)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.13em',
                    padding: '14px 10px 5px',
                  }}>
                    {group.label}
                  </div>
                )}

                {/* Thin divider in collapsed state */}
                {group.label && !sidebarOpen && (
                  <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: '8px 10px 6px' }} />
                )}

                {/* Nav items */}
                {group.items.map(n => {
                  const isActive = !n.action && page === n.id
                  return (
                    <button
                      key={n.id}
                      onClick={() => n.action ? n.action() : setPage(n.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: sidebarOpen ? 'flex-start' : 'center',
                        gap: 10,
                        width: '100%',
                        padding: sidebarOpen ? '8px 10px' : '10px',
                        borderLeft: isActive ? '3px solid #FFFFFF' : '3px solid transparent',
                        borderTop: 'none', borderRight: 'none', borderBottom: 'none',
                        borderRadius: '0 8px 8px 0',
                        cursor: 'pointer',
                        fontSize: 14,
                        fontFamily: "'DM Sans',sans-serif",
                        background: isActive ? 'rgba(255,255,255,0.10)' : 'transparent',
                        color: isActive ? '#FFFFFF' : 'rgba(255,255,255,0.82)',
                        fontWeight: isActive ? 700 : 500,
                        marginBottom: 2,
                        transition: 'all 0.14s ease',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textAlign: 'left',
                      }}
                    >
                      <n.Icon size={15} style={{ flexShrink: 0, opacity: isActive ? 1 : 0.80 }} />
                      {sidebarOpen && n.label}
                    </button>
                  )
                })}
              </div>
            ))}
          </nav>

          {/* Bottom: sign out */}
          <div style={{ padding: '10px 8px', borderTop: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }}>
            <button onClick={handleSignOut} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              width: '100%', padding: '7px 10px',
              background: 'transparent',
              color: 'rgba(255,255,255,0.50)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 8, cursor: 'pointer',
              fontFamily: "'DM Sans',sans-serif", fontSize: 12,
            }}>
              <LogOut size={13} />
              {sidebarOpen && 'Sign out'}
            </button>
          </div>

          {/* Footer info */}
          {sidebarOpen && (
            <div style={{ padding: '10px 18px 14px', borderTop: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }}>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.40)', lineHeight: 1.9 }}>
                <div>{cases.length} cases logged</div>
                <div style={{ color: isAdmin ? '#FFFFFF' : 'rgba(255,255,255,0.30)', fontWeight: isAdmin ? 600 : 400 }}>
                  {isAdmin ? '● Admin' : '○ Viewer'}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Main content ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

          {/* Topbar */}
          <div style={{
            background: '#FFFFFF',
            borderBottom: '1px solid #E2E8F0',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            flexShrink: 0,
            padding: '10px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            minHeight: 60,
          }}>
            {/* Hamburger */}
            <button
              onClick={() => setSidebarOpen(s => !s)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#4A5568', padding: '6px 8px', borderRadius: 6,
                display: 'flex', alignItems: 'center', flexShrink: 0,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="1" y="3" width="14" height="2" rx="1" fill="currentColor"/>
                <rect x="1" y="7" width="14" height="2" rx="1" fill="currentColor"/>
                <rect x="1" y="11" width="14" height="2" rx="1" fill="currentColor"/>
              </svg>
            </button>

            {/* Title */}
            <div style={{ flexShrink: 0 }}>
              <div style={{ fontFamily: "'Instrument Serif',serif", fontSize: 21, color: '#1A202C', lineHeight: 1.15 }}>
                {activeNav?.label || 'Overview'}
              </div>
              <div style={{ fontSize: 9, color: '#718096', marginTop: 1, letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                NH MLP · TLC / Moms / ATP · Inception through present
              </div>
            </div>

            <div style={{ flex: 1 }} />

            {/* Right actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              <button style={{
                background: 'none', border: '1px solid #E2E8F0', borderRadius: 8,
                padding: '7px 9px', cursor: 'pointer', color: '#4A5568',
                display: 'flex', alignItems: 'center',
              }}>
                <Search size={14} />
              </button>
              <button style={{
                background: 'none', border: '1px solid #E2E8F0', borderRadius: 8,
                padding: '7px 9px', cursor: 'pointer', color: '#4A5568',
                display: 'flex', alignItems: 'center',
              }}>
                <Bell size={14} />
              </button>
              {isAdmin && (
                <button onClick={() => setShowModal(true)} style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '8px 18px',
                  background: '#1B2334',
                  color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer',
                  fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600,
                  whiteSpace: 'nowrap',
                }}>
                  <Plus size={13} />
                  Add Case
                </button>
              )}
            </div>
          </div>

          {/* Page content */}
          <div style={{ flex: 1, overflowY: 'auto', background: '#EDF2F7' }}>
            <PageComponent key={page} />
          </div>
        </div>
      </div>

      {showModal && isAdmin && (
        <AddCaseModal onClose={() => setShowModal(false)} onSave={addCase} totalCases={cases.length} />
      )}
    </AppContext.Provider>
  )
}

export default App
