import { useState } from 'react'
import { C, Page } from '../components/ui'

const TIER_KEYS = ['Grant-dependent', 'Mixed/sustainable', 'Mature/diversified']

const TIER_META = {
  'Grant-dependent': {
    num: 'I',
    label: 'Grant-Dependent',
    sublabel: 'Primarily philanthropic · High funding-cycle exposure',
    accentColor: '#DC2626',
    headerBg: '#FEF2F2',
    tierBg: '#FFF8F8',
    tierBorder: '#FECDD3',
    headerText: '#991B1B',
    color: '#991B1B',
    accent: '#DC2626',
  },
  'Mixed/sustainable': {
    num: 'II',
    label: 'Transitioning',
    sublabel: 'Mixed model · Institutional partnerships forming',
    accentColor: '#D97706',
    headerBg: '#FFFBEB',
    tierBg: '#FFFDF5',
    tierBorder: '#FDE68A',
    headerText: '#92400E',
    color: '#92400E',
    accent: '#D97706',
  },
  'Mature/diversified': {
    num: 'III',
    label: 'Mature / Diversified',
    sublabel: 'Target model · Independently sustained, research-backed',
    accentColor: '#16A34A',
    headerBg: '#F0FDF4',
    tierBg: '#F5FFF8',
    tierBorder: '#BBF7D0',
    headerText: '#14532D',
    color: '#14532D',
    accent: '#16A34A',
  },
}

const BADGE = {
  violet: { bg: '#F5F3FF', color: '#6D28D9', border: '#DDD6FE' },
  green:  { bg: '#F0FDF4', color: '#15803D', border: '#BBF7D0' },
  amber:  { bg: '#FFFBEB', color: '#B45309', border: '#FDE68A' },
  red:    { bg: '#FFF5F5', color: '#B91C1C', border: '#FECACA' },
}

const RISK_CFG = {
  'Very High':   { fill: '#DC2626', track: '#FEE2E2', text: '#991B1B' },
  'High':        { fill: '#EA580C', track: '#FFEDD5', text: '#9A3412' },
  'Medium-High': { fill: '#D97706', track: '#FEF3C7', text: '#92400E' },
  'Medium':      { fill: '#CA8A04', track: '#FEFCE8', text: '#713F12' },
  'Low-Medium':  { fill: '#65A30D', track: '#F7FEE7', text: '#3F6212' },
  'Low':         { fill: '#16A34A', track: '#DCFCE7', text: '#14532D' },
  'Very Low':    { fill: '#059669', track: '#D1FAE5', text: '#065F46' },
}

