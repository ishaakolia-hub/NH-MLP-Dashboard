export const C = {
  navy:       '#1B2334',
  navyDim:    'rgba(27,35,52,0.08)',
  teal:       '#0D9488',
  tealDim:    'rgba(13,148,136,0.10)',
  blue1:      '#2B5282',
  blue2:      '#7BA3C8',
  blue3:      '#BDD7EE',
  crimson:    '#C0392B',
  crimsonDim: 'rgba(192,57,43,0.10)',
  green:      '#276749',
  greenDim:   'rgba(39,103,73,0.10)',
  badgeBlue:  '#2B6CB0',
  white:      '#FFFFFF',
  surface:    '#F7FAFC',
  border:     '#E2E8F0',
  text:       '#1A202C',
  text2:      '#374151',
  text3:      '#4A5568',
  slate:      '#4A5568',

  // legacy aliases used by other pages
  purple:      '#553C9A',
  indigo:      '#434190',
  rose:        '#C0392B',
  orange:      '#C05621',
  amber:       '#B7791F',
  red:         '#C53030',
  blue:        '#2B6CB0',
  cyan:        '#086F83',
  violet:      '#553C9A',
  violetLight: '#44337A',
  violetPale:  'rgba(85,60,154,0.10)',
  greenLight:  'rgba(39,103,73,0.10)',
}

export const CATS = ['Personal & family','Housing & utilities','Income & insurance','Legal status','Education & employment']
export const CAT_COLORS = {
  'Personal & family':      '#1B2334',
  'Housing & utilities':    '#2B6CB0',
  'Income & insurance':     '#7BA3C8',
  'Legal status':           '#C0392B',
  'Education & employment': '#718096',
}
export const PROG_COLORS   = { TLC: '#2B5282', Moms: '#7BA3C8', ATP: '#BDD7EE' }
export const COUNTY_COLORS = { Sullivan: '#2B5282', Grafton: '#4A7EB5', Merrimack: '#7BA3C8', Other: '#BDD7EE' }
export const FAVORABLE = new Set(['Issue resolved','Settlement','Trial decision'])

const CARD = {
  background:   '#FFFFFF',
  border:       '1px solid #E2E8F0',
  borderRadius: 12,
  boxShadow:    '0 1px 3px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.025)',
}

export const TT_STYLE = {
  contentStyle: {
    background:   '#FFFFFF',
    border:       '1px solid #E2E8F0',
    borderRadius: 8,
    fontSize:     12,
    color:        '#1A202C',
    boxShadow:    '0 4px 16px rgba(0,0,0,0.10)',
  },
  labelStyle: { color: C.text3, marginBottom: 4 },
  cursor:     { fill: 'rgba(0,0,0,0.03)' },
}

export function Card({ children, style={}, full=false }) {
  return (
    <div style={{ ...CARD, padding: 18, ...style, ...(full ? { gridColumn: '1/-1' } : {}) }}>
      {children}
    </div>
  )
}

const STAT_VARIANTS = {
  blue:    { color: '#2B5282', sub: C.text2 },
  teal:    { color: '#0D9488', sub: C.text2 },
  rose:    { color: '#C0392B', sub: C.text2 },
  crimson: { color: '#C0392B', sub: C.text2 },
  green:   { color: '#276749', sub: C.text2 },
  purple:  { color: '#553C9A', sub: C.text2 },
  orange:  { color: '#C05621', sub: C.text2 },
  cyan:    { color: '#086F83', sub: C.text2 },
  default: { color: '#1A202C', sub: C.text2 },
}

