import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts'
import { useApp } from '../App'
import { C, Page, Grid4, Grid2, StatCard, ChartCard, InfoBox, CATS, CAT_COLORS, FAVORABLE, TT_STYLE } from '../components/ui'

const DEV_COLORS = { toddler:'#E24B4A', 'school-age':'#6B63D4', teen:'#1D9E75', '':'#888780' }
const DEV_LABELS = { toddler:'Infant/Toddler (0-3)', 'school-age':'School Age (4-12)', teen:'Teen (13-18)' }

export default function Children() {
  const { cases, qrReports, addQR, deleteQR } = useApp()

  const cascadeCases = cases.filter(c => FAVORABLE.has(c.outcome) && c.numChildren && parseInt(c.numChildren) > 0)
  const totalKidsReached = 304  // verified from Excel all-time data
  const qrKids = qrReports.reduce((s,r) => s+(r.lt6||0)+(r.age6to8||0)+(r.age9plus||0), 0)
  const qrSupport = qrReports.reduce((s,r) => s+(r.support||0), 0)

  // Dev bucket breakdown
  const devData = [
    { name:'Infant/Toddler\n(0-3)', bucket:'toddler', count: cascadeCases.filter(c=>c.devBucket==='toddler').reduce((s,c)=>s+parseInt(c.numChildren||0),0) },
    { name:'School Age\n(4-12)', bucket:'school-age', count: cascadeCases.filter(c=>c.devBucket==='school-age').reduce((s,c)=>s+parseInt(c.numChildren||0),0) },
    { name:'Teen\n(13-18)', bucket:'teen', count: cascadeCases.filter(c=>c.devBucket==='teen').reduce((s,c)=>s+parseInt(c.numChildren||0),0) },
  ]

  // By category
  const catKidsData = CATS.map(cat => ({
    name: cat.split(' ')[0],
    kids: cascadeCases.filter(c=>c.category===cat).reduce((s,c)=>s+parseInt(c.numChildren||0),0)
  })).filter(d=>d.kids>0)

  // QR age data
  const lt6total = qrReports.reduce((s,r)=>s+(r.lt6||0),0)
  const a68total = qrReports.reduce((s,r)=>s+(r.age6to8||0),0)
  const a9total = qrReports.reduce((s,r)=>s+(r.age9plus||0),0)
  const qrAgeData = [
    { name:'Under 6\n(highest dev risk)', count:lt6total },
    { name:'6-8 years', count:a68total },
    { name:'9+ years', count:a9total },
  ]

  const tt = TT_STYLE

  const handleAddQR = () => {
    const q = prompt('Quarter (e.g. Q1, Q2, Q3, Q4):'); if(!q) return
    const yr = prompt('Program Year (e.g. FY25-26):'); if(!yr) return
    const lt6 = parseInt(prompt('Children under 6:')||'0')||0
    const a68 = parseInt(prompt('Children 6-8:')||'0')||0
    const a9p = parseInt(prompt('Children 9+:')||'0')||0
    const sup = parseInt(prompt('Monthly child support won ($):')||'0')||0
    const notes = prompt('Notes:')||''
    addQR({quarter:q,year:yr,lt6,age6to8:a68,age9plus:a9p,support:sup,notes})
  }

  // Histogram: resolved cases grouped by household size
  const histData = [
    { label: '1 child',    cases: cascadeCases.filter(c => parseInt(c.numChildren) === 1).length },
    { label: '2 children', cases: cascadeCases.filter(c => parseInt(c.numChildren) === 2).length },
    { label: '3 children', cases: cascadeCases.filter(c => parseInt(c.numChildren) === 3).length },
    { label: '4+ children',cases: cascadeCases.filter(c => parseInt(c.numChildren) >= 4).length },
  ]

  return (
    <Page>
      <InfoBox>
        The DH MLP supports low-income clients facing civil legal issues in NH who are pregnant or parenting a child under the age of 12. When a client receives support through the MLP, the impact often extends beyond the individual, supporting every child within that household as well. This page highlights that broader ripple effect.
      </InfoBox>

      <Grid4>
        <StatCard label="Clients supported with kids at home" value={134} sub="all clients · program serves parents of children under 12" />
        <StatCard label="Children reached" value={304} sub="across all programs, inception through FY25-26" color={C.violet} />
        <StatCard label="Children counted this quarter" value={qrKids} sub={`across ${qrReports.length} quarterly report${qrReports.length!==1?'s':''}`} />
        <StatCard label="Child support won" value={`$${qrSupport.toLocaleString()}/mo`} sub="latest quarterly report data" color={C.green} />
      </Grid4>

      {/* HISTOGRAM */}
      <ChartCard title="Children in household: resolved cases" sub="Number of resolved cases by household size · all programs">
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={histData} barCategoryGap="20%" margin={{top:24,right:16,left:0,bottom:0}}>
            <XAxis dataKey="label" tick={{fontSize:13,fill:C.text2,fontFamily:"'DM Sans',sans-serif"}} axisLine={false} tickLine={false}/>
            <YAxis hide/>
            <Tooltip {...tt} formatter={(v)=>[v,'Resolved cases']}/>
            <Bar dataKey="cases" radius={[6,6,0,0]}>
              {histData.map((e,i)=><Cell key={i} fill={[C.violet,C.blue,C.green,C.amber][i]||C.violet}/>)}
              <LabelList dataKey="cases" position="top" style={{fontSize:14,fontWeight:600,fontFamily:"'DM Sans',sans-serif",fill:C.text}}/>
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <Grid2 style={{ marginTop:16 }}>
        <ChartCard title="Children by developmental stage - resolved cases" sub="Framework: each stage has different development stakes">
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={devData}><XAxis dataKey="name" tick={{fontSize:10,fill:C.text3}} axisLine={false} tickLine={false}/><YAxis tick={{fontSize:11,fill:C.text3}} axisLine={false} tickLine={false}/><Tooltip {...tt} formatter={(v)=>[v,'Children']}/><Bar dataKey="count" radius={[4,4,0,0]}>
              {devData.map((e,i)=><Cell key={i} fill={DEV_COLORS[e.bucket]||C.slate}/>)}
            </Bar></BarChart>
          </ResponsiveContainer>
          <div style={{ marginTop:10, display:'flex', gap:10, flexWrap:'wrap' }}>
            {Object.entries(DEV_COLORS).filter(([k])=>k).map(([b,col])=>(
              <div key={b} style={{ display:'flex', alignItems:'center', gap:5, fontSize:11, color:C.text2 }}>
                <span style={{ width:8, height:8, borderRadius:2, background:col, display:'inline-block' }}></span>
                {DEV_LABELS[b]||b}
              </div>
            ))}
          </div>
        </ChartCard>
        <ChartCard title="Which case type helped the most children?" sub="Total children across resolved cases grouped by legal issue type">
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={catKidsData}><XAxis dataKey="name" tick={{fontSize:11,fill:C.text3}} axisLine={false} tickLine={false}/><YAxis tick={{fontSize:11,fill:C.text3}} axisLine={false} tickLine={false} label={{value:'Children',angle:-90,position:'insideLeft',fontSize:10,fill:C.text3}}/><Tooltip {...tt} formatter={(v)=>[v,'Children reached']}/><Bar dataKey="kids" fill={C.violet} radius={[4,4,0,0]}/></BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </Grid2>

      <Grid2>
        <ChartCard title="Children by age group - quarterly reports" sub="Counts from narrative quarterly report data. Under 6 = highest developmental risk (brain develops fastest 0-3).">
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={qrAgeData}><XAxis dataKey="name" tick={{fontSize:10,fill:C.text3}} axisLine={false} tickLine={false}/><YAxis tick={{fontSize:11,fill:C.text3}} axisLine={false} tickLine={false}/><Tooltip {...tt} formatter={v=>[v,'Children']}/><Bar dataKey="count" radius={[4,4,0,0]}>
              {qrAgeData.map((_,i)=><Cell key={i} fill={[C.red,C.violet,C.blue][i]}/>)}
            </Bar></BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Child-related legal issues (from spreadsheet)" sub="Issues from inception through Mar 2026 where the legal matter itself involves a child">
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={[
              {name:'Custody (311)',count:68},{name:'Visitation (312)',count:32},{name:'Guardianship (330)',count:26},
              {name:'Child Support Enf.',count:6},{name:'Child Support Mod.',count:2},{name:'Other Juvenile',count:2},
            ]} layout="vertical">
              <XAxis type="number" tick={{fontSize:10,fill:C.text3}} axisLine={false} tickLine={false}/>
              <YAxis dataKey="name" type="category" tick={{fontSize:10,fill:C.text3}} axisLine={false} tickLine={false} width={120}/>
              <Tooltip {...tt}/><Bar dataKey="count" fill={C.violet} radius={[0,3,3,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </Grid2>

      {/* QR TABLE */}
      <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:20 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14 }}>
          <div>
            <div style={{ fontSize:13, fontWeight:500, marginBottom:4 }}>Log children from each quarterly report</div>
            <div style={{ fontSize:12, color:C.text2 }}>Enter age-group counts from each quarterly narrative. Chart above updates automatically.</div>
          </div>
          <button onClick={handleAddQR} style={{ padding:'8px 14px', background:C.violet, color:'#fff', border:'none', borderRadius:8, cursor:'pointer', fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:500, flexShrink:0 }}>+ Add Quarter</button>
        </div>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
          <thead><tr style={{ borderBottom:`2px solid ${C.border}` }}>
            {['Quarter','Program Year','Kids under 6','Kids 6-8','Kids 9+','Total kids','Child support won ($/mo)','Notes',''].map(h=>(
              <th key={h} style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:C.text3, textTransform:'uppercase', letterSpacing:'0.06em', padding:'8px 12px', textAlign:'left' }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {qrReports.map(r => (
              <tr key={r.id} style={{ borderBottom:`1px solid ${C.border}` }}>
                <td style={{ padding:'9px 12px', fontWeight:500 }}>{r.quarter}</td>
                <td style={{ padding:'9px 12px', fontFamily:"'DM Mono',monospace", fontSize:11 }}>{r.year}</td>
                <td style={{ padding:'9px 12px', fontFamily:"'DM Mono',monospace", textAlign:'center' }}>{r.lt6}</td>
                <td style={{ padding:'9px 12px', fontFamily:"'DM Mono',monospace", textAlign:'center' }}>{r.age6to8}</td>
                <td style={{ padding:'9px 12px', fontFamily:"'DM Mono',monospace", textAlign:'center' }}>{r.age9plus}</td>
                <td style={{ padding:'9px 12px', fontFamily:"'DM Mono',monospace", textAlign:'center', fontWeight:500, color:C.violet }}>{(r.lt6||0)+(r.age6to8||0)+(r.age9plus||0)}</td>
                <td style={{ padding:'9px 12px', fontFamily:"'DM Mono',monospace" }}>{r.support?`$${r.support.toLocaleString()}`:'-'}</td>
                <td style={{ padding:'9px 12px', fontSize:11, color:C.text3 }}>{r.notes||'-'}</td>
                <td style={{ padding:'9px 12px' }}><button onClick={()=>deleteQR(r.id)} style={{ border:'none', background:'none', cursor:'pointer', color:C.text3, fontSize:14 }}>x</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginTop:14, padding:'10px 14px', background:C.violetPale, borderRadius:8, fontSize:12, color:C.violet, lineHeight:1.6 }}>
          Already entered: Q3 FY25-26 (Jan-Mar 2026) - 11 kids under 6, 4 kids 6-8, 8 kids 9+, $750/month child support recovered
        </div>
      </div>
    </Page>
  )
}