const PROGRAMS = [
  {
    name: 'New Hampshire MLP',
    nameNote: '← you are here',
    isNH: true,
    tier: 'Grant-dependent',
    model: 'Philanthropic + LSC',
    modelVariant: 'violet',
    riskLabel: 'High',
    riskScore: 0.75,
    fundingStructure: 'Foundation grants + LSC baseline; no state or institutional commitment',
    opsModel: '3 emerging tracks (TLC/Moms/ATP); pre-outcomes phase',
    sustainabilitySignal: 'Full grant-cycle exposure; no outcomes data published',
    expandedPoints: [
      'TLC/Moms/ATP tracks active but not state-funded',
      'No institutional absorption mechanism in place',
      'Dartmouth Health partnership not yet initiated',
    ],
  },
  {
    name: 'Georgia (Waycross)',
    tier: 'Grant-dependent',
    model: 'COVID-era emergency',
    modelVariant: 'red',
    riskLabel: 'Very High',
    riskScore: 0.92,
    fundingStructure: 'COVID relief funds (expired); no replacement funding secured',
    opsModel: 'FQHC-embedded; sole rural MLP in South Georgia',
    sustainabilitySignal: 'HRSA-to-legal redirect pending; no pathway confirmed',
    expandedPoints: [
      'Launched May 2022 on federal emergency relief — now depleted',
      'FQHC partnership exists but HRSA funds not yet redirected to legal services',
    ],
  },
  {
    name: 'Massachusetts (Worcester)',
    tier: 'Grant-dependent',
    model: 'LSC Pro Bono grant',
    modelVariant: 'amber',
    riskLabel: 'Medium-High',
    riskScore: 0.65,
    fundingStructure: '$209K LSC Pro Bono Innovation Fund (single-source)',
    opsModel: '1 staff attorney + AmeriCorps paralegal; 70% pro bono caseload',
    sustainabilitySignal: 'Pro bono reliance creates structural capacity ceiling',
    expandedPoints: [
      'High pro bono dependency limits scale and quality consistency',
      'LSC funding exposure under proposed 2026 federal defunding',
    ],
  },
  {
    name: 'Indiana (12 MLPs)',
    tier: 'Mixed/sustainable',
    model: 'Health system absorption',
    modelVariant: 'green',
    riskLabel: 'Low',
    riskScore: 0.15,
    fundingStructure: 'Health system absorption (~$102K/attorney/yr) + state + bar association',
    opsModel: '12 sites statewide; dual-track via state health dept + bar assoc.',
    sustainabilitySignal: 'Each site self-sustaining via hospital partner; replicable model',
    expandedPoints: [
      'National reference model for health system absorption',
      'State health dept + bar association provide structural second funding track',
    ],
  },
  {
    name: 'Minnesota (Bemidji)',
    tier: 'Mixed/sustainable',
    model: 'LSC + community',
    modelVariant: 'violet',
    riskLabel: 'Medium',
    riskScore: 0.45,
    fundingStructure: 'LSC (Legal Services of NW Minnesota) + community philanthropy',
    opsModel: 'First dental clinic MLP nationally; community outreach model',
    sustainabilitySignal: 'LSC exposure risk under 2026 federal defunding proposals',
    expandedPoints: [
      'Dental clinic setting demonstrates model flexibility beyond primary care',
      'Community engagement sessions expand reach beyond clinical patients',
    ],
  },
  {
    name: 'Illinois (Southern Rural)',
    tier: 'Mixed/sustainable',
    model: 'Hospital + philanthropy',
    modelVariant: 'amber',
    riskLabel: 'Low-Medium',
    riskScore: 0.28,
    fundingStructure: 'SIH hospital co-funding + Land of Lincoln legal aid; $318K/yr joint venture',
    opsModel: 'ROI-documented model; $8.1M medical debt relieved',
    sustainabilitySignal: 'Hospital now co-funds based on demonstrated ROI; national benchmark',
    expandedPoints: [
      '$8.1M in medical debt relieved; national sustainability benchmark',
      'Hospital investment driven by documented financial return, not philanthropy',
    ],
  },
  {
    name: 'Delaware (DMLP)',
    tier: 'Mature/diversified',
    model: 'State + health system + LSC',
    modelVariant: 'green',
    riskLabel: 'Low',
    riskScore: 0.12,
    fundingStructure: 'State (DPH) + ChristianaCare + LSC; each track independently funded',
    opsModel: 'Multi-track (postpartum, navigator, baseline); IRB research integration',
    sustainabilitySignal: 'Fully diversified; structural redundancy across all funding streams',
    expandedPoints: [
      'Each program track independently funded — no single point of failure',
      'IRB research integration sustains institutional credibility and grant eligibility',
    ],
  },
  {
    name: 'Ohio (Cincinnati HeLP)',
    tier: 'Mature/diversified',
    model: 'Health system + federal research',
    modelVariant: 'green',
    riskLabel: 'Very Low',
    riskScore: 0.05,
    fundingStructure: "Cincinnati Children's absorbs attorney costs + AHRQ ($1R01HS027996)",
    opsModel: 'Hospital fully absorbs operational costs; research-grant supplemented',
    sustainabilitySignal: '38% hospitalization reduction; published outcomes drive reinvestment',
    expandedPoints: [
      'AHRQ federal research grant provides independent validation and credibility',
      'Published outcomes data created a self-reinforcing funding argument',
    ],
  },
  {
    name: 'California (Kaiser)',
    tier: 'Mature/diversified',
    model: 'Health system strategic',
    modelVariant: 'amber',
    riskLabel: 'Very Low',
    riskScore: 0.05,
    fundingStructure: 'Kaiser Permanente strategic investment; 19 legal aid agencies by 2024',
    opsModel: 'Housing + eviction prevention as population health spend; system-wide',
    sustainabilitySignal: 'Philanthropic origins → full operational integration at system scale',
    expandedPoints: [
      'Largest health system MLP investment nationally — 19 agencies system-wide',
      'MLP framed as strategic health spend, not charity — fully operationalized',
    ],
  },
]

