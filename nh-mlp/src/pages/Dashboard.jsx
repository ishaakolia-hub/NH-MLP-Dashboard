import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { useApp } from '../App'
import { C, Page, Grid4, Grid2, Grid3, StatCard, ChartCard, CATS, CAT_COLORS, PROG_COLORS, COUNTY_COLORS, FAVORABLE, TT_STYLE } from '../components/ui'

const AXIS = { fontSize: 11, fill: '#4A5568' }

const OUTCOME_COLORS = {
  'Issue resolved':    '#2B5282',
  'Settlement':        '#0D9488',
  'Trial decision':    '#4A7EB5',
  'Withdrew':          '#718096',
  'Unbundled service': '#B7791F',
  'Closed/other':      '#4A5568',
  'Pending':           '#BDD7EE',
}

function StatusBadge({ outcome }) {
  const isActive = !outcome || outcome === 'Pending'
  return (
    <span style={{
      display: 'inline-block',
      padding: '3px 10px',
      borderRadius: 5,
      fontSize: 10,
      fontWeight: 700,
      fontFamily: "'DM Mono',monospace",
      letterSpacing: '0.06em',
      background: isActive ? '#C6F6D5' : '#BEE3F8',
      color:      isActive ? '#276749' : '#2B6CB0',
    }}>
      {isActive ? 'ACTIVE' : 'RESOLVED'}
    </span>
  )
}

function OutcomeText({ outcome }) {
  if (!outcome || outcome === 'Pending') return <span style={{ color: '#718096' }}>N/A</span>
  const favorable = FAVORABLE.has(outcome)
  return (
    <span style={{ color: favorable ? '#2B6CB0' : '#718096', fontWeight: favorable ? 500 : 400 }}>
      {favorable ? 'Favorable' : outcome}
    </span>
  )
}

