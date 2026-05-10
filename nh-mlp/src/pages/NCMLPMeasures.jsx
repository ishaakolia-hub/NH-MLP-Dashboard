import { useState } from 'react'
import { useApp } from '../App'
import { C, Page, Grid4, Grid2, StatCard, ChartCard, InfoBox, FAVORABLE } from '../components/ui'

export default function NCMLPMeasures() {
  const { cases } = useApp()
  const [m1staff, setM1staff] = useState({trained:3,total:8})
  const [m2screen, setM2screen] = useState({screened:210,seen:238})

  const favorable = cases.filter(c=>FAVORABLE.has(c.outcome)).length
  const withBenefit = cases.filter(c=>c.financialBenefit==='yes'&&FAVORABLE.has(c.outcome))
  const totalAnnual = withBenefit.reduce((s,c)=>(parseFloat(c.benefitLump)||0)+(parseFloat(c.benefitMonthly)||0)*12+s, 0)
  const avgBenefit = withBenefit.length ? Math.round(totalAnnual/withBenefit.length) : 0

  const CATS = ['Personal & family','Housing & utilities','Income & insurance','Legal status','Education & employment']
  const cat5 = CATS.map(cat => ({
    cat, n: cases.filter(c=>c.category===cat).length,
    pct: cases.length ? Math.round(cases.filter(c=>c.category===cat).length/cases.length*100) : 0
  }))

  const inp = { padding:'6px 10px', border:`1px solid ${C.border}`, borderRadius:6, background:C.bg, fontFamily:"'DM Mono',monospace", fontSize:12, color:C.text, width:70, outline:'none' }

  const MeasureCard = ({ num, title, value, formula, children, note }) => (
    <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:20, marginBottom:16 }}>
      <div style={{ display:'flex', alignItems:'flex-start', gap:16, marginBottom:14 }}>
        <div style={{ background:C.violetPale, color:C.violet, borderRadius:8, padding:'6px 12px', fontFamily:"'DM Mono',monospace", fontSize:12, fontWeight:600, flexShrink:0 }}>M{num}</div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:13, fontWeight:500, marginBottom:3 }}>{title}</div>
          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:C.text3, lineHeight:1.5 }}>{formula}</div>
        </div>
        <div style={{ textAlign:'right' }}>
          <div style={{ fontFamily:"'Instrument Serif',serif", fontSize:28, fontStyle:'italic', color:C.violet }}>{value}</div>
        </div>
      </div>
      {children}
      {note && <div style={{ marginTop:12, padding:'8px 12px', background:C.bg, borderRadius:7, fontSize:11, color:C.text2, lineHeight:1.5 }}>{note}</div>}
    </div>
  )

  return (
    <Page>
      <InfoBox>
        The NCMLP Performance Measures Handbook (2016) defines 7 standard measures all MLPs should track. Holly specifically referenced this handbook. These measures let NH MLP benchmark against national standards and make the case to funders using established methodology.
      </InfoBox>

      <MeasureCard num={1} title="Percent of healthcare partner staff trained in MLP"
        formula="Staff trained in MLP in past 24 months / Total healthcare partner staff"
        value={m1staff.total ? `${Math.round(m1staff.trained/m1staff.total*100)}%` : '-'}>
        <div style={{ display:'flex', gap:12, alignItems:'center' }}>
          <span style={{ fontSize:12, color:C.text2 }}>Staff trained:</span>
          <input style={inp} type="number" value={m1staff.trained} onChange={e=>setM1staff(s=>({...s,trained:parseInt(e.target.value)||0}))} />
          <span style={{ fontSize:12, color:C.text2 }}>Total staff:</span>
          <input style={inp} type="number" value={m1staff.total} onChange={e=>setM1staff(s=>({...s,total:parseInt(e.target.value)||0}))} />
          <div style={{ marginLeft:8, height:8, flex:1, background:C.bg2, borderRadius:4 }}>
            <div style={{ width:`${m1staff.total?Math.min(m1staff.trained/m1staff.total*100,100):0}%`, height:'100%', background:C.violet, borderRadius:4, transition:'width 0.4s' }}/>
          </div>
        </div>
        <div style={{ marginTop:10, fontSize:11, color:C.text3 }}>Enter your current staff numbers above. The NCMLP definition: any formal meeting where legal partner staff speaks to healthcare partner staff about health-harming legal needs, MLP processes, or referral procedures.</div>
      </MeasureCard>

      <MeasureCard num={2} title="Percent of patients screened for health-harming legal needs"
        formula="Patients screened for HHLN in past month / Total patients seen at healthcare partner"
        value={m2screen.seen ? `${Math.round(m2screen.screened/m2screen.seen*100)}%` : '-'}>
        <div style={{ display:'flex', gap:12, alignItems:'center' }}>
          <span style={{ fontSize:12, color:C.text2 }}>Screened:</span>
          <input style={inp} type="number" value={m2screen.screened} onChange={e=>setM2screen(s=>({...s,screened:parseInt(e.target.value)||0}))} />
          <span style={{ fontSize:12, color:C.text2 }}>Total seen:</span>
          <input style={inp} type="number" value={m2screen.seen} onChange={e=>setM2screen(s=>({...s,seen:parseInt(e.target.value)||0}))} />
          <div style={{ marginLeft:8, height:8, flex:1, background:C.bg2, borderRadius:4 }}>
            <div style={{ width:`${m2screen.seen?Math.min(m2screen.screened/m2screen.seen*100,100):0}%`, height:'100%', background:C.green, borderRadius:4, transition:'width 0.4s' }}/>
          </div>
        </div>
      </MeasureCard>

      <MeasureCard num={3} title="Percent of patients with a legal need addressed by the healthcare org"
        formula="Patients with HHLN addressed / Patients screened with at least one HHLN"
        value={`${cases.length?Math.round(favorable/cases.length*100):0}%`}
        note="Using favorable case outcomes as proxy for 'addressed'. NCMLP definition includes referral to legal partner, social worker, or any MLP intervention.">
        <div style={{ fontSize:12, color:C.text2 }}>Based on your case data: {favorable} favorable outcomes out of {cases.length} total cases. This is calculated automatically from your logged cases.</div>
      </MeasureCard>

      <MeasureCard num={4} title="Percent of patients referred who received a legal screening"
        formula="Patients given legal screening by legal partner staff / Patients referred to civil legal aid"
        value={`${m2screen.screened?Math.round(cases.length/m2screen.screened*100):0}%`}
        note="Using total logged cases as proxy for cases that received a legal screening. NCMLP: 'legal screening' includes phone call, online questionnaire, or in-person meeting with a legal partner staff member.">
        <div style={{ fontSize:12, color:C.text2 }}>{cases.length} cases opened (received legal screening) from {m2screen.screened} patients screened.</div>
      </MeasureCard>

      <MeasureCard num={5} title="Percent of total MLP clients with health-harming legal needs in each iHELP category"
        formula="Clients in each iHELP category / Total MLP clients with at least one HHLN"
        value="See below"
        note="NCMLP note: this measure is for informational purposes rather than performance improvement. Clients with needs in multiple categories are counted in each.">
        <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:10, marginTop:8 }}>
          {cat5.map(({cat,n,pct}) => (
            <div key={cat} style={{ textAlign:'center', padding:'10px 6px', background:C.bg, borderRadius:8 }}>
              <div style={{ fontFamily:"'Instrument Serif',serif", fontSize:22, fontStyle:'italic', color:C.violet }}>{pct}%</div>
              <div style={{ fontSize:11, color:C.text2, marginTop:2, lineHeight:1.3 }}>{cat}</div>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:C.text3, marginTop:2 }}>n={n}</div>
            </div>
          ))}
        </div>
      </MeasureCard>

      <MeasureCard num={6} title="Average financial benefit received by a MLP client (ROI measure)"
        formula="Total financial benefits returned to clients / Number of clients with at least one closed case"
        value={avgBenefit ? `$${avgBenefit.toLocaleString()}` : '-'}
        note="NCMLP formula: sum of (lump sum + monthly benefit x 12) across all clients with closed cases. National average: ~$23,000 per client. This is your strongest funder argument - demonstrable financial return to vulnerable clients. Go to Financial Impact page for the full breakdown.">
        <div style={{ display:'flex', gap:20, alignItems:'center' }}>
          <div style={{ textAlign:'center', padding:'10px 16px', background:C.bg, borderRadius:8 }}>
            <div style={{ fontFamily:"'Instrument Serif',serif", fontSize:20, fontStyle:'italic', color:C.green }}>{withBenefit.length}</div>
            <div style={{ fontSize:11, color:C.text2 }}>clients with benefit</div>
          </div>
          <div style={{ textAlign:'center', padding:'10px 16px', background:C.bg, borderRadius:8 }}>
            <div style={{ fontFamily:"'Instrument Serif',serif", fontSize:20, fontStyle:'italic', color:C.green }}>${Math.round(totalAnnual).toLocaleString()}</div>
            <div style={{ fontSize:11, color:C.text2 }}>total annual value</div>
          </div>
          <div style={{ textAlign:'center', padding:'10px 16px', background:C.bg, borderRadius:8 }}>
            <div style={{ fontFamily:"'Instrument Serif',serif", fontSize:20, fontStyle:'italic', color:C.amber }}>$23,000</div>
            <div style={{ fontSize:11, color:C.text2 }}>national MLP average</div>
          </div>
        </div>
      </MeasureCard>

      <MeasureCard num={7} title="Estimated financial benefit to the MLP healthcare partner (hospital ROI)"
        formula="Total charges x hospital cost-to-charge ratio (0.265 national proxy) + other dollars"
        value="Not yet tracked"
        note="NCMLP: uses hospital Medicaid/Medicare cost-to-charge ratio. The Illinois Southern Rural MLP demonstrated $8.1M in medical debt relieved as its ROI argument, which led to hospital self-funding. If the NH MLP partner hospitals track charity care charges for MLP clients, this measure could be calculated. Formula: total charges x 0.265 (2011 CMS proxy rate).">
        <div style={{ fontSize:12, color:C.text2 }}>This measure requires hospital billing data from the healthcare partner. Recommend asking Dartmouth Health or DHMC to track Medicaid charges for MLP-referred clients. Even a rough estimate using the 0.265 proxy would strengthen the funder case significantly.</div>
      </MeasureCard>
    </Page>
  )
}