const MATURE_STRATEGIES = [
  {
    name: 'Illinois (Southern Rural)',
    strategy: 'ROI Documentation',
    color: '#16A34A',
    accentBg: '#F0FDF4',
    insight: 'Hospital co-funding secured through documented financial return on MLP investment, not philanthropy.',
    proofPoints: ['$8.1M in medical debt relieved', 'National sustainability benchmark; hospital now co-funds'],
  },
  {
    name: 'Indiana (12 MLPs)',
    strategy: 'Health System Absorption',
    color: '#0E7490',
    accentBg: '#ECFEFF',
    insight: 'Health system fully absorbs attorney costs, eliminating grant dependency across 12 sites statewide.',
    proofPoints: ['~$102K/attorney/yr absorbed by hospital partners', 'State + bar assoc. provide structural second track'],
  },
  {
    name: 'Ohio (Cincinnati HeLP)',
    strategy: 'Federal Research Grant',
    color: '#1D4ED8',
    accentBg: '#EFF6FF',
    insight: 'Published outcomes data created a self-sustaining funding argument for continued hospital reinvestment.',
    proofPoints: ['AHRQ grant $1R01HS027996', '38% hospitalization reduction → system-level reinvestment'],
  },
]

const NH_STEPS = [
  {
    n: '01',
    status: 'Operationalized',
    statusColor: '#059669',
    statusBg: '#ECFDF5',
    statusBorder: '#A7F3D0',
    title: 'Measure 6 Financial Benefit Capture Infrastructure',
    infrastructure: 'A standardized Measure 6 financial benefit capture protocol is operationalized across all NH MLP program tracks. Each case record captures verified dollar amount, benefit category (lump sum vs. monthly ongoing), case linkage, referral attribution, and household association. Data is structured for longitudinal aggregation and stratified export.',
    strategicValue: 'This creates a longitudinal ROI evaluation dataset capable of stratifying financial outcomes by referral source, legal issue type, program arm, household reach, and institutional relevance — the evidentiary foundation required for health system absorption and hospital co-investment conversations.',
    tags: ['Longitudinal ROI Dataset', 'Outcome Stratification', 'Referral Attribution', 'Household Association'],
  },
  {
    n: '02',
    status: 'Active',
    statusColor: '#1D4ED8',
    statusBg: '#EFF6FF',
    statusBorder: '#BFDBFE',
    title: 'Cross-Program Household Impact Analytics',
    infrastructure: 'Household-level impact modeling is active across TLC, Moms, and ATP program tracks, capturing indirect reach through adult client case resolution. The analytics layer quantifies cascade effects on minor dependents, household economic stabilization, and multi-issue resolution patterns — enabling cross-program comparative evaluation at the unit of the household, not the individual case.',
    strategicValue: 'Outcomes structured at the household unit are IRB-eligible and position NH MLP for federal research grant mechanisms (e.g., AHRQ R01) — the documented pathway to institutional co-investment demonstrated by Cincinnati HeLP\'s published 38% hospitalization reduction and ongoing system-level reinvestment.',
    tags: ['Household-Level Modeling', 'Cross-Program Analytics', 'IRB Research Architecture', 'Federal Grant Readiness'],
  },
  {
    n: '03',
    status: 'Pathway Ready',
    statusColor: '#B45309',
    statusBg: '#FFFBEB',
    statusBorder: '#FDE68A',
    title: 'Institutional Financing Pathway — Dartmouth Health',
    infrastructure: 'The operational ROI dataset, household impact record, and multi-track outcomes architecture position NH MLP for a formal institutional financing engagement with Dartmouth Health. The evidence profile mirrors the pre-absorption structure of the Indiana model (~$102K/attorney/yr health system absorption) and the Illinois ROI documentation framework ($8.1M in verified medical debt relief).',
    strategicValue: 'Institutional absorption of attorney costs — transitioning NH MLP from grant-dependent to a mixed/diversified sustainability architecture — requires a structured outcomes presentation to a hospital executive audience. The evidentiary foundation is now sufficiently mature for formal partnership modeling and institutional financing negotiation.',
    tags: ['Health System Absorption', 'Sustainability Architecture', 'Institutional ROI Framing', 'National Benchmark Alignment'],
  },
]