export function StatCard({ label, value, sub, badge, variant='default' }) {
  const v = STAT_VARIANTS[variant] || STAT_VARIANTS.default
  return (
    <div style={{
      ...CARD,
      padding: '16px 20px',
      borderTop: `2px solid ${v.color}`,
    }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: C.text3, textTransform: 'uppercase', letterSpacing: '0.10em', marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
        <div style={{ fontFamily: "'Instrument Serif',serif", fontSize: 38, color: v.color, lineHeight: 1 }}>
          {value}
        </div>
        {badge && (
          <span style={{ fontSize: 11, fontWeight: 600, color: '#0D9488', display: 'flex', alignItems: 'center', gap: 2 }}>
            {badge}
          </span>
        )}
      </div>
      {sub && <div style={{ fontSize: 12, color: v.sub, lineHeight: 1.5 }}>{sub}</div>}
    </div>
  )
}

export function ChartCard({ title, sub, children, full=false, style={} }) {
  return (
    <div style={{
      ...CARD,
      padding: '14px 18px',
      ...(full ? { gridColumn: '1/-1' } : {}),
      ...style,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: sub ? 2 : 10 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: C.text, letterSpacing: '0.01em' }}>{title}</div>
      </div>
      {sub && <div style={{ fontSize: 11, color: C.text3, marginBottom: 10, lineHeight: 1.5 }}>{sub}</div>}
      {children}
    </div>
  )
}

export function Grid2({ children, style={} }) {
  return <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10, ...style }}>{children}</div>
}
export function Grid3({ children, style={} }) {
  return <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 10, ...style }}>{children}</div>
}
export function Grid4({ children, style={} }) {
  return <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 10, ...style }}>{children}</div>
}

export function Page({ children }) {
  return (
    <div style={{ padding: '20px 24px', animation: 'fadeSlideUp 0.32s cubic-bezier(0.16,1,0.3,1) forwards' }}>
      {children}
    </div>
  )
}

export function InfoBox({ children, color='teal' }) {
  const styles = {
    teal:    { bg: 'rgba(13,148,136,0.07)',  border: 'rgba(13,148,136,0.22)',  color: '#0D9488' },
    green:   { bg: 'rgba(39,103,73,0.07)',   border: 'rgba(39,103,73,0.22)',   color: '#276749' },
    violet:  { bg: 'rgba(85,60,154,0.07)',   border: 'rgba(85,60,154,0.22)',   color: '#553C9A' },
    blue:    { bg: 'rgba(43,82,130,0.07)',   border: 'rgba(43,82,130,0.22)',   color: '#2B5282' },
    neutral: { bg: 'rgba(0,0,0,0.02)',       border: 'rgba(0,0,0,0.10)',       color: '#374151' },
  }
  const s = styles[color] || styles.teal
  return (
    <div style={{
      background: s.bg,
      border: `1px solid ${s.border}`,
      borderRadius: 8,
      padding: '12px 16px',
      fontSize: 13, color: s.color, lineHeight: 1.65, marginBottom: 16,
    }}>
      {children}
    </div>
  )
}

export function Badge({ children, variant='slate' }) {
  const variants = {
    green:  { bg: '#C6F6D5', color: '#276749' },
    blue:   { bg: '#BEE3F8', color: '#2B6CB0' },
    teal:   { bg: 'rgba(13,148,136,0.12)', color: '#0D9488' },
    red:    { bg: 'rgba(192,57,43,0.10)',  color: '#C0392B' },
    amber:  { bg: 'rgba(183,121,31,0.12)', color: '#B7791F' },
    violet: { bg: 'rgba(85,60,154,0.10)',  color: '#553C9A' },
    slate:  { bg: 'rgba(113,128,150,0.10)',color: '#4A5568' },
  }
  const v = variants[variant] || variants.slate
  return (
    <span style={{
      display: 'inline-block', padding: '2px 9px', borderRadius: 5,
      fontFamily: "'DM Mono',monospace", fontSize: 10, fontWeight: 600,
      background: v.bg, color: v.color, letterSpacing: '0.04em',
    }}>
      {children}
    </span>
  )
}

export function SectionLabel({ children }) {
  return (
    <div style={{
      fontFamily: "'DM Mono',monospace", fontSize: 11, color: C.text2,
      textTransform: 'uppercase', letterSpacing: '0.1em',
      borderBottom: '1px solid #E2E8F0',
      paddingBottom: 8, marginBottom: 14, marginTop: 22,
    }}>
      {children}
    </div>
  )
}

export function getYear(c) { return c.date ? c.date.slice(0,4) : 'Unknown' }

export function calcROI(cases) {
  const FAVORABLE_SET = new Set(['Issue resolved','Settlement','Trial decision'])
  return cases
    .filter(c => FAVORABLE_SET.has(c.outcome) && c.benefitMonthly)
    .reduce((sum, c) => {
      const monthly = parseFloat(c.benefitMonthly) || 0
      const lump    = parseFloat(c.benefitLump)    || 0
      return sum + lump + (monthly * 12)
    }, 0)
}
