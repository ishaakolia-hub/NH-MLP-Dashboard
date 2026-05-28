import { useState, useEffect } from 'react'
import { useApp } from '../App'
import { C, Page } from '../components/ui'

const ACCENTS = {
  1: '#553C9A',
  2: '#2B5282',
  3: '#0D9488',
  4: '#276749',
  5: '#1B2334',
  6: '#276749',
  7: '#718096',
}

function ProgressBar({ value, max = 100, color, height = 4, mounted }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0
  return (
    <div style={{ height, background: 'rgba(0,0,0,0.08)', borderRadius: 3, overflow: 'hidden' }}>
      <div style={{
        height: '100%',
        width: mounted ? `${pct}%` : '0%',
        background: color,
        borderRadius: 3,
        transition: 'width 0.85s cubic-bezier(0.16, 1, 0.3, 1)',
      }} />
    </div>
  )
}

function MeasureCard({ num, title, formula, value, rawNumer, rawDenom, showProgress = true, children, note, mounted }) {
  const [hover, setHover] = useState(false)
  const accent = ACCENTS[num]
  const showVal = value !== null && value !== undefined

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: '#FFFFFF',
        border: `1px solid ${hover ? accent + '66' : 'rgba(0,0,0,0.09)'}`,
        borderLeft: `3px solid ${accent}`,
        borderRadius: 10,
        marginBottom: 11,
        boxShadow: hover
          ? '0 6px 24px rgba(0,0,0,0.10)'
          : '0 1px 4px rgba(0,0,0,0.04)',
        transition: 'box-shadow 0.22s ease, border-color 0.22s ease',
        overflow: 'hidden',
      }}
    >
      {/* Header zone — very lightly tinted with the measure's accent */}
      <div style={{ padding: '13px 18px 11px', background: `${accent}09` }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
          {/* Left: badge + title + formula */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 10,
                fontWeight: 600,
                color: '#FFFFFF',
                background: accent,
                borderRadius: 4,
                padding: '2px 8px',
                letterSpacing: '0.05em',
                flexShrink: 0,
              }}>M{num}</span>
              <span style={{
                fontSize: 13,
                fontWeight: 600,
                color: '#0F172A',
                lineHeight: 1.3,
              }}>{title}</span>
            </div>
            <div style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 11,
              color: '#475569',
              lineHeight: 1.6,
            }}>{formula}</div>
          </div>

          {/* Right: dominant value */}
          {showVal && (
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{
                fontFamily: "'Instrument Serif', serif",
                fontSize: 38,
                lineHeight: 1,
                color: accent,
                letterSpacing: '-0.01em',
              }}>{value}</div>
              {rawNumer !== undefined && (
                <div style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 11,
                  color: '#64748B',
                  marginTop: 3,
                }}>{rawNumer} / {rawDenom}</div>
              )}
            </div>
          )}
        </div>

        {/* Animated progress bar */}
        {showProgress && rawNumer !== undefined && (
          <div style={{ marginTop: 10 }}>
            <ProgressBar value={rawNumer} max={rawDenom} color={accent} height={4} mounted={mounted} />
          </div>
        )}
      </div>

      {/* Body — inputs / detail content */}
      {children && (
        <div style={{ padding: '10px 18px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
          {children}
        </div>
      )}

      {/* Note strip */}
      {note && (
        <div style={{
          padding: '8px 18px',
          borderTop: '1px solid rgba(0,0,0,0.06)',
          background: 'rgba(0,0,0,0.015)',
          display: 'flex',
          gap: 8,
          alignItems: 'flex-start',
        }}>
          <span style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 10,
            fontWeight: 600,
            color: `${accent}CC`,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            flexShrink: 0,
            paddingTop: 2,
          }}>NCMLP</span>
          <span style={{ fontSize: 12, color: '#374151', lineHeight: 1.65 }}>{note}</span>
        </div>
      )}
    </div>
  )
}

