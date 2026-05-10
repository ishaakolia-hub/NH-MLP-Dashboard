// Shared UI components

export const C = {
  violet: '#6B63D4', violetLight: '#AFA9EC', violetPale: '#ECEAFF',
  green: '#1D9E75', greenLight: '#C0DD97', blue: '#378ADD',
  amber: '#BA7517', red: '#E24B4A', slate: '#888780',
  orange: '#D85A30', bg: '#F4F3EF', bg2: '#ECEAE3', surface: '#FAFAF8',
  border: '#E0DDD5', text: '#1A1916', text2: '#5A5850', text3: '#9A9888',
}

export const CATS = ['Personal & family','Housing & utilities','Income & insurance','Legal status','Education & employment']
export const CAT_COLORS = { 'Personal & family':'#6B63D4','Housing & utilities':'#1D9E75','Income & insurance':'#378ADD','Legal status':'#888780','Education & employment':'#D85A30' }
export const PROG_COLORS = { TLC:'#6B63D4', Moms:'#1D9E75', ATP:'#888780' }
export const COUNTY_COLORS = { Sullivan:'#6B63D4', Grafton:'#1D9E75', Merrimack:'#888780', Other:'#D85A30' }
export const FAVORABLE = new Set(['Issue resolved','Settlement','Trial decision'])

export function Card({ children, style={}, full=false }) {
  return (
    <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:18, ...style, ...(full?{gridColumn:'1/-1'}:{}) }}>
      {children}
    </div>
  )
}

export function StatCard({ label, value, sub, color }) {
  return (
    <Card>
      <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:C.text3, textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:6 }}>{label}</div>
      <div style={{ fontFamily:"'Instrument Serif',serif", fontSize:32, fontStyle:'italic', color:color||C.text, lineHeight:1 }}>{value}</div>
      {sub && <div style={{ fontSize:11, color:C.text3, marginTop:4 }}>{sub}</div>}
    </Card>
  )
}

export function ChartCard({ title, sub, children, full=false, style={} }) {
  return (
    <Card full={full} style={style}>
      <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:500, marginBottom:3 }}>{title}</div>
      {sub && <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:C.text3, marginBottom:14, lineHeight:1.5 }}>{sub}</div>}
      {children}
    </Card>
  )
}

export function Grid2({ children, style={} }) {
  return <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16, ...style }}>{children}</div>
}

export function Grid3({ children, style={} }) {
  return <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:16, marginBottom:16, ...style }}>{children}</div>
}

export function Grid4({ children, style={} }) {
  return <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:20, ...style }}>{children}</div>
}

export function Page({ children }) {
  return <div style={{ padding:28 }}>{children}</div>
}

export function InfoBox({ children, color='violet' }) {
  const bg = color==='violet'?C.violetPale:'#D4F2E8'
  const tc = color==='violet'?C.violet:C.green
  const bc = color==='violet'?'#C8C4F8':'#A8DFC8'
  return (
    <div style={{ background:bg, border:`1px solid ${bc}`, borderRadius:8, padding:'12px 16px', fontSize:12, color:tc, lineHeight:1.6, marginBottom:16 }}>
      {children}
    </div>
  )
}

export function Badge({ children, variant='slate' }) {
  const variants = {
    violet: { bg:C.violetPale, color:C.violet },
    green: { bg:'#D4F2E8', color:C.green },
    amber: { bg:'#FEF3DC', color:C.amber },
    red: { bg:'#FDEAEA', color:C.red },
    slate: { bg:C.bg2, color:C.slate },
  }
  const v = variants[variant]||variants.slate
  return (
    <span style={{ display:'inline-block', padding:'2px 8px', borderRadius:4, fontFamily:"'DM Mono',monospace", fontSize:10, fontWeight:500, background:v.bg, color:v.color }}>
      {children}
    </span>
  )
}

export function SectionLabel({ children }) {
  return (
    <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:C.text3, textTransform:'uppercase', letterSpacing:'0.08em', borderBottom:`1px solid ${C.border}`, paddingBottom:8, marginBottom:14, marginTop:20 }}>
      {children}
    </div>
  )
}

export function getYear(c) { return c.date ? c.date.slice(0,4) : 'Unknown' }

export function calcROI(cases) {
  const FAVORABLE_SET = new Set(['Issue resolved','Settlement','Trial decision'])
  return cases.filter(c => FAVORABLE_SET.has(c.outcome) && c.benefitMonthly).reduce((sum, c) => {
    const monthly = parseFloat(c.benefitMonthly)||0
    const lump = parseFloat(c.benefitLump)||0
    return sum + lump + (monthly * 12)
  }, 0)
}
