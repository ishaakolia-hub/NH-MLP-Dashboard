import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts'
import { useApp } from '../App'
import { C, Page, Grid4, Grid2, Grid3, StatCard, ChartCard, FAVORABLE, TT_STYLE } from '../components/ui'

export default function Equity() {
  const { cases } = useApp()
  const tt = TT_STYLE

  // Veterans
  const vets = cases.filter(c=>c.veteranStatus==='yes')
  const vetFav = vets.filter(c=>FAVORABLE.has(c.outcome)).length
  const vetBenefitDenial = vets.filter(c=>['Income & insurance','Legal status'].includes(c.category)).length

  // Disability
  const disabled = cases.filter(c=>c.disability==='yes')
  const disFav = disabled.filter(c=>FAVORABLE.has(c.outcome)).length
  const disIncome = disabled.filter(c=>c.category==='Income & insurance').length

  // DV
  const dv = cases.filter(c=>c.dv==='yes')
  const dvFav = dv.filter(c=>FAVORABLE.has(c.outcome)).length
  const dvHousing = dv.filter(c=>c.category==='Housing & utilities').length

  // Disability in income cases - are they disproportionate?
  const incCases = cases.filter(c=>c.category==='Income & insurance')
  const disInIncPct = incCases.length ? Math.round(incCases.filter(c=>c.disability==='yes').length/incCases.length*100) : 0
  const disOverallPct = cases.length ? Math.round(disabled.length/cases.length*100) : 0

  // Veteran in income cases
  const vetInIncPct = incCases.length ? Math.round(incCases.filter(c=>c.veteranStatus==='yes').length/incCases.length*100) : 0
  const vetOverallPct = cases.length ? Math.round(vets.length/cases.length*100) : 0

  // Outcome equity comparison
  const overallFavPct = cases.length ? Math.round(cases.filter(c=>FAVORABLE.has(c.outcome)).length/cases.length*100) : 0
  const equityData = [
    { group:'All clients', pct: overallFavPct, n: cases.length },
    { group:'DV survivors', pct: dv.length?Math.round(dvFav/dv.length*100):0, n: dv.length },
    { group:'Disabled', pct: disabled.length?Math.round(disFav/disabled.length*100):0, n: disabled.length },
    { group:'Veterans', pct: vets.length?Math.round(vetFav/vets.length*100):0, n: vets.length },
  ]

  // DV category breakdown
  const dvCatData = ['Personal & family','Housing & utilities','Income & insurance','Legal status','Education & employment'].map(cat => ({
    name: cat.split(' ')[0],
    dv: dv.filter(c=>c.category===cat).length,
    nonDv: cases.filter(c=>c.dv==='no'&&c.category===cat).length,
  }))

  // Disproportion - are disabled clients disproportionately in benefit denial cases?
  const disproportionData = [
    { label:'Overall disability rate', value: disOverallPct, color: C.violet },
    { label:'Disability rate in income cases', value: disInIncPct, color: C.amber },
    { label:'Overall veteran rate', value: vetOverallPct, color: C.green },
    { label:'Veteran rate in income cases', value: vetInIncPct, color: C.red },
  ]

  return (
    <Page>
      <Grid4>
        <StatCard label="Veteran clients" value={vets.length} sub={`${vetBenefitDenial} in income/legal cases`} color={C.green} />
        <StatCard label="Disabled clients" value={disabled.length} sub={`${disIncome} in income & insurance`} color={C.amber} />
        <StatCard label="DV survivors" value={dv.length} sub={`${dvHousing} have housing cases`} color={C.red} />
        <StatCard label="Intersecting needs" value={cases.filter(c=>c.dv==='yes'&&c.disability==='yes').length} sub="DV + disability overlap" color={C.orange} />
      </Grid4>

      <Grid2>
        <ChartCard title="Favorable outcome rate by population group" sub="Are some groups achieving better outcomes than others? Gaps may signal barriers or priorities.">
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={equityData}>
              <XAxis dataKey="group" tick={{fontSize:11,fill:C.text3}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:10,fill:C.text3}} axisLine={false} tickLine={false} tickFormatter={v=>`${v}%`} domain={[0,100]}/>
              <Tooltip {...tt} formatter={(v,n,p)=>[`${v}% (n=${p.payload.n})`,n]}/>
              <Bar dataKey="pct" name="Favorable outcome %" radius={[4,4,0,0]}>
                {equityData.map((e,i)=><Cell key={i} fill={e.pct>=overallFavPct?C.green:C.amber}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div style={{ marginTop:10, padding:'8px 12px', background:C.bg, borderRadius:7, fontSize:11, color:C.text2 }}>
            Overall success rate: {overallFavPct}%. Groups above this line are doing as well or better. Groups below may face additional barriers.
          </div>
        </ChartCard>
        <ChartCard title="Are disabled/veteran clients disproportionately in benefit denial cases?" sub="Policy implication: if these groups show up more in income cases than overall, it suggests systemic benefit denial patterns.">
          <div style={{ marginTop:8 }}>
            {disproportionData.map(d => (
              <div key={d.label} style={{ marginBottom:14 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4, fontSize:12 }}>
                  <span style={{ color:C.text2 }}>{d.label}</span>
                  <span style={{ fontFamily:"'DM Mono',monospace", fontWeight:500, color:d.color }}>{d.value}%</span>
                </div>
                <div style={{ height:8, background:C.bg2, borderRadius:4, overflow:'hidden' }}>
                  <div style={{ width:`${d.value}%`, height:'100%', background:d.color, borderRadius:4, transition:'width 0.6s' }}/>
                </div>
              </div>
            ))}
            <div style={{ padding:'8px 12px', background:C.bg, borderRadius:7, fontSize:11, color:C.text2 }}>
              If the rate in income cases is higher than the overall rate, these populations are disproportionately experiencing benefit denials - a potential policy advocacy target.
            </div>
          </div>
        </ChartCard>
      </Grid2>

      <Grid2>
        <ChartCard title="DV survivors by legal category" sub="Where DV cases concentrate compared to non-DV cases - DV and housing are closely linked">
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={dvCatData}>
              <XAxis dataKey="name" tick={{fontSize:11,fill:C.text3}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:10,fill:C.text3}} axisLine={false} tickLine={false}/>
              <Tooltip {...tt}/>
              <Bar dataKey="dv" name="DV yes" fill={C.red} stackId="a"/>
              <Bar dataKey="nonDv" name="DV no" fill="#B5D4F4" stackId="a" radius={[3,3,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Disability by legal category" sub="Clients with disabilities appear most in income cases - likely pursuing SSI, SSD, or Medicaid">
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={['Personal & family','Housing & utilities','Income & insurance','Legal status','Education & employment'].map(cat => ({
              name: cat.split(' ')[0],
              disabled: disabled.filter(c=>c.category===cat).length,
              notDisabled: cases.filter(c=>c.disability==='no'&&c.category===cat).length,
            }))}>
              <XAxis dataKey="name" tick={{fontSize:11,fill:C.text3}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:10,fill:C.text3}} axisLine={false} tickLine={false}/>
              <Tooltip {...tt}/>
              <Bar dataKey="disabled" name="Disabled" fill={C.amber} stackId="a"/>
              <Bar dataKey="notDisabled" name="Not disabled" fill={C.greenLight} stackId="a" radius={[3,3,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </Grid2>

      {/* Policy implication box */}
      <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:20 }}>
        <div style={{ fontSize:13, fontWeight:500, marginBottom:10 }}>Policy Implication Findings</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12 }}>
          {[
            { title:'DV + Housing link', body:`${dvHousing} DV cases involve housing issues. DV survivors are disproportionately at risk of eviction and housing instability. This concentration suggests a systemic need for collocated housing-DV services.`, color:C.red },
            { title:'Disability + Benefits gap', body:`${disIncome} clients with disabilities are pursuing income/insurance cases. Disability benefit denial rates are high nationally. If disabled clients here are disproportionately in income cases (${disInIncPct}% vs ${disOverallPct}% overall), there may be a systematic denial issue worth documenting.`, color:C.amber },
            { title:'Veteran benefit access', body:`${vets.length} veteran clients served. ${vetInIncPct}% of income cases involve veterans vs ${vetOverallPct}% overall. Veterans navigating VA benefits, discharge upgrades, and disability claims may face compounding legal barriers that the MLP is uniquely positioned to address.`, color:C.green },
          ].map(({title,body,color}) => (
            <div key={title} style={{ padding:14, background:C.bg, borderRadius:8, borderLeft:`3px solid ${color}` }}>
              <div style={{ fontSize:12, fontWeight:600, color, marginBottom:6 }}>{title}</div>
              <div style={{ fontSize:11, color:C.text2, lineHeight:1.6 }}>{body}</div>
            </div>
          ))}
        </div>
      </div>
    </Page>
  )
}
