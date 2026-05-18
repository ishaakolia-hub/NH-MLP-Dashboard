import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts'
import { useApp } from '../App'
import { C, Page, Grid2, ChartCard } from '../components/ui'

const STABILITY = [
  { name:'NH MLP (you are here)', model:'Philanthropic + LSC', risk:0.75, color:C.red, tier:'Grant-dependent' },
  { name:'Georgia (Waycross)', model:'Pandemic-era funding', risk:0.92, color:C.red, tier:'Grant-dependent' },
  { name:'Massachusetts (Worcester)', model:'LSC Pro Bono grant', risk:0.65, color:'#D85A30', tier:'Grant-dependent' },
  { name:'Indiana (12 MLPs)', model:'Health system operational', risk:0.15, color:C.green, tier:'Mixed/sustainable' },
  { name:'Minnesota (Bemidji)', model:'LSC + community', risk:0.45, color:C.amber, tier:'Mixed/sustainable' },
  { name:'Illinois (Southern rural)', model:'Hospital + philanthropy', risk:0.28, color:C.green, tier:'Mixed/sustainable' },
  { name:'Delaware (DMLP)', model:'State + health system + LSC', risk:0.12, color:C.green, tier:'Mature/diversified' },
  { name:'Ohio (Cincinnati Child HeLP)', model:'Health system + federal research', risk:0.05, color:C.green, tier:'Mature/diversified' },
  { name:'California (Kaiser)', model:'Health system strategic', risk:0.05, color:C.green, tier:'Mature/diversified' },
]

const DE_CATS = [
  { cat:'Personal & family', nh:40, de:12 },
  { cat:'Housing & utilities', nh:36, de:46 },
  { cat:'Income & insurance', nh:18, de:42 },
  { cat:'Legal status', nh:3, de:null },
  { cat:'Education & employ.', nh:2, de:null },
]

const RISK_LABELS = { 0.9:'Very high', 0.7:'High', 0.5:'Medium', 0.3:'Low-medium', 0.1:'Low' }

export default function Compare() {
  const { cases } = useApp()

  const nhCatPcts = ['Personal & family','Housing & utilities','Income & insurance','Legal status','Education & employment'].map((cat,i) => ({
    cat: DE_CATS[i].cat,
    nh: cases.length ? Math.round(cases.filter(c=>c.category===cat).length/cases.length*100) : DE_CATS[i].nh,
    de: DE_CATS[i].de,
  }))

  const tt = { contentStyle:{background:C.surface,border:`1px solid ${C.border}`,borderRadius:7,fontSize:12} }

  return (
    <Page>
      <ChartCard title="NH MLP vs Delaware - iHELP category mix" sub="NH leans heavily toward personal/family (custody, DV). Delaware leans toward income and housing. Reflects different referral pathways and partner focus areas." full style={{marginBottom:16}}>
        <div style={{ display:'flex', gap:14, marginBottom:12 }}>
          <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:C.text2 }}>
            <span style={{ width:12, height:12, borderRadius:2, background:C.violet, display:'inline-block' }}></span>NH MLP (live data)
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:C.text2 }}>
            <span style={{ width:12, height:12, borderRadius:2, background:'none', border:`2px dashed ${C.green}`, display:'inline-block' }}></span>Delaware MLP (Mapp et al. 2022)
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={nhCatPcts}>
            <XAxis dataKey="cat" tick={{fontSize:11,fill:C.text3}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fontSize:10,fill:C.text3}} axisLine={false} tickLine={false} tickFormatter={v=>`${v}%`} domain={[0,55]}/>
            <Tooltip {...tt} formatter={(v,n)=>[v===null?'Not reported':`${v}%`,n]}/>
            <Bar dataKey="nh" name="NH MLP %" fill={C.violet} radius={[3,3,0,0]}/>
            <Bar dataKey="de" name="Delaware %" fill="transparent" stroke={C.green} strokeWidth={2} strokeDasharray="4 3" radius={[3,3,0,0]}/>
          </BarChart>
        </ResponsiveContainer>
        <div style={{ marginTop:10, fontSize:11, color:C.text3 }}>NH data: live from your case log. Delaware data: Mapp et al. (2022), Journal of Public Health Management and Practice. Delaware did not report separate figures for legal status or education/employment.</div>
      </ChartCard>

      {/* Stability comparison */}
      <div style={{ marginBottom:16 }}>
        <div style={{ fontSize:13, fontWeight:500, marginBottom:4 }}>Funding stability - NH in national context</div>
        <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:C.text3, marginBottom:16 }}>Based on funding model benchmarks. The target path: grant-dependent to mixed to mature/diversified.</div>

        {['Grant-dependent','Mixed/sustainable','Mature/diversified'].map(tier => (
          <div key={tier} style={{ marginBottom:20 }}>
            <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:C.text3, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:10, borderBottom:`1px solid ${C.border}`, paddingBottom:6 }}>{tier}</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:10 }}>
              {STABILITY.filter(s=>s.tier===tier).map(s => (
                <div key={s.name} style={{ background:C.surface, border:`1px solid ${s.name.includes('you are')?C.violet:C.border}`, borderRadius:10, padding:16 }}>
                  <div style={{ fontSize:12, fontWeight:s.name.includes('you are')?600:400, color:s.name.includes('you are')?C.violet:C.text, marginBottom:2 }}>{s.name}</div>
                  <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:C.text3, marginBottom:10 }}>{s.model}</div>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <div style={{ flex:1, height:6, background:C.bg2, borderRadius:3, overflow:'hidden' }}>
                      <div style={{ width:`${s.risk*100}%`, height:'100%', background:s.color, borderRadius:3, transition:'width 0.6s' }}/>
                    </div>
                    <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:s.color, flexShrink:0 }}>
                      {s.risk>=0.85?'Very high':s.risk>=0.65?'High':s.risk>=0.4?'Medium':s.risk>=0.2?'Low-med':'Low'} risk
                    </div>
                  </div>
                </div>
              ))}
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