export default function NCMLPMeasures() {
  const { cases } = useApp()
  const [m1staff, setM1staff]   = useState({ trained: 3, total: 8 })
  const [m2screen, setM2screen] = useState({ screened: 210, seen: 238 })
  const [mounted, setMounted]   = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 120)
    return () => clearTimeout(t)
  }, [])

  // Hardcoded from verified Excel data (all-time)
  const TOTAL_CASES   = 238
  const TOTAL_CLIENTS = 134
  const favorable     = 185
  const totalAnnual   = 113555
  const avgBenefit    = Math.round(totalAnnual / TOTAL_CLIENTS)

  const CATS = ['Personal & family', 'Housing & utilities', 'Income & insurance', 'Legal status', 'Education & employment']
  const cat5 = CATS.map(cat => ({
    cat,
    n:   cases.filter(c => c.category === cat).length,
    pct: Math.round(cases.filter(c => c.category === cat).length / TOTAL_CASES * 100),
  }))

  const inp = {
    padding: '4px 10px',
    border: '1px solid rgba(0,0,0,0.12)',
    borderRadius: 5,
    background: '#FFFFFF',
    fontFamily: "'DM Mono', monospace",
    fontSize: 12,
    color: '#0F172A',
    width: 68,
    outline: 'none',
  }

  return (
    <Page>
      <MeasureCard
        num={1}
        title="Percent of healthcare partner staff trained in MLP"
        formula="Staff trained in MLP in past 24 months / Total healthcare partner staff"
        value={m1staff.total ? `${Math.round(m1staff.trained / m1staff.total * 100)}%` : '—'}
        rawNumer={m1staff.trained}
        rawDenom={m1staff.total}
        mounted={mounted}
      >
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: '#374151' }}>
            Staff trained
            <input style={inp} type="number" value={m1staff.trained}
              onChange={e => setM1staff(s => ({ ...s, trained: parseInt(e.target.value) || 0 }))} />
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: '#374151' }}>
            Total staff
            <input style={inp} type="number" value={m1staff.total}
              onChange={e => setM1staff(s => ({ ...s, total: parseInt(e.target.value) || 0 }))} />
          </label>
        </div>
        <div style={{ marginTop: 8, fontSize: 12, color: '#4B5563', lineHeight: 1.65 }}>
          Any formal meeting where legal partner staff speaks to healthcare partner staff about health-harming legal needs, MLP processes, or referral procedures.
        </div>
      </MeasureCard>

      <MeasureCard
        num={2}
        title="Percent of patients screened for health-harming legal needs"
        formula="Patients screened for HHLN in past month / Total patients seen at healthcare partner"
        value={m2screen.seen ? `${Math.round(m2screen.screened / m2screen.seen * 100)}%` : '—'}
        rawNumer={m2screen.screened}
        rawDenom={m2screen.seen}
        mounted={mounted}
      >
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: '#374151' }}>
            Screened
            <input style={inp} type="number" value={m2screen.screened}
              onChange={e => setM2screen(s => ({ ...s, screened: parseInt(e.target.value) || 0 }))} />
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: '#374151' }}>
            Total seen
            <input style={inp} type="number" value={m2screen.seen}
              onChange={e => setM2screen(s => ({ ...s, seen: parseInt(e.target.value) || 0 }))} />
          </label>
        </div>
      </MeasureCard>

      <MeasureCard
        num={3}
        title="Percent of patients with a legal need addressed by the healthcare org"
        formula="Patients with HHLN addressed / Patients screened with at least one HHLN"
        value={`${Math.round(favorable / TOTAL_CASES * 100)}%`}
        rawNumer={favorable}
        rawDenom={TOTAL_CASES}
        mounted={mounted}
        note="Using favorable case outcomes as proxy for 'addressed'. NCMLP definition includes referral to legal partner, social worker, or any MLP intervention."
      >
        <div style={{ fontSize: 12, color: '#374151' }}>
          {favorable} favorable outcomes out of {TOTAL_CASES} total cases · verified from Excel data
        </div>
      </MeasureCard>

      <MeasureCard
        num={4}
        title="Percent of patients referred who received a legal screening"
        formula="Patients given legal screening by legal partner staff / Patients referred to civil legal aid"
        value={m2screen.screened ? `${Math.round(TOTAL_CASES / m2screen.screened * 100)}%` : '0%'}
        rawNumer={TOTAL_CASES}
        rawDenom={m2screen.screened}
        mounted={mounted}
        note="Using total logged cases as proxy for cases that received a legal screening. NCMLP: 'legal screening' includes phone call, online questionnaire, or in-person meeting with a legal partner staff member."
      >
        <div style={{ fontSize: 12, color: '#374151' }}>
          {TOTAL_CASES} cases opened (received legal screening) from {m2screen.screened} patients screened
        </div>
      </MeasureCard>

      <MeasureCard
        num={5}
        title="Percent of total MLP clients with health-harming legal needs in each iHELP category"
        formula="Clients in each iHELP category / Total MLP clients with at least one HHLN"
        value={null}
        showProgress={false}
        mounted={mounted}
        note="This measure is for informational purposes rather than performance improvement. Clients with needs in multiple categories are counted in each."
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
          {cat5.map(({ cat, n, pct }) => (
            <div key={cat} style={{
              padding: '9px 10px 8px',
              background: 'rgba(0,0,0,0.02)',
              border: '1px solid rgba(0,0,0,0.07)',
              borderRadius: 7,
            }}>
              <div style={{
                fontFamily: "'Instrument Serif', serif",
                fontSize: 24,
                color: ACCENTS[5],
                lineHeight: 1,
                marginBottom: 5,
              }}>{pct}%</div>
              <ProgressBar value={pct} max={100} color={ACCENTS[5]} height={3} mounted={mounted} />
              <div style={{ fontSize: 11, color: '#374151', marginTop: 5, lineHeight: 1.4 }}>{cat}</div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: '#64748B', marginTop: 2 }}>n={n}</div>
            </div>
          ))}
        </div>
      </MeasureCard>

      <MeasureCard
        num={6}
        title="Average financial benefit received by a MLP client (ROI measure)"
        formula="Total financial benefits returned to clients / Number of clients with at least one closed case"
        value={avgBenefit ? `$${avgBenefit.toLocaleString()}` : '—'}
        showProgress={false}
        mounted={mounted}
      >
        <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
          {[
            { label: 'total clients served',  val: TOTAL_CLIENTS,                    color: ACCENTS[6] },
            { label: 'total annual value',     val: `$${totalAnnual.toLocaleString()}`, color: ACCENTS[6] },
            { label: 'national MLP average',   val: '$23,000',                        color: '#B7791F'  },
          ].map(({ label, val, color }) => (
            <div key={label} style={{
              flex: 1,
              padding: '8px 12px',
              background: 'rgba(0,0,0,0.02)',
              border: '1px solid rgba(0,0,0,0.06)',
              borderRadius: 7,
            }}>
              <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 20, color, lineHeight: 1 }}>{val}</div>
              <div style={{ fontSize: 11, color: '#475569', marginTop: 3 }}>{label}</div>
            </div>
          ))}
        </div>
        {/* NH MLP vs. national comparison bar */}
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: '#64748B', marginBottom: 4 }}>
          NH MLP avg vs. national average
        </div>
        <div style={{ height: 6, borderRadius: 3, overflow: 'hidden', background: 'rgba(183,121,31,0.18)' }}>
          <div style={{
            width: mounted ? `${Math.min((avgBenefit / 23000) * 100, 100)}%` : '0%',
            height: '100%',
            background: ACCENTS[6],
            borderRadius: 3,
            transition: 'width 0.85s cubic-bezier(0.16, 1, 0.3, 1)',
          }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 3, marginBottom: 10 }}>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: ACCENTS[6] }}>
            NH MLP ${avgBenefit.toLocaleString()}
          </span>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: '#B7791F' }}>
            National $23,000
          </span>
        </div>

        {/* Compact insight label */}
        <div style={{
          padding: '5px 10px 5px 9px',
          background: '#F7FAF8',
          border: '1px solid rgba(39,103,73,0.11)',
          borderLeft: '2px solid rgba(39,103,73,0.45)',
          borderRadius: '0 5px 5px 0',
          display: 'flex',
          alignItems: 'baseline',
          gap: 10,
          flexWrap: 'wrap',
        }}>
          <span style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 10,
            fontWeight: 700,
            color: '#276749',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            flexShrink: 0,
          }}>ROI argument to funders</span>
          <span style={{ fontSize: 11, color: '#64748B', lineHeight: 1.4 }}>
            demonstrable financial return to clients — strongest case for grant renewal
          </span>
        </div>
        <div style={{
          marginTop: 5,
          fontFamily: "'DM Mono', monospace",
          fontSize: 10,
          color: '#94A3B8',
          lineHeight: 1.5,
        }}>
          NCMLP: lump sum + monthly benefit × 12 per client · see Financial Impact for full breakdown
        </div>
      </MeasureCard>

      <MeasureCard
        num={7}
        title="Estimated financial benefit to the MLP healthcare partner (hospital ROI)"
        formula="Total charges × hospital cost-to-charge ratio (0.265 national proxy) + other dollars"
        value="—"
        showProgress={false}
        mounted={mounted}
        note="NCMLP: uses hospital Medicaid/Medicare cost-to-charge ratio. The Illinois Southern Rural MLP demonstrated $8.1M in medical debt relieved as its ROI argument, which led to hospital self-funding. Formula: total charges × 0.265 (2011 CMS proxy rate)."
      >
        <div style={{ fontSize: 12, color: '#374151', lineHeight: 1.7 }}>
          This measure requires hospital billing data from the healthcare partner. Recommend asking Dartmouth Health or DHMC to track Medicaid charges for MLP-referred clients. Even a rough estimate using the 0.265 proxy would strengthen the funder case significantly.
        </div>
      </MeasureCard>
    </Page>
  )
}