const COLS = { gridTemplateColumns: '200px 1fr 1fr 1fr 168px' }
const COL_LABELS = ['Program', 'Funding Structure', 'Operational Model', 'Sustainability Signal', 'Risk Level']

export default function Compare() {
  const [expanded, setExpanded] = useState(null)
  const [hovered, setHovered] = useState(null)

  return (
    <Page>
      {/* Page header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{
          fontSize: 20,
          fontWeight: 800,
          color: '#0F172A',
          letterSpacing: '-0.03em',
          marginBottom: 5,
          lineHeight: 1.15,
        }}>
          National MLP Benchmarking Matrix
        </div>
        <div style={{ fontSize: 12, color: '#64748B', lineHeight: 1.5 }}>
          Funding model analysis · NH in national context · Pathway: grant-dependent → mixed → mature/diversified
        </div>
      </div>

      {/* Column header — dark navy bar */}
      <div style={{
        display: 'grid',
        ...COLS,
        background: '#1E293B',
        borderRadius: '10px 10px 0 0',
        overflow: 'hidden',
      }}>
        {COL_LABELS.map((label, i) => (
          <div key={label} style={{
            padding: '10px 0',
            paddingLeft: i === 0 ? 18 : 14,
            paddingRight: 8,
            fontFamily: "'DM Mono', monospace",
            fontSize: 9,
            fontWeight: 700,
            color: '#94A3B8',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.06)' : undefined,
          }}>
            {label}
          </div>
        ))}
      </div>

      {/* Tier sections — outer frame */}
      <div style={{
        border: '1px solid #E2E8F0',
        borderTop: 'none',
        borderRadius: '0 0 10px 10px',
        overflow: 'hidden',
        marginBottom: 20,
      }}>
        {TIER_KEYS.map((key, tierIdx) => {
          const tm = TIER_META[key]
          const tierPrograms = PROGRAMS.filter(p => p.tier === key)
          return (
            <div
              key={key}
              style={{
                background: tm.tierBg,
                borderLeft: `5px solid ${tm.accentColor}`,
                borderBottom: tierIdx < TIER_KEYS.length - 1 ? '3px solid #CBD5E1' : undefined,
              }}
            >
              {/* Tier header band */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                background: tm.headerBg,
                borderBottom: `1px solid ${tm.tierBorder}`,
                padding: '11px 16px',
              }}>
                {/* Tier number pill */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  background: tm.accentColor,
                  flexShrink: 0,
                  boxShadow: `0 2px 6px ${tm.accentColor}50`,
                }}>
                  <span style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 11,
                    fontWeight: 800,
                    color: '#fff',
                  }}>
                    {tm.num}
                  </span>
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: tm.headerText,
                    textTransform: 'uppercase',
                    letterSpacing: '0.07em',
                    lineHeight: 1.2,
                  }}>
                    Tier {tm.num} · {tm.label}
                  </div>
                  <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>
                    {tm.sublabel}
                  </div>
                </div>

                <div style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 9,
                  fontWeight: 600,
                  color: tm.accentColor,
                  background: `${tm.accentColor}12`,
                  border: `1px solid ${tm.accentColor}35`,
                  padding: '3px 10px',
                  borderRadius: 20,
                  letterSpacing: '0.06em',
                  flexShrink: 0,
                }}>
                  {tierPrograms.length} programs
                </div>
              </div>

              {/* Program rows */}
              <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 7 }}>
                {tierPrograms.map(p => {
                  const isExp = expanded === p.name
                  const isHov = hovered === p.name
                  const badge = BADGE[p.modelVariant] || BADGE.violet
                  const rc = RISK_CFG[p.riskLabel] || RISK_CFG['Medium']

                  return (
                    <div
                      key={p.name}
                      style={{
                        background: p.isNH ? 'rgba(245,243,255,0.65)' : '#FFFFFF',
                        borderRadius: 8,
                        border: `1px solid ${p.isNH ? 'rgba(124,58,237,0.28)' : isHov || isExp ? '#B8C4D0' : '#E4E9EF'}`,
                        borderLeft: p.isNH ? '4px solid #7C3AED' : undefined,
                        boxShadow: isExp
                          ? '0 6px 20px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)'
                          : isHov
                            ? '0 3px 12px rgba(0,0,0,0.09), 0 1px 4px rgba(0,0,0,0.05)'
                            : '0 1px 3px rgba(0,0,0,0.05)',
                        transition: 'box-shadow 0.15s ease, border-color 0.15s ease',
                        overflow: 'hidden',
                      }}
                      onMouseEnter={() => setHovered(p.name)}
                      onMouseLeave={() => setHovered(null)}
                    >
                      {/* Main row grid */}
                      <div
                        style={{ display: 'grid', ...COLS, cursor: 'pointer' }}
                        onClick={() => setExpanded(isExp ? null : p.name)}
                      >
                        {/* Program name */}
                        <div style={{
                          padding: '13px 12px',
                          paddingLeft: p.isNH ? 10 : 14,
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          gap: 4,
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                            <div style={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              background: p.isNH ? '#7C3AED' : rc.fill,
                              flexShrink: 0,
                              boxShadow: `0 0 0 2px ${p.isNH ? 'rgba(124,58,237,0.18)' : rc.track}`,
                            }} />
                            <span style={{
                              fontSize: 13,
                              fontWeight: p.isNH ? 700 : 600,
                              color: p.isNH ? '#5B21B6' : '#0F172A',
                              letterSpacing: '-0.01em',
                              lineHeight: 1.2,
                            }}>
                              {p.name}
                            </span>
                          </div>
                          {p.nameNote && (
                            <div style={{
                              fontSize: 9,
                              color: '#7C3AED',
                              paddingLeft: 15,
                              fontFamily: "'DM Mono', monospace",
                              letterSpacing: '0.04em',
                              fontWeight: 600,
                            }}>
                              {p.nameNote}
                            </div>
                          )}
                          <div style={{ paddingLeft: 15 }}>
                            <span style={{
                              fontFamily: "'DM Mono', monospace",
                              fontSize: 9,
                              fontWeight: 600,
                              padding: '2px 7px',
                              borderRadius: 4,
                              background: badge.bg,
                              color: badge.color,
                              border: `1px solid ${badge.border}`,
                              display: 'inline-block',
                            }}>
                              {p.model}
                            </span>
                          </div>
                        </div>

                        {/* Funding Structure */}
                        <div style={{
                          padding: '13px 14px',
                          display: 'flex',
                          alignItems: 'center',
                          borderLeft: '1px solid #F1F5F9',
                        }}>
                          <span style={{ fontSize: 12, fontWeight: 500, color: '#0F172A', lineHeight: 1.55 }}>
                            {p.fundingStructure}
                          </span>
                        </div>

                        {/* Operational Model */}
                        <div style={{
                          padding: '13px 14px',
                          display: 'flex',
                          alignItems: 'center',
                          borderLeft: '1px solid #F1F5F9',
                        }}>
                          <span style={{ fontSize: 12, fontWeight: 500, color: '#0F172A', lineHeight: 1.55 }}>
                            {p.opsModel}
                          </span>
                        </div>

                        {/* Sustainability Signal */}
                        <div style={{
                          padding: '13px 14px',
                          display: 'flex',
                          alignItems: 'center',
                          borderLeft: '1px solid #F1F5F9',
                        }}>
                          <span style={{ fontSize: 12, fontWeight: 500, color: '#0F172A', lineHeight: 1.55 }}>
                            {p.sustainabilitySignal}
                          </span>
                        </div>

                        {/* Risk Level */}
                        <div style={{
                          padding: '13px 14px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          gap: 7,
                          borderLeft: '1px solid #F1F5F9',
                        }}>
                          {/* Risk bar track */}
                          <div style={{
                            height: 7,
                            background: rc.track,
                            borderRadius: 4,
                            overflow: 'hidden',
                          }}>
                            <div style={{
                              width: `${p.riskScore * 100}%`,
                              height: '100%',
                              background: rc.fill,
                              borderRadius: 4,
                            }} />
                          </div>
                          {/* Risk label */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <div style={{
                              width: 7,
                              height: 7,
                              borderRadius: '50%',
                              background: rc.fill,
                              flexShrink: 0,
                            }} />
                            <span style={{
                              fontFamily: "'DM Mono', monospace",
                              fontSize: 10,
                              fontWeight: 700,
                              color: rc.text,
                              letterSpacing: '0.03em',
                            }}>
                              {p.riskLabel}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Expanded detail panel */}
                      {isExp && (
                        <div style={{
                          borderTop: `1px solid ${p.isNH ? 'rgba(124,58,237,0.15)' : '#F1F5F9'}`,
                          padding: '10px 14px 12px',
                          background: p.isNH ? 'rgba(245,243,255,0.4)' : '#FAFBFC',
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '6px 28px',
                        }}>
                          {p.expandedPoints.map((pt, i) => (
                            <div key={i} style={{
                              display: 'flex',
                              gap: 8,
                              alignItems: 'flex-start',
                              flex: '0 0 calc(50% - 14px)',
                              minWidth: 220,
                            }}>
                              <span style={{
                                color: tm.accentColor,
                                fontSize: 9,
                                marginTop: 3,
                                flexShrink: 0,
                                fontWeight: 700,
                              }}>
                                ▶
                              </span>
                              <span style={{ fontSize: 11, fontWeight: 500, color: '#334155', lineHeight: 1.6 }}>
                                {pt}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Proven Pathways */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 12,
        boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
      }}>
        <div style={{
          padding: '13px 20px',
          borderBottom: '1px solid #F1F5F9',
          background: '#F8FAFC',
          display: 'flex',
          alignItems: 'baseline',
          gap: 12,
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', letterSpacing: '-0.01em' }}>
            Proven Pathways to Institutional Sustainability
          </div>
          <div style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 9,
            color: '#94A3B8',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}>
            Mature MLP strategy cases
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}>
          {MATURE_STRATEGIES.map(({ name, strategy, color, accentBg, insight, proofPoints }, i) => (
            <div key={name} style={{
              padding: '16px 18px',
              borderLeft: i > 0 ? '1px solid #F1F5F9' : undefined,
            }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                marginBottom: 8,
                padding: '3px 8px 3px 6px',
                background: accentBg,
                borderRadius: 5,
                border: `1px solid ${color}25`,
              }}>
                <div style={{ width: 7, height: 7, borderRadius: 2, background: color, flexShrink: 0 }} />
                <span style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 9,
                  fontWeight: 700,
                  color,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                }}>
                  {strategy}
                </span>
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#0F172A', marginBottom: 6, lineHeight: 1.3 }}>
                {name}
              </div>
              <div style={{ fontSize: 11, fontWeight: 500, color: '#334155', lineHeight: 1.6, marginBottom: 10 }}>
                {insight}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {proofPoints.map((pt, j) => (
                  <div key={j} style={{
                    display: 'flex',
                    gap: 7,
                    alignItems: 'flex-start',
                    padding: '5px 8px',
                    background: '#F8FAFC',
                    borderRadius: 5,
                    border: '1px solid #F1F5F9',
                  }}>
                    <span style={{ color, fontSize: 8, marginTop: 3, flexShrink: 0 }}>■</span>
                    <span style={{ fontSize: 10, fontWeight: 600, color: '#1E293B', lineHeight: 1.5 }}>{pt}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* NH Operational Infrastructure Status */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: 12,
        overflow: 'hidden',
        boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
      }}>
        {/* Dark header */}
        <div style={{
          padding: '14px 20px',
          borderBottom: '1px solid #1E3A5F',
          background: '#0F172A',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#F1F5F9', letterSpacing: '-0.01em', marginBottom: 3 }}>
              NH MLP · Operational Infrastructure Status
            </div>
            <div style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 9,
              color: '#475569',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}>
              Implementation science · Health services evaluation · Institutional financing readiness
            </div>
          </div>
          <div style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 9,
            fontWeight: 700,
            color: '#A78BFA',
            background: 'rgba(124,58,237,0.18)',
            border: '1px solid rgba(124,58,237,0.35)',
            padding: '4px 11px',
            borderRadius: 20,
            letterSpacing: '0.07em',
            flexShrink: 0,
          }}>
            NH MLP
          </div>
        </div>

        {/* Infrastructure cards */}
        <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {NH_STEPS.map(({ n, status, statusColor, statusBg, statusBorder, title, infrastructure, strategicValue, tags }) => (
            <div key={n} style={{
              borderRadius: 8,
              border: `1px solid ${statusColor}28`,
              borderLeft: `4px solid ${statusColor}`,
              overflow: 'hidden',
            }}>
              {/* Card header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                background: `${statusColor}08`,
                borderBottom: `1px solid ${statusColor}18`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 11,
                    fontWeight: 800,
                    color: statusColor,
                    opacity: 0.55,
                    lineHeight: 1,
                  }}>
                    {n}
                  </span>
                  <span style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: '#0F172A',
                    letterSpacing: '-0.01em',
                  }}>
                    {title}
                  </span>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  padding: '3px 10px',
                  background: statusBg,
                  border: `1px solid ${statusBorder}`,
                  borderRadius: 20,
                  flexShrink: 0,
                }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: statusColor }} />
                  <span style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 9,
                    fontWeight: 700,
                    color: statusColor,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                  }}>
                    {status}
                  </span>
                </div>
              </div>

              {/* Card body — two columns */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: '#FAFBFC' }}>
                <div style={{ padding: '13px 16px', borderRight: `1px solid ${statusColor}15` }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 7,
                    marginBottom: 7,
                  }}>
                    <span style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: 8,
                      fontWeight: 700,
                      color: statusColor,
                      textTransform: 'uppercase',
                      letterSpacing: '0.14em',
                    }}>
                      Infrastructure
                    </span>
                    <div style={{ flex: 1, height: 1, background: `${statusColor}25` }} />
                  </div>
                  <p style={{ fontSize: 11, fontWeight: 500, color: '#1E293B', lineHeight: 1.7, margin: 0 }}>
                    {infrastructure}
                  </p>
                </div>

                <div style={{ padding: '13px 16px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 7,
                    marginBottom: 7,
                  }}>
                    <span style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: 8,
                      fontWeight: 700,
                      color: '#64748B',
                      textTransform: 'uppercase',
                      letterSpacing: '0.14em',
                    }}>
                      Strategic Value
                    </span>
                    <div style={{ flex: 1, height: 1, background: '#E2E8F0' }} />
                  </div>
                  <p style={{ fontSize: 11, fontWeight: 500, color: '#1E293B', lineHeight: 1.7, margin: 0 }}>
                    {strategicValue}
                  </p>
                </div>
              </div>

              {/* Tags */}
              <div style={{
                padding: '8px 14px',
                borderTop: `1px solid ${statusColor}15`,
                background: '#FFFFFF',
                display: 'flex',
                flexWrap: 'wrap',
                gap: 5,
              }}>
                {tags.map(tag => (
                  <span key={tag} style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 9,
                    fontWeight: 600,
                    color: statusColor,
                    background: `${statusColor}0D`,
                    border: `1px solid ${statusColor}22`,
                    padding: '2px 8px',
                    borderRadius: 4,
                    letterSpacing: '0.04em',
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Page>
  )
}
