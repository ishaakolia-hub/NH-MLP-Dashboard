import { C, Page } from '../components/ui'

const TIERS = [
  { key:'Grant-dependent',   label:'PRIMARILY PHILANTHROPIC / GRANT-DEPENDENT (LIKE NH)' },
  { key:'Mixed/sustainable', label:'MIXED MODEL, TRANSITIONING TOWARD SUSTAINABILITY' },
  { key:'Mature/diversified',label:'MATURE / DIVERSIFIED, THE TARGET MODEL' },
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
      'Actively seeking sustainable funding, no solution yet',
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
      'LSC exposure, at risk from proposed 2026 defunding',
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
      '$8.1M in medical debt relieved, strong ROI argument',
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
  violet: { background:C.violetPale,  color:C.violet },
  green:  { background:'#E6F5EF',     color:C.green  },
  amber:  { background:'#FEF3DC',     color:C.amber  },
  red:    { background:'#FDEAEA',     color:C.red    },
}

const TIER_COLORS = {
  'Grant-dependent':   { bg:'#FEF3DC', border:'#F5A623', text:'#9A6400' },
  'Mixed/sustainable': { bg:'#E8F5FF', border:'#4A9EE0', text:'#1A6498' },
  'Mature/diversified':{ bg:'#E6F5EF', border:'#2ECC71', text:'#1A7A46' },
}

export default function Compare() {
  return (
    <Page>
      <div style={{ marginBottom:8 }}>
        <div style={{ fontSize:13, fontWeight:500, marginBottom:4 }}>Funding stability: NH in national context</div>
        <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:C.text3, marginBottom:28 }}>Based on funding model benchmarks. The target path: grant-dependent → mixed → mature/diversified.</div>

        {TIERS.map(({ key, label }) => {
          const tc = TIER_COLORS[key]
          return (
            <div key={key} style={{ marginBottom:32 }}>
              {/* Tier header band */}
              <div style={{ background:tc.bg, border:`1px solid ${tc.border}`, borderRadius:8, padding:'8px 14px', marginBottom:12 }}>
                <span style={{ fontFamily:"'DM Mono',monospace", fontSize:10, fontWeight:700, color:tc.text, textTransform:'uppercase', letterSpacing:'0.1em' }}>{label}</span>
              </div>

              {/* MLP rows */}
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {STABILITY.filter(s => s.tier === key).map(s => {
                  const badge = BADGE_STYLES[s.modelVariant] || BADGE_STYLES.violet
                  return (
                    <div key={s.name} style={{ display:'grid', gridTemplateColumns:'200px 1fr 200px', gap:0, background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, overflow:'hidden' }}>

                      {/* Left: identity */}
                      <div style={{ padding:'14px 16px', borderRight:`1px solid ${C.border}` }}>
                        <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:6 }}>
                          <span style={{ width:9, height:9, borderRadius:'50%', background:s.dot, display:'inline-block', flexShrink:0 }}/>
                          <span style={{ fontSize:13, fontWeight:600, color:s.isNH ? C.violet : C.text, lineHeight:1.3 }}>{s.name}</span>
                        </div>
                        {s.nameNote && (
                          <div style={{ fontSize:10, color:C.violet,  marginBottom:8, paddingLeft:16 }}>{s.nameNote}</div>
                        )}
                        <div style={{ paddingLeft:16 }}>
                          <div style={{ display:'inline-block', padding:'2px 8px', borderRadius:4, fontFamily:"'DM Mono',monospace", fontSize:10, fontWeight:500, ...badge }}>{s.model}</div>
                        </div>
                      </div>

                      {/* Middle: bullets */}
                      <div style={{ padding:'14px 18px' }}>
                        <ul style={{ margin:0, padding:0, listStyle:'none', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'4px 16px' }}>
                          {s.bullets.map(b => (
                            <li key={b} style={{ fontSize:12, color:C.text2, lineHeight:1.6, display:'flex', gap:6, alignItems:'flex-start' }}>
                              <span style={{ color:C.text3, flexShrink:0, marginTop:2 }}>–</span>
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Right: risk */}
                      <div style={{ padding:'14px 16px', borderLeft:`1px solid ${C.border}`, display:'flex', flexDirection:'column', justifyContent:'center', gap:8 }}>
                        <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:C.text3 }}>Stability risk</div>
                        <div style={{ height:6, background:C.bg2, borderRadius:3, overflow:'hidden' }}>
                          <div style={{ width:`${s.risk * 100}%`, height:'100%', background:s.bar, borderRadius:3, transition:'width 0.6s' }}/>
                        </div>
                        <div style={{ fontFamily:"'DM Mono',monospace", fontSize:11, fontWeight:600, color:s.bar }}>{s.riskLabel}</div>
                      </div>

                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Model comparison table */}
      <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:20, marginTop:8 }}>
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
