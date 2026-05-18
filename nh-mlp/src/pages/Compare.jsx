import { C, Page } from '../components/ui'

const TIERS = [
  { key:'Grant-dependent',   label:'PRIMARILY PHILANTHROPIC / GRANT-DEPENDENT — LIKE NH' },
  { key:'Mixed/sustainable', label:'MIXED MODEL — TRANSITIONING TOWARD SUSTAINABILITY' },
  { key:'Mature/diversified',label:'MATURE / DIVERSIFIED — THE TARGET MODEL' },
]

const STABILITY = [
  {
    name:'New Hampshire', nameNote:'← you are here', isNH:true,
    model:'Philanthropic + LSC', modelVariant:'violet',
    dot:C.blue, bar:C.red, riskLabel:'High', risk:0.75,
    tier:'Grant-dependent',
    bullets:[
      'Foundation grants drive program operations',
      'TLC/Moms/ATP tracks emerging but not state-funded',
      'No published outcomes research yet',
      'Vulnerable to grant cycle disruption',
    ],
  },
  {
    name:'Georgia (Waycross rural MLP)',
    model:'Pandemic-era funding', modelVariant:'red',
    dot:C.red, bar:C.red, riskLabel:'Very high', risk:0.92,
    tier:'Grant-dependent',
    bullets:[
      'Launched May 2022 on COVID relief funds',
      'Only known MLP in rural South Georgia',
      'Actively seeking sustainable funding — no solution yet',
      'FQHC partner but HRSA funds not yet redirected to legal',
    ],
  },
  {
    name:'Massachusetts (Worcester MLP)',
    model:'LSC Pro Bono grant', modelVariant:'amber',
    dot:C.amber, bar:C.orange, riskLabel:'Medium-high', risk:0.65,
    tier:'Grant-dependent',
    bullets:[
      'Launched with $209K LSC Pro Bono Innovation Fund grant',
      'Pro bono attorneys handle ~70% of caseload',
      'One staff attorney + AmeriCorps paralegal',
      'Grant-dependent; pro bono reliance = capacity ceiling',
    ],
  },
  {
    name:'Indiana (12 MLPs statewide)',
    model:'Health system operational', modelVariant:'green',
    dot:C.green, bar:C.green, riskLabel:'Low', risk:0.15,
    tier:'Mixed/sustainable',
    bullets:[
      'Healthcare partners fully fund staff attorneys (~$102K/yr)',
      '2 tracks funded by state health dept + bar association',
      'Goal: each MLP self-sustaining via hospital partner',
      'Best-practice model for health system absorption',
    ],
  },
  {
    name:'Minnesota (Bemidji dental MLP)',
    model:'LSC + community', modelVariant:'violet',
    dot:C.violet, bar:C.amber, riskLabel:'Medium', risk:0.45,
    tier:'Mixed/sustainable',
    bullets:[
      'First MLP in a dental clinic setting nationally',
      'Legal Services of NW Minnesota (LSC-funded) as partner',
      'Community "Know Your Rights" sessions expand reach',
      'LSC exposure — at risk from proposed 2026 defunding',
    ],
  },
  {
    name:'Illinois (Southern rural MLP)',
    model:'Hospital + philanthropy', modelVariant:'amber',
    dot:C.orange, bar:C.green, riskLabel:'Low-medium', risk:0.28,
    tier:'Mixed/sustainable',
    bullets:[
      'Joint venture: SIH hospital + Land of Lincoln legal aid',
      '~$318K annual operating cost, hospital co-funds',
      '$8.1M in medical debt relieved — strong ROI argument',
      'ROI model used as national sustainability benchmark',
    ],
  },
  {
    name:'Delaware (DMLP)',
    model:'State + health system + LSC', modelVariant:'green',
    dot:C.green, bar:C.green, riskLabel:'Low', risk:0.12,
    tier:'Mature/diversified',
    bullets:[
      'State Div. of Public Health funds postpartum track directly',
      'ChristianaCare funds navigator staff operationally',
      'CLASI baseline via LSC; each track has own funder',
      'IRB research sustains long-term credibility',
    ],
  },
  {
    name:'Ohio (Cincinnati Child HeLP)',
    model:'Health system + federal research', modelVariant:'green',
    dot:C.green, bar:C.green, riskLabel:'Very low', risk:0.05,
    tier:'Mature/diversified',
    bullets:[
      "Cincinnati Children's Hospital absorbs attorney costs",
      'AHRQ federal research grant ($1R01HS027996)',
      '38% hospitalization reduction drives system investment',
      'Published outcomes = self-sustaining funding argument',
    ],
  },
  {
    name:'California (Kaiser Permanente)',
    model:'Health system strategic', modelVariant:'amber',
    dot:C.amber, bar:C.green, riskLabel:'Very low', risk:0.05,
    tier:'Mature/diversified',
    bullets:[
      'Largest health system to invest system-wide in MLPs',
      'Invested in 19 legal aid agencies by 2024',
      'Housing + eviction prevention as strategic health spend',
      'Philanthropic origins → full operational integration',
    ],
  },
]

