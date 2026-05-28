import { useState } from 'react'
import { ComposableMap, Geographies, Geography as RSMGeography } from 'react-simple-maps'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { useApp } from '../App'
import { C, Page, Grid4, Grid2, StatCard, ChartCard, InfoBox, FAVORABLE } from '../components/ui'

const COUNTIES = ['Sullivan', 'Grafton', 'Merrimack', 'Other']
const COLORS = { Sullivan: '#6B63D4', Grafton: '#1D9E75', Merrimack: '#888780', Other: '#D85A30' }
const CATS = ['Personal & family', 'Housing & utilities', 'Income & insurance', 'Legal status', 'Education & employment']

const FIPS_TO_BUCKET = {
  '019': 'Sullivan', '009': 'Grafton', '013': 'Merrimack',
  '001': 'Other', '003': 'Other', '005': 'Other',
  '007': 'Other', '011': 'Other', '015': 'Other', '017': 'Other'
}

const METRICS = [
  { key: 'total',        label: 'Total Cases',    fmt: v => `${v} cases` },
  { key: 'dvPct',        label: 'DV Rate',         fmt: v => `${v}%` },
  { key: 'outcomePct',   label: 'Outcome Rate',    fmt: v => `${v}%` },
  { key: 'disabilityPct',label: 'Disability Rate', fmt: v => `${v}%` },
]

function lerpColor(t) {
  const r = Math.round(224 + (27  - 224) * t)
  const g = Math.round(237 + (58  - 237) * t)
  const b = Math.round(252 + (107 - 252) * t)
  return `rgb(${r},${g},${b})`
}

