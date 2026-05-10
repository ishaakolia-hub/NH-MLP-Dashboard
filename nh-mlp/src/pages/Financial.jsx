import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LineChart, Line, CartesianGrid } from 'recharts'
import { useApp } from '../App'
import { C, Page, Grid4, Grid2, Grid3, StatCard, ChartCard, InfoBox, FAVORABLE } from '../components/ui'

const BENEFIT_COLORS = { SSI:'#6B63D4', SSD:'#AFA9EC', SNAP:'#1D9E75', Medicaid:'#378ADD', Medicare:'#4A9FE0', TANF:'#BA7517', LIHEAP:'#D85A30', 'Child support':'#E24B4A', 'VA benefits':'#639922', 'Housing subsidies':'#97C459', Unemployment:'#888780', Other:'#B4B2A9' }

export default function Financial() {
  const { cases } = useApp()

  const withBenefit = cases.filter(c => c.financialBenefit==='yes' && FAVORABLE.has(c.outcome))
  const totalMonthly = withBenefit.reduce((s,c) => s+(parseFloat(c.benefitMonthly)||0), 0)
  const totalLump = withBenefit.reduce((s,c) => s+(parseFloat(c.benefitLump)||0), 0)
  const annualValue = totalLump + totalMonthly * 12
  const avgPerClient = withBenefit.length ? Math.round(annualValue / withBenefit.length) : 0

  // By type
  const byType = {}
  withBenefit.forEach(c => {
    const t = c.benefitType || 'Other'
    if(!byType[t]) byType[t] = { count:0, monthly:0, lump:0 }
    byType[t].count++
    byType[t].monthly += parseFloat(c.benefitMonthly)||0
    byType[t].lump += parseFloat(c.benefitLump)||0
  })
  const typeData = Object.entries(byType).sort((a,b)=>(b[1].lump+b[1].monthly*12)-(a[1].lump+a[1].monthly*12)).map(([type,d])=>({
    type, count:d.count, annual: Math.round(d.lump+d.monthly*12), monthly: Math.round(d.monthly)
  }))

  // By program
  const progData = ['TLC','Moms','ATP'].map(p => {
    const pc = withBenefit.filter(c=>c.program===p)
    const m = pc.reduce((s,c)=>s+(parseFloat(c.benefitMonthly)||0),0)
    const l = pc.reduce((s,c)=>s+(parseFloat(c.benefitLump)||0),0)
    return { name:p, annual: Math.round(l+m*12), clients: pc.length }
  })

  // By category
  const catData = ['Personal & family','Housing & utilities','Income & insurance','Legal status','Education & employment'].map(cat => {
    const cc = withBenefit.filter(c=>c.category===cat)
    const m = cc.reduce((s,c)=>s+(parseFloat(c.benefitMonthly)||0),0)
    const l = cc.reduce((s,c)=>s+(parseFloat(c.benefitLump)||0),0)
    return { name: cat.split(' ')[0], annual: Math.round(l+m*12) }
  }).filter(d=>d.annual>0)

  const tt = { contentStyle:{background:C.surface,border:`1px solid ${C.border}`,borderRadius:7,fontSize:12}, formatter:(v,n)=>[`$${v.toLocaleString()}`,n] }

  return (
    <Page>
      <InfoBox color="green">
        NCMLP Measure 6: Average financial benefit received by a MLP client. Includes lump sum payments + monthly benefits x 12 months. This is the ROI argument to funders - every dollar invested in MLP legal services returns measurable financial benefit to clients.
      </InfoBox>

      <Grid4>
        <StatCard label="Cases with financial benefit" value={withBenefit.length} sub={`of ${cases.filter(c=>FAVORABLE.has(c.outcome)).length} resolved cases`} />
        <StatCard label="Total annual value" value={`$${Math.round(annualValue/1000)}k`} sub="lump sum + monthly x 12" color={C.green} />
        <StatCard label="Monthly benefits ongoing" value={`$${Math.round(totalMonthly).toLocaleString()}`} sub="per month across all clients" color={C.violet} />
        <StatCard label="Avg benefit per client" value={`$${avgPerClient.toLocaleString()}`} sub="annual value (NCMLP Measure 6)" color={C.amber} />
      </Grid4>

      <Grid2>
        <ChartCard title="Annual financial benefit by type" sub="Total value (lump sum + monthly x 12) for each benefit category">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={typeData} layout="vertical">
              <XAxis type="number" tick={{fontSize:10,fill:C.text3}} axisLine={false} tickLine={false} tickFormatter={v=>`$${(v/1000).toFixed(0)}k`}/>
              <YAxis dataKey="type" type="category" tick={{fontSize:11,fill:C.text3}} axisLine={false} tickLine={false} width={100}/>
              <Tooltip {...tt}/>
              <Bar dataKey="annual" name="Annual value" radius={[0,3,3,0]}>
                {typeData.map((e,i)=><Cell key={i} fill={BENEFIT_COLORS[e.type]||C.slate}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Financial benefit by program" sub="Which program returns most financial value to clients">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={progData}>
              <XAxis dataKey="name" tick={{fontSize:12,fill:C.text3}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:10,fill:C.text3}} axisLine={false} tickLine={false} tickFormatter={v=>`$${(v/1000).toFixed(0)}k`}/>
              <Tooltip {...tt}/>
              <Bar dataKey="annual" name="Annual value" fill={C.violet} radius={[4,4,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
          <div style={{ marginTop:10 }}>
            {progData.map(p => (
              <div key={p.name} style={{ display:'flex', justifyContent:'space-between', padding:'4px 0', borderBottom:`1px solid ${C.border}`, fontSize:12 }}>
                <span style={{ color:C.text2 }}>{p.name}</span>
                <span style={{ fontFamily:"'DM Mono',monospace", fontSize:11 }}>{p.clients} clients - ${p.annual.toLocaleString()}/yr</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </Grid2>

      <ChartCard title="Financial benefit by iHELP category" sub="Income & insurance cases return the most direct financial benefit - primarily SSI, SNAP, Medicaid reinstatement" full style={{marginBottom:16}}>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={catData}>
            <XAxis dataKey="name" tick={{fontSize:12,fill:C.text3}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fontSize:10,fill:C.text3}} axisLine={false} tickLine={false} tickFormatter={v=>`$${(v/1000).toFixed(0)}k`}/>
            <Tooltip {...tt}/>
            <Bar dataKey="annual" name="Annual value" fill={C.green} radius={[4,4,0,0]}/>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Benefit table */}
      <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:20 }}>
        <div style={{ fontSize:13, fontWeight:500, marginBottom:14 }}>Individual cases with financial benefit (NCMLP Measure 6 breakdown)</div>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
            <thead><tr style={{ borderBottom:`2px solid ${C.border}` }}>
              {['Client','Program','Category','Issue','Benefit Type','Monthly ($)','Lump Sum ($)','Annual Value','Outcome'].map(h=>(
                <th key={h} style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:C.text3, textTransform:'uppercase', letterSpacing:'0.06em', padding:'8px 12px', textAlign:'left', whiteSpace:'nowrap' }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {withBenefit.slice(0,30).map(c => {
                const ann = (parseFloat(c.benefitLump)||0) + (parseFloat(c.benefitMonthly)||0)*12
                return (
                  <tr key={c.id} style={{ borderBottom:`1px solid ${C.border}` }}>
                    <td style={{ padding:'8px 12px', fontFamily:"'DM Mono',monospace", fontSize:11, color:C.text3 }}>{c.client}</td>
                    <td style={{ padding:'8px 12px', fontSize:12 }}>{c.program}</td>
                    <td style={{ padding:'8px 12px', fontSize:11 }}>{c.category}</td>
                    <td style={{ padding:'8px 12px', fontSize:11 }}>{c.issue}</td>
                    <td style={{ padding:'8px 12px', fontSize:11, color:BENEFIT_COLORS[c.benefitType]||C.text2, fontWeight:500 }}>{c.benefitType||'-'}</td>
                    <td style={{ padding:'8px 12px', fontFamily:"'DM Mono',monospace", fontSize:11 }}>{c.benefitMonthly?`$${parseFloat(c.benefitMonthly).toLocaleString()}`:'-'}</td>
                    <td style={{ padding:'8px 12px', fontFamily:"'DM Mono',monospace", fontSize:11 }}>{c.benefitLump?`$${parseFloat(c.benefitLump).toLocaleString()}`:'-'}</td>
                    <td style={{ padding:'8px 12px', fontFamily:"'DM Mono',monospace", fontSize:11, fontWeight:500, color:C.green }}>${ann.toLocaleString()}</td>
                    <td style={{ padding:'8px 12px', fontSize:11, color:C.green }}>{c.outcome}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop:12, padding:'10px 14px', background:'#D4F2E8', borderRadius:8, fontSize:12, color:C.green, lineHeight:1.6 }}>
          NCMLP formula: Total financial benefit = sum of (lump sum + monthly benefit x 12) across all closed cases with favorable outcomes. The national average for MLP programs is ~$23,000 per client. Use this to build the ROI case for continued funding.
        </div>
      </div>
    </Page>
  )
}
