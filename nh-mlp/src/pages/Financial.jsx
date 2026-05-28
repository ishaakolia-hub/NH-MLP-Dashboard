import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LineChart, Line, CartesianGrid } from 'recharts'
import { useApp } from '../App'
import { C, Page, Grid4, Grid2, Grid3, StatCard, ChartCard, InfoBox, FAVORABLE, TT_STYLE } from '../components/ui'

const BENEFIT_COLORS = { SSI:'#076B5E', SSD:'#0B8F7E', SNAP:'#2AB8A4', Medicaid:'#44C8B8', Medicare:'#6DD4C8', TANF:'#088070', LIHEAP:'#0A9888', 'Child support':'#2AB0A0', 'VA benefits':'#50C8B8', 'Housing subsidies':'#80D8CE', Unemployment:'#64748B', Other:'#94A3B8' }

export default function Financial() {
  const { cases } = useApp()

  const withBenefit = cases.filter(c => c.financialBenefit==='yes' && FAVORABLE.has(c.outcome))

  // Hardcoded from verified Excel data (all-time, all programs)
  const totalMonthly = 6161    // ongoing monthly benefits across all clients
  const totalLump    = 39623   // total one-time lump sum benefits secured
  const annualValue  = totalLump + totalMonthly * 12   // $113,555
  const TOTAL_CLIENTS = 134
  // NCMLP M6 denominator = all clients with at least one closed case (not just those with benefit)
  const avgPerClient = Math.round(annualValue / TOTAL_CLIENTS)

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

  const tt = { ...TT_STYLE, formatter:(v,n)=>[`$${v.toLocaleString()}`,n] }

  return (
    <Page>
      <InfoBox color="green">
        NCMLP Measure 6: Average financial benefit received by a MLP client. Includes lump sum payments + monthly benefits x 12 months. This is the ROI argument to funders - every dollar invested in MLP legal services returns measurable financial benefit to clients.
      </InfoBox>

      {/* Hero — financial impact module */}
      <div style={{ background:'#FAFBFC', border:'1px solid #DDE3EC', borderRadius:10, marginBottom:10, overflow:'hidden', boxShadow:'0 1px 4px rgba(0,0,0,0.06)' }}>

        {/* Header strip */}
        <div style={{ background:'#F1F5F9', borderBottom:'1px solid #DDE3EC', padding:'7px 20px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, fontWeight:700, color:'#64748B', textTransform:'uppercase', letterSpacing:'0.13em' }}>
            Total Financial Benefit Secured · All Programs · Since Inception
          </span>
          <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, fontWeight:500, color:'#94A3B8', textTransform:'uppercase', letterSpacing:'0.10em' }}>
            NCMLP Measure 6
          </span>
        </div>

        <div style={{ display:'flex', alignItems:'stretch', flexWrap:'wrap' }}>

          {/* LEFT: Primary metric */}
          <div style={{ flex:'0 0 auto', padding:'20px 28px 20px 20px', borderRight:'1px solid #DDE3EC', display:'flex', flexDirection:'column', justifyContent:'center', minWidth:200 }}>
            <div style={{ fontFamily:"'Instrument Serif',serif", fontSize:66, color:C.green, lineHeight:1, letterSpacing:'-0.02em' }}>
              $414,360
            </div>
            <div style={{ marginTop:8, fontSize:11, color:'#64748B', lineHeight:1.55 }}>
              cumulative · TLC + Moms + ATP<br/>FY23–24 through FY25–26 YTD
            </div>
          </div>

          {/* RIGHT: Formula + program table */}
          <div style={{ flex:'1 1 280px', padding:'16px 20px', display:'flex', flexDirection:'column', gap:12 }}>

            {/* Formula row */}
            <div style={{ display:'flex', alignItems:'center', flexWrap:'wrap', gap:6, padding:'9px 14px', background:'rgba(39,103,73,0.05)', border:'1px solid rgba(39,103,73,0.13)', borderRadius:7 }}>
              <span style={{ fontFamily:"'DM Mono',monospace", fontSize:8, fontWeight:700, color:'#64748B', textTransform:'uppercase', letterSpacing:'0.13em', marginRight:4 }}>Avg / client (M6)</span>
              <span style={{ fontFamily:"'DM Mono',monospace", fontSize:13, color:C.green, fontWeight:500 }}>$414,360</span>
              <span style={{ fontSize:12, color:'#94A3B8', fontWeight:300 }}>÷</span>
              <span style={{ fontFamily:"'DM Mono',monospace", fontSize:13, color:'#64748B' }}>50 clients</span>
              <span style={{ fontSize:12, color:'#94A3B8', fontWeight:300 }}>=</span>
              <span style={{ fontFamily:"'Instrument Serif',serif", fontSize:22, color:C.amber, lineHeight:1 }}>$8,287</span>
              <span style={{ fontSize:10, color:'#94A3B8' }}>avg benefit per client</span>
            </div>

            {/* Program breakdown table */}
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr style={{ borderBottom:'1.5px solid #E2E8F0' }}>
                  {['Program','Total Benefit','Clients','Avg / Client'].map((h,i) => (
                    <th key={h} style={{ fontFamily:"'DM Mono',monospace", fontSize:8, fontWeight:700, color:'#94A3B8', textTransform:'uppercase', letterSpacing:'0.12em', padding:'0 0 6px', textAlign: i===0 ? 'left' : 'right', whiteSpace:'nowrap' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { program:'TLC',  color:C.blue1,  total:79200,  clients:15 },
                  { program:'Moms', color:C.purple, total:335160, clients:35 },
                  { program:'ATP',  color:'#94A3B8', total:0,     clients:0  },
                ].map(({ program, color, total, clients }) => {
                  const avg = clients > 0 ? Math.round(total / clients) : null
                  return (
                    <tr key={program} style={{ borderBottom:'1px solid #F1F5F9' }}>
                      <td style={{ padding:'5px 0', fontFamily:"'DM Mono',monospace", fontSize:11, fontWeight:600, color, textTransform:'uppercase', letterSpacing:'0.07em' }}>{program}</td>
                      <td style={{ padding:'5px 0', textAlign:'right', fontFamily:"'DM Mono',monospace", fontSize:12, color: total ? C.green : '#CBD5E0', fontWeight: total ? 500 : 400 }}>
                        {total ? `$${total.toLocaleString()}` : '—'}
                      </td>
                      <td style={{ padding:'5px 0', textAlign:'right', fontFamily:"'DM Mono',monospace", fontSize:12, color:'#64748B' }}>{clients}</td>
                      <td style={{ padding:'5px 0', textAlign:'right', fontFamily:"'DM Mono',monospace", fontSize:12, color: avg ? C.amber : '#CBD5E0', fontWeight: avg ? 500 : 400 }}>
                        {avg ? `$${avg.toLocaleString()}` : '—'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
              <tfoot>
                <tr style={{ borderTop:'1.5px solid #E2E8F0' }}>
                  <td style={{ padding:'6px 0 2px', fontFamily:"'DM Mono',monospace", fontSize:10, fontWeight:700, color:C.text2, textTransform:'uppercase', letterSpacing:'0.07em' }}>All</td>
                  <td style={{ padding:'6px 0 2px', textAlign:'right', fontFamily:"'DM Mono',monospace", fontSize:12, color:C.green, fontWeight:600 }}>$414,360</td>
                  <td style={{ padding:'6px 0 2px', textAlign:'right', fontFamily:"'DM Mono',monospace", fontSize:12, color:C.text2, fontWeight:600 }}>50</td>
                  <td style={{ padding:'6px 0 2px', textAlign:'right', fontFamily:"'DM Mono',monospace", fontSize:12, color:C.amber, fontWeight:600 }}>$8,287</td>
                </tr>
              </tfoot>
            </table>

          </div>
        </div>
      </div>

      <Grid4>
        <StatCard label="Cases with financial benefit" value={withBenefit.length} sub="of 185 resolved cases with favorable outcome" />
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
        <div style={{ marginTop:12, padding:'10px 14px', background:C.greenLight, borderRadius:8, fontSize:12, color:C.green, lineHeight:1.6 }}>
          NCMLP formula: Total financial benefit = sum of (lump sum + monthly benefit x 12) across all closed cases with favorable outcomes. The national average for MLP programs is ~$23,000 per client. Use this to build the ROI case for continued funding.
        </div>
      </div>
    </Page>
  )
}