export default function Dashboard() {
  const { cases } = useApp()

  const totalCases    = 238
  const uniqueClients = 134
  const dvCount       = 52
  const favorable     = 185

  const growthData = [
    { year: 'FY23-24',  cases: 94 },
    { year: 'FY24-25',  cases: 69 },
    { year: 'FY25-26', cases: 41 },
  ]

  const catCounts = {}
  CATS.forEach(c => catCounts[c] = 0)
  cases.forEach(c => { if (catCounts[c.category] !== undefined) catCounts[c.category]++ })
  const catData = Object.entries(catCounts).map(([name, value]) => ({ name, value }))

  const dvByCat = CATS.map(cat => ({
    cat: cat.split(' ')[0],
    yes: cases.filter(c => c.category === cat && c.dv === 'yes').length,
    no:  cases.filter(c => c.category === cat && c.dv === 'no').length,
  }))

  const disByCat = CATS.map(cat => ({
    cat: cat.split(' ')[0],
    yes: cases.filter(c => c.category === cat && c.disability === 'yes').length,
    no:  cases.filter(c => c.category === cat && c.disability === 'no').length,
  }))

  const progData = ['TLC','Moms','ATP'].map(p => ({
    name: p,
    cases: cases.filter(c => c.program === p).length,
  }))

  const outCounts = {}
  cases.forEach(c => { outCounts[c.outcome] = (outCounts[c.outcome] || 0) + 1 })
  const outData = Object.entries(outCounts).map(([name, value]) => ({ name, value }))

  const countyData = ['Sullivan','Grafton','Merrimack','Other'].map(co => ({
    name: co,
    value: cases.filter(c => c.county === co).length,
  }))

  const issueCounts = {}
  cases.forEach(c => { if (c.issue) issueCounts[c.issue] = (issueCounts[c.issue] || 0) + 1 })
  const topIssues = Object.entries(issueCounts).sort((a,b) => b[1]-a[1]).slice(0,10).map(([name,count]) => ({ name, count }))

  const recentCases = [...cases].sort((a,b) => b.id - a.id).slice(0, 5)

  const formatCaseId = (id) => `#NH-${String(10072 + id).slice(-5)}`

  return (
    <Page>
      <Grid4>
        <StatCard
          label="Total Cases"
          value={totalCases}
          badge="+12% ↑"
          sub="TLC / Moms / ATP · all time"
          variant="blue"
        />
        <StatCard
          label="Unique Clients"
          value={uniqueClients}
          sub="Unduplicated individuals served"
          variant="default"
        />
        <StatCard
          label="DV Survivors"
          value="39%"
          sub={`${dvCount} of ${uniqueClients} clients flagged for DV status`}
          variant="crimson"
        />
        <StatCard
          label="Favorable Outcomes"
          value="78%"
          sub={`${favorable} of ${totalCases} cases resolved favorably`}
          variant="teal"
        />
      </Grid4>

      <Grid2>
        <ChartCard title="Case Growth by Year" sub="Fiscal year · all programs combined">
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, height: 240, padding: '0 16px 0' }}>
            {growthData.map((d, i) => {
              const maxVal = 94
              const pct    = d.cases / maxVal
              const barH   = Math.round(pct * 185)
              const colors = ['#1B3A6B', '#2B5C96', '#4A78A8']
              return (
                <div key={d.year} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', gap: 8, height: '100%' }}>
                  <span style={{ fontSize: 20, color: '#1A202C', fontWeight: 700, letterSpacing: '-0.02em' }}>{d.cases}</span>
                  <div style={{
                    width: '80%',
                    height: barH,
                    background: colors[i],
                    borderRadius: '4px 4px 2px 2px',
                  }}/>
                  <span style={{ fontSize: 13, color: '#718096', fontWeight: 600, letterSpacing: '0.01em', textAlign: 'center', whiteSpace: 'nowrap', marginTop: 2 }}>{d.year}</span>
                </div>
              )
            })}
          </div>
        </ChartCard>

        <ChartCard title="Cases by iHELP Category">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, width: '100%' }}>
            <div style={{ position: 'relative', width: 130, height: 130, flexShrink: 0 }}>
              <ResponsiveContainer width={130} height={130}>
                <PieChart>
                  <Pie data={catData} cx="50%" cy="50%" innerRadius={40} outerRadius={62} dataKey="value" paddingAngle={3} startAngle={90} endAngle={-270}>
                    {catData.map((e,i) => <Cell key={i} fill={CAT_COLORS[e.name] || C.slate}/>)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', textAlign:'center', pointerEvents:'none' }}>
                <div style={{ fontFamily:"'Instrument Serif',serif", fontSize:22, color:'#1A202C', lineHeight:1 }}>{totalCases}</div>
                <div style={{ fontSize:9, color:'#718096', textTransform:'uppercase', letterSpacing:'0.08em', fontWeight:600, marginTop:2 }}>Total</div>
              </div>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 7 }}>
              {catData.map(e => {
                const pct = totalCases > 0 ? Math.round((e.value / totalCases) * 100) : 0
                const color = CAT_COLORS[e.name] || C.slate
                return (
                  <div key={e.name}>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:3 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:5 }}>
                        <span style={{ width:7, height:7, borderRadius:2, background:color, flexShrink:0 }}/>
                        <span style={{ fontSize:13, color:'#1A202C', fontWeight:500 }}>{e.name.split(' ')[0]}</span>
                      </div>
                      <span style={{ fontSize:12, color:'#718096', fontFamily:"'DM Mono',monospace" }}>{e.value} &nbsp;<span style={{ color }}>{pct}%</span></span>
                    </div>
                    <div style={{ height:4, borderRadius:2, background:'rgba(0,0,0,0.06)', overflow:'hidden' }}>
                      <div style={{ height:'100%', width:`${pct}%`, background:color, borderRadius:2, transition:'width 0.6s ease' }}/>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          </div>
        </ChartCard>
      </Grid2>

      <Grid2>
        <ChartCard title="DV Status by Legal Category">
          <div>
            {dvByCat.map(row => {
              const total = row.yes + row.no
              const pct = total > 0 ? Math.round((row.yes / total) * 100) : 0
              return (
                <div key={row.cat} style={{ marginBottom: 9 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 13, color: '#4A5568', fontWeight: 500 }}>{row.cat}</span>
                    <span style={{ fontSize: 12, color: '#C0392B', fontWeight: 700, fontFamily:"'DM Mono',monospace" }}>{pct}%</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 3, background: 'rgba(192,57,43,0.10)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: '#C0392B', borderRadius: 3, transition: 'width 0.6s ease' }}/>
                  </div>
                </div>
              )
            })}
          </div>
        </ChartCard>

        <ChartCard title="Disability Status by Category">
          <ResponsiveContainer width="100%" height={178}>
            <BarChart data={disByCat}>
              <XAxis dataKey="cat" tick={AXIS} axisLine={false} tickLine={false}/>
              <YAxis tick={AXIS} axisLine={false} tickLine={false}/>
              <Tooltip {...TT_STYLE}/>
              <Bar dataKey="yes" name="Disabled"     fill="#2B5282" stackId="a" radius={[0,0,0,0]}/>
              <Bar dataKey="no"  name="Not disabled" fill="#6B9EC0" stackId="a" radius={[4,4,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </Grid2>

      <Grid3>
        <ChartCard title="Cases by Program" sub="TLC drives majority of volume">
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={progData} layout="vertical">
              <XAxis type="number" tick={AXIS} axisLine={false} tickLine={false}/>
              <YAxis dataKey="name" type="category" tick={AXIS} axisLine={false} tickLine={false} width={40}/>
              <Tooltip {...TT_STYLE}/>
              <Bar dataKey="cases" radius={[0,4,4,0]}>
                {progData.map((e,i) => <Cell key={i} fill={PROG_COLORS[e.name] || C.slate}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div style={{ marginTop: 6, fontSize: 10, color: '#94a3b8', lineHeight: 1.7 }}>
            <span style={{ marginRight: 10 }}><b>TLC</b> The Legal Clinic</span>
            <span style={{ marginRight: 10 }}><b>Moms</b> MOMS Partnership</span>
            <span><b>ATP</b> Advocacy Through Pediatrics</span>
          </div>
        </ChartCard>

        <ChartCard title="TLC Outcomes" sub="Most cases resolved favorably">
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <PieChart width={220} height={138}>
              <Pie data={outData} cx="50%" cy="50%" innerRadius={32} outerRadius={58} dataKey="value" paddingAngle={3}>
                {outData.map((e,i) => <Cell key={i} fill={OUTCOME_COLORS[e.name] || C.slate}/>)}
              </Pie>
              <Tooltip {...TT_STYLE}/>
            </PieChart>
          </div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:'3px 10px', marginTop:4 }}>
            {outData.map(e => (
              <div key={e.name} style={{ display:'flex', alignItems:'center', gap:4 }}>
                <span style={{ width:6, height:6, borderRadius:2, background:OUTCOME_COLORS[e.name]||C.slate, flexShrink:0 }}/>
                <span style={{ fontSize:10, color:'#4A5568' }}>{e.name.split('/')[0].split(' ').slice(0,2).join(' ')}</span>
                <span style={{ fontSize:10, color:'#718096', fontFamily:"'DM Mono',monospace" }}>{e.value}</span>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="County Distribution">
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <PieChart width={160} height={116}>
              <Pie data={countyData} cx="50%" cy="50%" outerRadius={52} dataKey="value" paddingAngle={3}>
                {countyData.map((e,i) => <Cell key={i} fill={COUNTY_COLORS[e.name] || C.slate}/>)}
              </Pie>
              <Tooltip {...TT_STYLE}/>
            </PieChart>
          </div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:'4px 12px', marginTop:6 }}>
            {countyData.map(e => (
              <div key={e.name} style={{ display:'flex', alignItems:'center', gap:4 }}>
                <span style={{ width:6, height:6, borderRadius:2, background:COUNTY_COLORS[e.name]||C.slate, flexShrink:0 }}/>
                <span style={{ fontSize:10, color:'#4A5568', fontWeight:500 }}>{e.name}</span>
                <span style={{ fontSize:10, color:'#718096', fontFamily:"'DM Mono',monospace" }}>{e.value}</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </Grid3>

      {/* Recent Case Activity */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: 12,
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        marginBottom: 10,
      }}>
        <div style={{
          padding: '12px 18px',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#1A202C', letterSpacing: '0.01em' }}>Recent Case Activity</div>
          <button style={{
            padding: '4px 12px',
            background: 'none',
            border: '1px solid #E2E8F0',
            borderRadius: 6,
            fontSize: 11,
            color: '#4A5568',
            cursor: 'pointer',
            fontFamily: "'DM Sans',sans-serif",
            fontWeight: 500,
          }}>
            View All Cases
          </button>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
              {['Case ID','Program','Status','Open Date','Outcome'].map(h => (
                <th key={h} style={{
                  padding: '7px 18px',
                  textAlign: 'left',
                  fontSize: 10,
                  fontWeight: 700,
                  color: '#718096',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  background: '#F7FAFC',
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentCases.map((c, i) => (
              <tr key={c.id} style={{ borderBottom: i < recentCases.length - 1 ? '1px solid #F0F4F8' : 'none', background: i % 2 === 1 ? '#FAFBFC' : '#FFFFFF' }}>
                <td style={{ padding: '9px 18px', fontSize: 11, fontWeight: 600, color: '#1A202C', fontFamily: "'DM Mono',monospace", whiteSpace: 'nowrap' }}>
                  {formatCaseId(c.id)}
                </td>
                <td style={{ padding: '9px 18px', fontSize: 11, color: '#4A5568', fontWeight: 500 }}>
                  {c.program}
                </td>
                <td style={{ padding: '9px 18px' }}>
                  <StatusBadge outcome={c.outcome} />
                </td>
                <td style={{ padding: '9px 18px', fontSize: 11, color: '#4A5568' }}>
                  {c.date || 'N/A'}
                </td>
                <td style={{ padding: '9px 18px', fontSize: 11 }}>
                  <OutcomeText outcome={c.outcome} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ChartCard title="Top Legal Issues" sub="Leading case types across all programs" full style={{ marginBottom: 0, marginTop: 0 }}>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={topIssues} layout="vertical">
            <XAxis type="number" tick={AXIS} axisLine={false} tickLine={false}/>
            <YAxis dataKey="name" type="category" tick={AXIS} axisLine={false} tickLine={false} width={165}/>
            <Tooltip {...TT_STYLE}/>
            <Bar dataKey="count" fill="#2B5282" radius={[0,4,4,0]}/>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </Page>
  )
}
