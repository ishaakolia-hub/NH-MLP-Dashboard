import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis } from 'recharts'
import { useApp } from '../App'
import { C, Page, Grid4, Grid2, Grid3, StatCard, ChartCard, InfoBox } from '../components/ui'

const COUNTIES = ['Sullivan','Grafton','Merrimack','Other']
const COLORS = { Sullivan:'#6B63D4', Grafton:'#1D9E75', Merrimack:'#888780', Other:'#D85A30' }
const CATS = ['Personal & family','Housing & utilities','Income & insurance','Legal status','Education & employment']

export default function Geography() {
  const { cases } = useApp()

  const tt = { contentStyle:{background:C.surface,border:`1px solid ${C.border}`,borderRadius:7,fontSize:12} }

  // County totals
  const countyCounts = COUNTIES.map(co => ({ county:co, count:cases.filter(c=>c.county===co).length }))

  // DV by county
  const dvByCounty = COUNTIES.map(co => {
    const cc = cases.filter(c=>c.county===co)
    return {
      county: co,
      total: cc.length,
      dv: cc.filter(c=>c.dv==='yes').length,
      dvPct: cc.length ? Math.round(cc.filter(c=>c.dv==='yes').length/cc.length*100) : 0
    }
  })

  // Housing by county
  const housingByCounty = COUNTIES.map(co => ({
    county: co,
    housing: cases.filter(c=>c.county===co&&c.category==='Housing & utilities').length,
    income: cases.filter(c=>c.county===co&&c.category==='Income & insurance').length,
    family: cases.filter(c=>c.county===co&&c.category==='Personal & family').length,
  }))

  // Radar - county profile
  const radarData = CATS.map(cat => {
    const entry = { cat: cat.split(' ')[0] }
    COUNTIES.forEach(co => {
      const total = cases.filter(c=>c.county===co).length||1
      entry[co] = Math.round(cases.filter(c=>c.county===co&&c.category===cat).length/total*100)
    })
    return entry
  })

  // Outcomes by county
  const outcomeByCounty = COUNTIES.map(co => {
    const cc = cases.filter(c=>c.county===co)
    const fav = cc.filter(c=>['Issue resolved','Settlement','Trial decision'].includes(c.outcome)).length
    return { county:co, total:cc.length, favorable:fav, pct:cc.length?Math.round(fav/cc.length*100):0 }
  })

  // Disability by county
  const disabilityByCounty = COUNTIES.map(co => {
    const cc = cases.filter(c=>c.county===co)
    return { county:co, disabled:cc.filter(c=>c.disability==='yes').length, pct:cc.length?Math.round(cc.filter(c=>c.disability==='yes').length/cc.length*100):0 }
  })

  return (
    <Page>
      <InfoBox>
        Holly suggested running comparisons by location to see different impact patterns. This page compares DV rates, housing issues, income cases, and disability across Sullivan, Grafton, and Merrimack counties. Sullivan County is the primary service area (~75% of cases).
      </InfoBox>

      <Grid4>
        <StatCard label="Sullivan County" value={`${cases.length?Math.round(cases.filter(c=>c.county==='Sullivan').length/cases.length*100):0}%`} sub={`${cases.filter(c=>c.county==='Sullivan').length} cases`} color={C.violet} />
        <StatCard label="Grafton County" value={`${cases.length?Math.round(cases.filter(c=>c.county==='Grafton').length/cases.length*100):0}%`} sub={`${cases.filter(c=>c.county==='Grafton').length} cases`} color={C.green} />
        <StatCard label="Merrimack County" value={`${cases.length?Math.round(cases.filter(c=>c.county==='Merrimack').length/cases.length*100):0}%`} sub={`${cases.filter(c=>c.county==='Merrimack').length} cases`} color={C.slate} />
        <StatCard label="Highest DV rate" value={dvByCounty.sort((a,b)=>b.dvPct-a.dvPct)[0]?.county||'-'} sub={`${dvByCounty.sort((a,b)=>b.dvPct-a.dvPct)[0]?.dvPct||0}% DV-flagged cases`} color={C.red} />
      </Grid4>

      <Grid2>
        <ChartCard title="DV rate by county" sub="Percentage of cases in each county flagged as DV survivors - shows geographic concentration of domestic violence cases">
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={dvByCounty}>
              <XAxis dataKey="county" tick={{fontSize:12,fill:C.text3}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:10,fill:C.text3}} axisLine={false} tickLine={false} tickFormatter={v=>`${v}%`}/>
              <Tooltip {...tt} formatter={v=>[`${v}%`,'DV rate']}/>
              <Bar dataKey="dvPct" name="DV rate %" radius={[4,4,0,0]}>
                {dvByCounty.map((e,i)=><Cell key={i} fill={COLORS[e.county]||C.slate}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div style={{ marginTop:10 }}>
            {dvByCounty.map(co => (
              <div key={co.county} style={{ display:'flex', justifyContent:'space-between', padding:'4px 0', borderBottom:`1px solid ${C.border}`, fontSize:12 }}>
                <span style={{ color:C.text2 }}>{co.county}</span>
                <span style={{ fontFamily:"'DM Mono',monospace", fontSize:11 }}>{co.dv} DV cases out of {co.total} total ({co.dvPct}%)</span>
              </div>
            ))}
          </div>
        </ChartCard>
        <ChartCard title="Issue types by county" sub="Housing, income, and family cases distributed across counties">
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={housingByCounty}>
              <XAxis dataKey="county" tick={{fontSize:12,fill:C.text3}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:10,fill:C.text3}} axisLine={false} tickLine={false}/>
              <Tooltip {...tt}/>
              <Bar dataKey="housing" name="Housing" fill={C.green} stackId="a"/>
              <Bar dataKey="income" name="Income" fill={C.blue} stackId="a"/>
              <Bar dataKey="family" name="Family" fill={C.violet} stackId="a" radius={[4,4,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display:'flex', gap:12, marginTop:10 }}>
            {[['#1D9E75','Housing'],['#378ADD','Income'],['#6B63D4','Family']].map(([col,lbl])=>(
              <div key={lbl} style={{ display:'flex', alignItems:'center', gap:5, fontSize:11, color:C.text2 }}>
                <span style={{ width:8, height:8, borderRadius:2, background:col, display:'inline-block' }}></span>{lbl}
              </div>
            ))}
          </div>
        </ChartCard>
      </Grid2>

      <Grid2>
        <ChartCard title="Outcome rate by county" sub="Percentage of cases in each county with a favorable outcome (resolved, settled, or trial decision)">
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={outcomeByCounty}>
              <XAxis dataKey="county" tick={{fontSize:12,fill:C.text3}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:10,fill:C.text3}} axisLine={false} tickLine={false} tickFormatter={v=>`${v}%`}/>
              <Tooltip {...tt} formatter={v=>[`${v}%`,'Favorable outcome rate']}/>
              <Bar dataKey="pct" name="Favorable %" fill={C.green} radius={[4,4,0,0]}>
                {outcomeByCounty.map((e,i)=><Cell key={i} fill={e.pct>=50?C.green:C.amber}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Disability rate by county" sub="Percentage of clients in each county with a reported disability - relevant for equity analysis">
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={disabilityByCounty}>
              <XAxis dataKey="county" tick={{fontSize:12,fill:C.text3}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:10,fill:C.text3}} axisLine={false} tickLine={false} tickFormatter={v=>`${v}%`}/>
              <Tooltip {...tt} formatter={v=>[`${v}%`,'Disability rate']}/>
              <Bar dataKey="pct" name="Disability %" fill={C.amber} radius={[4,4,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </Grid2>

      {/* County comparison table */}
      <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:20 }}>
        <div style={{ fontSize:13, fontWeight:500, marginBottom:14 }}>Full county comparison</div>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
          <thead><tr style={{ borderBottom:`2px solid ${C.border}` }}>
            {['County','Total Cases','DV Cases','DV Rate','Disabled Clients','Housing Cases','Income Cases','Family Cases','Favorable Outcomes','Success Rate'].map(h=>(
              <th key={h} style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:C.text3, textTransform:'uppercase', letterSpacing:'0.05em', padding:'8px 12px', textAlign:'left', whiteSpace:'nowrap' }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {COUNTIES.map(co => {
              const cc = cases.filter(c=>c.county===co)
              const fav = cc.filter(c=>['Issue resolved','Settlement','Trial decision'].includes(c.outcome)).length
              return (
                <tr key={co} style={{ borderBottom:`1px solid ${C.border}` }}>
                  <td style={{ padding:'9px 12px', fontWeight:500, color:COLORS[co] }}>{co}</td>
                  <td style={{ padding:'9px 12px', fontFamily:"'DM Mono',monospace" }}>{cc.length}</td>
                  <td style={{ padding:'9px 12px', fontFamily:"'DM Mono',monospace" }}>{cc.filter(c=>c.dv==='yes').length}</td>
                  <td style={{ padding:'9px 12px', fontFamily:"'DM Mono',monospace", color:C.red }}>{cc.length?Math.round(cc.filter(c=>c.dv==='yes').length/cc.length*100):0}%</td>
                  <td style={{ padding:'9px 12px', fontFamily:"'DM Mono',monospace" }}>{cc.filter(c=>c.disability==='yes').length}</td>
                  <td style={{ padding:'9px 12px', fontFamily:"'DM Mono',monospace" }}>{cc.filter(c=>c.category==='Housing & utilities').length}</td>
                  <td style={{ padding:'9px 12px', fontFamily:"'DM Mono',monospace" }}>{cc.filter(c=>c.category==='Income & insurance').length}</td>
                  <td style={{ padding:'9px 12px', fontFamily:"'DM Mono',monospace" }}>{cc.filter(c=>c.category==='Personal & family').length}</td>
                  <td style={{ padding:'9px 12px', fontFamily:"'DM Mono',monospace", color:C.green }}>{fav}</td>
                  <td style={{ padding:'9px 12px', fontFamily:"'DM Mono',monospace", color:fav/cc.length>=0.5?C.green:C.amber }}>{cc.length?Math.round(fav/cc.length*100):0}%</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Page>
  )
}