const BADGE_STYLES = {
  violet: { background:C.violetPale, color:C.violet },
  green:  { background:'#D4F2E8',    color:C.green  },
  amber:  { background:'#FEF3DC',    color:C.amber  },
  red:    { background:'#FDEAEA',    color:C.red    },
}

export default function Compare() {
  return (
    <Page>
      <div style={{ marginBottom:8 }}>
        <div style={{ fontSize:13, fontWeight:500, marginBottom:4 }}>Funding stability — NH in national context</div>
        <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:C.text3, marginBottom:28 }}>Based on funding model benchmarks. The target path: grant-dependent → mixed → mature/diversified.</div>

        {TIERS.map(({ key, label }) => (
          <div key={key} style={{ marginBottom:36 }}>
            <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:C.text3, textTransform:'uppercase', letterSpacing:'0.08em', borderBottom:`1px solid ${C.border}`, paddingBottom:8, marginBottom:20 }}>{label}</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:24 }}>
              {STABILITY.filter(s => s.tier === key).map(s => {
                const badge = BADGE_STYLES[s.modelVariant] || BADGE_STYLES.violet
                return (
                  <div key={s.name}>
                    {/* Name row */}
                    <div style={{ display:'flex', alignItems:'baseline', gap:8, marginBottom:6 }}>
                      <span style={{ width:10, height:10, borderRadius:'50%', background:s.dot, display:'inline-block', flexShrink:0, marginTop:2 }}/>
                      <span style={{ fontSize:13, fontWeight:600, color:s.isNH ? C.violet : C.text }}>{s.name}</span>
                      {s.nameNote && <span style={{ fontSize:11, color:C.text3 }}>{s.nameNote}</span>}
                    </div>

                    {/* Model badge */}
                    <div style={{ display:'inline-block', padding:'2px 8px', borderRadius:4, fontFamily:"'DM Mono',monospace", fontSize:10, fontWeight:500, marginBottom:12, ...badge }}>{s.model}</div>

                    {/* Bullets */}
                    <ul style={{ margin:'0 0 16px 0', padding:0, listStyle:'none' }}>
                      {s.bullets.map(b => (
                        <li key={b} style={{ fontSize:12, color:C.text2, lineHeight:1.7, paddingLeft:0 }}>— {b}</li>
                      ))}
                    </ul>

                    {/* Risk bar */}
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:C.text3, flexShrink:0 }}>Stability risk</div>
                      <div style={{ flex:1, height:5, background:C.bg2, borderRadius:3, overflow:'hidden' }}>
                        <div style={{ width:`${s.risk * 100}%`, height:'100%', background:s.bar, borderRadius:3, transition:'width 0.6s' }}/>
                      </div>
                      <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:s.bar, flexShrink:0, minWidth:60, textAlign:'right' }}>{s.riskLabel}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Model comparison table */}
      <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:20 }}>
        <div style={{ fontSize:13, fontWeight:500, marginBottom:14 }}>What the mature models did to get there</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12 }}>
          {[
            { name:'Illinois (Southern rural)', key:'ROI model', action:'Documented $8.1M in medical debt relieved. Used as a national sustainability benchmark. Hospital now co-funds.', color:C.green },
            { name:'Indiana (12 MLPs)', key:'Health system absorption', action:'Healthcare partners fully fund staff attorneys (~$102K/yr each). State health dept + bar association provide 2 tracks. Goal: each MLP self-sustaining via hospital partner.', color:C.green },
            { name:'Ohio (Cincinnati Child HeLP)', key:'Federal research grant', action:'Secured AHRQ federal research grant ($1R01HS027996). 38% hospitalization reduction drives system investment. Published outcomes = self-sustaining funding argument.', color:C.blue },
          ].map(({name,key,action,color}) => (
            <div key={name} style={{ padding:14, background:C.bg, borderRadius:8, borderLeft:`3px solid ${color}` }}>
              <div style={{ fontSize:11, fontWeight:600, color, marginBottom:3 }}>{name}</div>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:C.text3, marginBottom:6 }}>Strategy: {key}</div>
              <div style={{ fontSize:11, color:C.text2, lineHeight:1.6 }}>{action}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop:14, padding:'10px 14px', background:C.violetPale, borderRadius:8, fontSize:12, color:C.violet, lineHeight:1.6 }}>
          NH MLP next steps: (1) Start tracking Measure 6 financial benefit systematically. (2) Document children reached through cascade effect. (3) Approach Dartmouth Health about absorbing attorney costs. The data you are building now is the evidence base for that conversation.
        </div>
      </div>
    </Page>
  )
}
