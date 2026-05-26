import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { useApp } from '../App'
import { C, Page, Grid4, Grid2, Grid3, StatCard, ChartCard, CATS, CAT_COLORS, PROG_COLORS, COUNTY_COLORS, FAVORABLE } from '../components/ui'

const OUTCOME_COLORS = { 'Issue resolved':'#639922','Settlement':'#97C459','Trial decision':'#1D9E75','Withdrew':'#888780','Unbundled service':'#B4B2A9','Closed/other':'#E24B4A','Pending':'#BA7517' }

export default function Dashboard() {
  const { cases } = useApp()

  // All numbers hardcoded from verified Excel data (all-time, all programs)
  const totalCases   = 238   // ATP:2, Moms:80, TLC:156
  const uniqueClients= 134   // unduplicated 1st-time clients
  const dvCount      = 52    // DV survivors across 134 clients (39%)
  const favorable    = 185   // ~78% favorable outcome rate
  const growthData = [
    { year: 'CY2023', cases: 15 },
    { year: 'CY2024', cases: 121 },
    { year: 'CY2025', cases: 27 },
    { year: 'CY2026', cases: 10 },
  ]

  // Category donut
  const catCounts = {}
  CATS.forEach(c=>catCounts[c]=0)
  cases.forEach(c=>{if(catCounts[c.category]!==undefined)catCounts[c.category]++})
  const catData = Object.entries(catCounts).map(([name,value])=>({name,value}))

  // DV by category
  const dvByCat = CATS.map(cat => ({
    cat: cat.split(' ')[0],
    yes: cases.filter(c=>c.category===cat&&c.dv==='yes').length,
    no: cases.filter(c=>c.category===cat&&c.dv==='no').length,
  }))

  // Disability by category
  const disByCat = CATS.map(cat => ({
    cat: cat.split(' ')[0],
    yes: cases.filter(c=>c.category===cat&&c.disability==='yes').length,
    no: cases.filter(c=>c.category===cat&&c.disability==='no').length,
  }))

  // Programs
  const progData = ['TLC','Moms','ATP'].map(p=>({name:p,cases:cases.filter(c=>c.program===p).length}))

  // Outcomes
  const outCounts = {}
  cases.forEach(c=>{outCounts[c.outcome]=(outCounts[c.outcome]||0)+1})
  const outData = Object.entries(outCounts).map(([name,value])=>({name,value}))

  // Counties
  const countyData = ['Sullivan','Grafton','Merrimack','Other'].map(co=>({name:co,value:cases.filter(c=>c.county===co).length}))

  // Top issues
  const issueCounts = {}
  cases.forEach(c=>{if(c.issue)issueCounts[c.issue]=(issueCounts[c.issue]||0)+1})
  const topIssues = Object.entries(issueCounts).sort((a,b)=>b[1]-a[1]).slice(0,10).map(([name,count])=>({name,count}))

  const tt = { contentStyle:{background:C.surface,border:`1px solid ${C.border}`,borderRadius:7,fontSize:12} }

  return (
    <Page>
      <Grid4>
        <StatCard label="Total Cases" value={totalCases} sub="total legal matters recorded · TLC / Moms / ATP" />
        <StatCard label="Unique Clients" value={uniqueClients} sub="unduplicated individuals served" />
        <StatCard label="DV Survivors" value="39%" sub={`${dvCount} of ${uniqueClients} clients flagged`} color={C.red} />
        <StatCard label="Favorable Outcomes" value="78%" sub={`${favorable} of ${totalCases} resolved favorably`} color={C.green} />
      </Grid4>

      <Grid2>
        <ChartCard title="Case Growth by Year" sub="Calendar year · all programs combined">
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={growthData}><XAxis dataKey="year" tick={{fontSize:11,fill:C.text3}} axisLine={false} tickLine={false}/><YAxis tick={{fontSize:11,fill:C.text3}} axisLine={false} tickLine={false}/><Tooltip {...tt}/><Bar dataKey="cases" fill={C.violet} radius={[3,3,0,0]}/></BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Cases by iHELP Category">
          <ResponsiveContainer width="100%" height={150}>
            <PieChart><Pie data={catData} cx="50%" cy="48%" innerRadius={42} outerRadius={68} dataKey="value" paddingAngle={2}>
              {catData.map((e,i)=><Cell key={i} fill={CAT_COLORS[e.name]||C.slate}/>)}
            </Pie><Tooltip {...tt} formatter={(v,n)=>[v,n]}/></PieChart>
          </ResponsiveContainer>
          <div style={{display:'flex',flexWrap:'wrap',gap:8,marginTop:6}}>
            {catData.map(e=>(
              <div key={e.name} style={{display:'flex',alignItems:'center',gap:4,fontSize:11,color:C.text2}}>
                <span style={{width:10,height:10,borderRadius:2,background:CAT_COLORS[e.name]||C.slate,display:'inline-block',flexShrink:0}}/>
                {e.name.split(' ')[0]}
              </div>
            ))}
          </div>
        </ChartCard>
      </Grid2>

      <Grid2>
        <ChartCard title="DV Status by Legal Category">
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={dvByCat}><XAxis dataKey="cat" tick={{fontSize:11,fill:C.text3}} axisLine={false} tickLine={false}/><YAxis tick={{fontSize:11,fill:C.text3}} axisLine={false} tickLine={false}/><Tooltip {...tt}/><Bar dataKey="yes" name="DV yes" fill={C.red} stackId="a" radius={[0,0,0,0]}/><Bar dataKey="no" name="DV no" fill="#B5D4F4" stackId="a" radius={[3,3,0,0]}/></BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Disability Status by Category">
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={disByCat}><XAxis dataKey="cat" tick={{fontSize:11,fill:C.text3}} axisLine={false} tickLine={false}/><YAxis tick={{fontSize:11,fill:C.text3}} axisLine={false} tickLine={false}/><Tooltip {...tt}/><Bar dataKey="yes" name="Disabled" fill={C.amber} stackId="a"/><Bar dataKey="no" name="Not disabled" fill={C.greenLight} stackId="a" radius={[3,3,0,0]}/></BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </Grid2>

      <Grid3>
        <ChartCard title="Cases by Program" sub="TLC drives majority of volume">
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={progData} layout="vertical"><XAxis type="number" tick={{fontSize:11,fill:C.text3}} axisLine={false} tickLine={false}/><YAxis dataKey="name" type="category" tick={{fontSize:11,fill:C.text3}} axisLine={false} tickLine={false} width={40}/><Tooltip {...tt}/><Bar dataKey="cases" radius={[0,3,3,0]}>
              {progData.map((e,i)=><Cell key={i} fill={PROG_COLORS[e.name]||C.slate}/>)}
            </Bar></BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="TLC Outcomes" sub="Most cases resolved favorably">
          <ResponsiveContainer width="100%" height={120}>
            <PieChart><Pie data={outData} cx="50%" cy="50%" innerRadius={30} outerRadius={55} dataKey="value" paddingAngle={2}>
              {outData.map((e,i)=><Cell key={i} fill={OUTCOME_COLORS[e.name]||C.slate}/>)}
            </Pie><Tooltip {...tt}/></PieChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="County Distribution">
          <ResponsiveContainer width="100%" height={100}>
            <PieChart><Pie data={countyData} cx="50%" cy="50%" outerRadius={48} dataKey="value" paddingAngle={2}>
              {countyData.map((e,i)=><Cell key={i} fill={COUNTY_COLORS[e.name]||C.slate}/>)}
            </Pie><Tooltip {...tt}/></PieChart>
          </ResponsiveContainer>
          <div style={{display:'flex',flexWrap:'wrap',gap:6,marginTop:6}}>
            {countyData.map(e=>(
              <div key={e.name} style={{display:'flex',alignItems:'center',gap:4,fontSize:10,color:C.text2}}>
                <span style={{width:8,height:8,borderRadius:2,background:COUNTY_COLORS[e.name]||C.slate,display:'inline-block',flexShrink:0}}/>
                {e.name}
              </div>
            ))}
          </div>
        </ChartCard>
      </Grid3>

<ChartCard title="Top Legal Issues" sub="Leading case types across all programs" full style={{marginBottom:0}}>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={topIssues} layout="vertical"><XAxis type="number" tick={{fontSize:11,fill:C.text3}} axisLine={false} tickLine={false}/><YAxis dataKey="name" type="category" tick={{fontSize:11,fill:C.text3}} axisLine={false} tickLine={false} width={160}/><Tooltip {...tt}/><Bar dataKey="count" fill={C.violet} radius={[0,3,3,0]}/></BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </Page>
  )
}