export default function Geography() {
  const { cases } = useApp()
  const [metric, setMetric]               = useState('total')
  const [selectedCounty, setSelectedCounty] = useState(null)
  const [tooltip, setTooltip]             = useState({ visible: false, x: 0, y: 0, name: '', bucket: '' })

  const tt = { contentStyle: { background: C.surface, border: `1px solid ${C.border}`, borderRadius: 7, fontSize: 12 } }

  // Per-bucket aggregations
  const bucketData = {}
  COUNTIES.forEach(co => {
    const cc = cases.filter(c => c.county === co)
    const fav = cc.filter(c => FAVORABLE.has(c.outcome)).length
    bucketData[co] = {
      total:         cc.length,
      dvCount:       cc.filter(c => c.dv === 'yes').length,
      dvPct:         cc.length ? Math.round(cc.filter(c => c.dv === 'yes').length / cc.length * 100) : 0,
      outcomePct:    cc.length ? Math.round(fav / cc.length * 100) : 0,
      disabilityPct: cc.length ? Math.round(cc.filter(c => c.disability === 'yes').length / cc.length * 100) : 0,
      disabledCount: cc.filter(c => c.disability === 'yes').length,
      favCount:      fav,
    }
  })

  const maxVal = Math.max(...Object.values(bucketData).map(d => d[metric] || 0), 1)
  const activeMetric = METRICS.find(m => m.key === metric)

  function getCountyFill(bucket, hovered) {
    const val = bucketData[bucket]?.[metric] || 0
    const t = val / maxVal
    return lerpColor(hovered ? Math.min(t + 0.18, 1) : t)
  }

  // Existing chart aggregations (unchanged)
  const dvByCounty = COUNTIES.map(co => {
    const cc = cases.filter(c => c.county === co)
    return { county: co, total: cc.length, dv: cc.filter(c => c.dv === 'yes').length, dvPct: cc.length ? Math.round(cc.filter(c => c.dv === 'yes').length / cc.length * 100) : 0 }
  })

  const housingByCounty = COUNTIES.map(co => ({
    county: co,
    housing: cases.filter(c => c.county === co && c.category === 'Housing & utilities').length,
    income:  cases.filter(c => c.county === co && c.category === 'Income & insurance').length,
    family:  cases.filter(c => c.county === co && c.category === 'Personal & family').length,
  }))

  const outcomeByCounty = COUNTIES.map(co => {
    const cc = cases.filter(c => c.county === co)
    const fav = cc.filter(c => ['Issue resolved', 'Settlement', 'Trial decision'].includes(c.outcome)).length
    return { county: co, total: cc.length, favorable: fav, pct: cc.length ? Math.round(fav / cc.length * 100) : 0 }
  })

  const disabilityByCounty = COUNTIES.map(co => {
    const cc = cases.filter(c => c.county === co)
    return { county: co, disabled: cc.filter(c => c.disability === 'yes').length, pct: cc.length ? Math.round(cc.filter(c => c.disability === 'yes').length / cc.length * 100) : 0 }
  })

  function handleCountyClick(bucket) {
    if (bucket === 'Other') return
    setSelectedCounty(prev => prev === bucket ? null : bucket)
  }

  return (
    <Page>
      <InfoBox color="neutral">
        This page compares DV rates, housing issues, income cases, and disability across Sullivan, Grafton, and Merrimack counties. Sullivan County is the primary service area (~75% of cases).
      </InfoBox>

      {/* ── Interactive Map ────────────────────────────────────────── */}
      <div style={{ background: '#FFFFFF', border: `1px solid ${C.border}`, borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.06)', padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 3 }}>New Hampshire County Map</div>
            <div style={{ fontSize: 11, color: C.text3 }}>Hover to inspect. Click a named county to highlight its row in the table below.</div>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {METRICS.map(m => (
              <button
                key={m.key}
                onClick={() => setMetric(m.key)}
                style={{
                  fontSize: 11, padding: '5px 12px', borderRadius: 20,
                  border: `1.5px solid ${metric === m.key ? C.navy : C.border}`,
                  background: metric === m.key ? C.navy : '#fff',
                  color: metric === m.key ? '#fff' : C.text2,
                  cursor: 'pointer', fontWeight: metric === m.key ? 600 : 400,
                  transition: 'all 0.15s',
                }}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {/* Map SVG */}
          <div style={{ flex: '0 0 300px', position: 'relative' }}>
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{ scale: 7800, center: [-71.55, 44.3] }}
              width={300}
              height={460}
              style={{ width: '100%', height: 'auto' }}
            >
              <Geographies geography="/nh-counties.json">
                {({ geographies }) => geographies.map(geo => {
                  const bucket = FIPS_TO_BUCKET[geo.properties.COUNTYFP] || 'Other'
                  const isSelected = selectedCounty === bucket
                  const isHovered = tooltip.visible && tooltip.name === geo.properties.NAME
                  const fill = getCountyFill(bucket, isHovered)
                  return (
                    <RSMGeography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={fill}
                      stroke={isSelected ? C.navy : '#FFFFFF'}
                      strokeWidth={isSelected ? 2.5 : 1}
                      style={{
                        default: { outline: 'none' },
                        hover:   { outline: 'none', cursor: bucket === 'Other' ? 'default' : 'pointer' },
                        pressed: { outline: 'none' },
                      }}
                      onMouseEnter={e => setTooltip({ visible: true, x: e.clientX, y: e.clientY, name: geo.properties.NAME, bucket })}
                      onMouseLeave={() => setTooltip(t => ({ ...t, visible: false }))}
                      onMouseMove={e => setTooltip(t => ({ ...t, x: e.clientX, y: e.clientY }))}
                      onClick={() => handleCountyClick(bucket)}
                    />
                  )
                })}
              </Geographies>
            </ComposableMap>
          </div>

          {/* Legend + bucket cards */}
          <div style={{ flex: 1, minWidth: 220, paddingTop: 8 }}>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 10, color: C.text3, fontWeight: 600, letterSpacing: '0.05em', marginBottom: 7 }}>
                COLOR SCALE — {activeMetric.label.toUpperCase()}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 120, height: 10, borderRadius: 5, background: `linear-gradient(to right, ${lerpColor(0)}, ${lerpColor(1)})` }} />
                <span style={{ fontSize: 10, color: C.text3 }}>Low → High</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
              {COUNTIES.map(co => {
                const d = bucketData[co]
                const t = d[metric] / maxVal
                const isActive = selectedCounty === co
                return (
                  <div
                    key={co}
                    onClick={() => handleCountyClick(co)}
                    style={{
                      padding: '10px 12px', borderRadius: 8,
                      border: `1.5px solid ${isActive ? C.navy : C.border}`,
                      background: isActive ? 'rgba(27,35,52,0.05)' : '#FAFBFC',
                      cursor: co !== 'Other' ? 'pointer' : 'default',
                      transition: 'all 0.15s',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <div style={{ width: 10, height: 10, borderRadius: 2, background: lerpColor(t), border: `1px solid rgba(0,0,0,0.1)` }} />
                      <span style={{ fontSize: 11, fontWeight: 600, color: C.text }}>{co}</span>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: C.navy, fontFamily: "'DM Mono',monospace" }}>
                      {activeMetric.fmt(d[metric])}
                    </div>
                    <div style={{ fontSize: 10, color: C.text3, marginTop: 2 }}>{d.total} total cases</div>
                  </div>
                )
              })}
            </div>

            {selectedCounty && (
              <div style={{ padding: '12px 14px', background: 'rgba(27,35,52,0.04)', borderRadius: 8, border: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: C.text, marginBottom: 10 }}>
                  {selectedCounty} County — All Metrics
                </div>
                {(() => {
                  const d = bucketData[selectedCounty]
                  return (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      {[
                        ['Total Cases',         d.total],
                        ['DV Cases',            `${d.dvCount} (${d.dvPct}%)`],
                        ['Favorable Outcomes',  `${d.favCount} (${d.outcomePct}%)`],
                        ['Disabled Clients',    `${d.disabledCount} (${d.disabilityPct}%)`],
                      ].map(([label, value]) => (
                        <div key={label}>
                          <div style={{ fontSize: 10, color: C.text3, marginBottom: 2 }}>{label}</div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: C.text, fontFamily: "'DM Mono',monospace" }}>{value}</div>
                        </div>
                      ))}
                    </div>
                  )
                })()}
              </div>
            )}

            <div style={{ marginTop: 12, fontSize: 10, color: C.text3, lineHeight: 1.6 }}>
              * Coos, Carroll, Belknap, Strafford, Rockingham, Hillsborough, and Cheshire counties are grouped as "Other" — cases are not tracked by specific county for these areas.
            </div>
          </div>
        </div>
      </div>

      {/* Hover tooltip (fixed, pointer-events:none) */}
      {tooltip.visible && (
        <div style={{
          position: 'fixed', left: tooltip.x + 14, top: tooltip.y - 14,
          background: '#FFFFFF', border: `1px solid ${C.border}`, borderRadius: 8,
          padding: '8px 12px', fontSize: 12, pointerEvents: 'none', zIndex: 9999,
          boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
        }}>
          <div style={{ fontWeight: 600, color: C.text, marginBottom: 4 }}>{tooltip.name} County</div>
          <div style={{ color: C.text2 }}>
            {activeMetric.label}: <strong style={{ color: C.navy }}>{activeMetric.fmt(bucketData[tooltip.bucket]?.[metric] || 0)}</strong>
          </div>
          <div style={{ color: C.text3, fontSize: 11, marginTop: 2 }}>{bucketData[tooltip.bucket]?.total || 0} total cases</div>
          {tooltip.bucket === 'Other' && (
            <div style={{ color: C.text3, fontSize: 10, marginTop: 3, fontStyle: 'italic' }}>Grouped in "Other" bucket</div>
          )}
        </div>
      )}

      {/* ── Stat cards ─────────────────────────────────────────────── */}
      <Grid4>
        <StatCard label="Sullivan County" value={`${cases.length ? Math.round(cases.filter(c => c.county === 'Sullivan').length / cases.length * 100) : 0}%`} sub={`${cases.filter(c => c.county === 'Sullivan').length} cases`} color={C.violet} />
        <StatCard label="Grafton County"  value={`${cases.length ? Math.round(cases.filter(c => c.county === 'Grafton').length / cases.length * 100) : 0}%`}  sub={`${cases.filter(c => c.county === 'Grafton').length} cases`}  color={C.green} />
        <StatCard label="Merrimack County" value={`${cases.length ? Math.round(cases.filter(c => c.county === 'Merrimack').length / cases.length * 100) : 0}%`} sub={`${cases.filter(c => c.county === 'Merrimack').length} cases`} color={C.slate} />
        <StatCard label="Highest DV rate" value={dvByCounty.sort((a, b) => b.dvPct - a.dvPct)[0]?.county || '-'} sub={`${dvByCounty.sort((a, b) => b.dvPct - a.dvPct)[0]?.dvPct || 0}% DV-flagged cases`} color={C.red} />
      </Grid4>

      {/* ── Charts ─────────────────────────────────────────────────── */}
      <Grid2>
        <ChartCard title="DV rate by county" sub="Percentage of cases in each county flagged as DV survivors">
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={dvByCounty}>
              <XAxis dataKey="county" tick={{ fontSize: 12, fill: C.text3 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: C.text3 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
              <Tooltip {...tt} formatter={v => [`${v}%`, 'DV rate']} />
              <Bar dataKey="dvPct" name="DV rate %" radius={[4, 4, 0, 0]}>
                {dvByCounty.map((e, i) => <Cell key={i} fill={COLORS[e.county] || C.slate} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div style={{ marginTop: 10 }}>
            {dvByCounty.map(co => (
              <div key={co.county} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: `1px solid ${C.border}`, fontSize: 12 }}>
                <span style={{ color: C.text2 }}>{co.county}</span>
                <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11 }}>{co.dv} DV cases out of {co.total} total ({co.dvPct}%)</span>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Issue types by county" sub="Housing, income, and family cases distributed across counties">
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={housingByCounty}>
              <XAxis dataKey="county" tick={{ fontSize: 12, fill: C.text3 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: C.text3 }} axisLine={false} tickLine={false} />
              <Tooltip {...tt} />
              <Bar dataKey="housing" name="Housing" fill={C.green}  stackId="a" />
              <Bar dataKey="income"  name="Income"  fill={C.blue}   stackId="a" />
              <Bar dataKey="family"  name="Family"  fill={C.violet} stackId="a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
            {[['#1D9E75', 'Housing'], ['#378ADD', 'Income'], ['#6B63D4', 'Family']].map(([col, lbl]) => (
              <div key={lbl} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: C.text2 }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: col, display: 'inline-block' }} />{lbl}
              </div>
            ))}
          </div>
        </ChartCard>
      </Grid2>

      <Grid2>
        <ChartCard title="Outcome rate by county" sub="Percentage with a favorable outcome (resolved, settled, or trial decision)">
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={outcomeByCounty}>
              <XAxis dataKey="county" tick={{ fontSize: 12, fill: C.text3 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: C.text3 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
              <Tooltip {...tt} formatter={v => [`${v}%`, 'Favorable outcome rate']} />
              <Bar dataKey="pct" name="Favorable %" fill={C.green} radius={[4, 4, 0, 0]}>
                {outcomeByCounty.map((e, i) => <Cell key={i} fill={e.pct >= 50 ? C.green : C.amber} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Disability rate by county" sub="Percentage of clients with a reported disability">
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={disabilityByCounty}>
              <XAxis dataKey="county" tick={{ fontSize: 12, fill: C.text3 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: C.text3 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
              <Tooltip {...tt} formatter={v => [`${v}%`, 'Disability rate']} />
              <Bar dataKey="pct" name="Disability %" fill={C.amber} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </Grid2>

      {/* ── County comparison table ─────────────────────────────────── */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 14 }}>Full county comparison</div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: `2px solid ${C.border}` }}>
              {['County', 'Total Cases', 'DV Cases', 'DV Rate', 'Disabled Clients', 'Housing Cases', 'Income Cases', 'Family Cases', 'Favorable Outcomes', 'Success Rate'].map(h => (
                <th key={h} style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: C.text3, textTransform: 'uppercase', letterSpacing: '0.05em', padding: '8px 12px', textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COUNTIES.map(co => {
              const cc = cases.filter(c => c.county === co)
              const fav = cc.filter(c => ['Issue resolved', 'Settlement', 'Trial decision'].includes(c.outcome)).length
              const isHighlighted = selectedCounty === co
              return (
                <tr
                  key={co}
                  onClick={() => handleCountyClick(co)}
                  style={{
                    borderBottom: `1px solid ${C.border}`,
                    background: isHighlighted ? 'rgba(27,35,52,0.05)' : 'transparent',
                    cursor: co !== 'Other' ? 'pointer' : 'default',
                    transition: 'background 0.15s',
                  }}
                >
                  <td style={{ padding: '9px 12px', fontWeight: 600, color: COLORS[co], display: 'flex', alignItems: 'center', gap: 6 }}>
                    {isHighlighted && <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.navy, display: 'inline-block', flexShrink: 0 }} />}
                    {co}
                  </td>
                  <td style={{ padding: '9px 12px', fontFamily: "'DM Mono',monospace" }}>{cc.length}</td>
                  <td style={{ padding: '9px 12px', fontFamily: "'DM Mono',monospace" }}>{cc.filter(c => c.dv === 'yes').length}</td>
                  <td style={{ padding: '9px 12px', fontFamily: "'DM Mono',monospace", color: C.red }}>{cc.length ? Math.round(cc.filter(c => c.dv === 'yes').length / cc.length * 100) : 0}%</td>
                  <td style={{ padding: '9px 12px', fontFamily: "'DM Mono',monospace" }}>{cc.filter(c => c.disability === 'yes').length}</td>
                  <td style={{ padding: '9px 12px', fontFamily: "'DM Mono',monospace" }}>{cc.filter(c => c.category === 'Housing & utilities').length}</td>
                  <td style={{ padding: '9px 12px', fontFamily: "'DM Mono',monospace" }}>{cc.filter(c => c.category === 'Income & insurance').length}</td>
                  <td style={{ padding: '9px 12px', fontFamily: "'DM Mono',monospace" }}>{cc.filter(c => c.category === 'Personal & family').length}</td>
                  <td style={{ padding: '9px 12px', fontFamily: "'DM Mono',monospace", color: C.green }}>{fav}</td>
                  <td style={{ padding: '9px 12px', fontFamily: "'DM Mono',monospace", color: fav / cc.length >= 0.5 ? C.green : C.amber }}>{cc.length ? Math.round(fav / cc.length * 100) : 0}%</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Page>
  )
}
