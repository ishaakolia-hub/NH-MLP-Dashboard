import { useState } from 'react'
import { useApp } from '../App'
import { C, Page, Badge } from '../components/ui'

const OUTCOME_BADGE = { 'Issue resolved':'green','Settlement':'green','Trial decision':'green','Withdrew':'slate','Unbundled service':'slate','Closed/other':'red','Pending':'amber' }

export default function Cases() {
  const { cases } = useApp()
  const [search, setSearch] = useState('')
  const [prog, setProg] = useState('')
  const [cat, setCat] = useState('')
  const [county, setCounty] = useState('')

  const filtered = cases.filter(c => {
    if(prog && c.program!==prog) return false
    if(cat && c.category!==cat) return false
    if(county && c.county!==county) return false
    if(search && !JSON.stringify(c).toLowerCase().includes(search.toLowerCase())) return false
    return true
  }).slice().reverse()

  const sel = { padding:'7px 11px', border:`1px solid ${C.border}`, borderRadius:7, background:C.surface, fontFamily:"'DM Sans',sans-serif", fontSize:12, color:C.text, outline:'none' }

  return (
    <Page>
      <div style={{ display:'flex', gap:10, marginBottom:18, flexWrap:'wrap', alignItems:'center' }}>
        <input placeholder="Search client, issue, county..." value={search} onChange={e=>setSearch(e.target.value)}
          style={{ ...sel, minWidth:220 }} />
        <select style={sel} value={prog} onChange={e=>setProg(e.target.value)}>
          <option value="">All programs</option>
          {['TLC','Moms','ATP'].map(p=><option key={p}>{p}</option>)}
        </select>
        <select style={sel} value={cat} onChange={e=>setCat(e.target.value)}>
          <option value="">All categories</option>
          {['Personal & family','Housing & utilities','Income & insurance','Legal status','Education & employment'].map(c=><option key={c}>{c}</option>)}
        </select>
        <select style={sel} value={county} onChange={e=>setCounty(e.target.value)}>
          <option value="">All counties</option>
          {['Sullivan','Grafton','Merrimack','Other'].map(c=><option key={c}>{c}</option>)}
        </select>
        <span style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color:C.text3, marginLeft:'auto' }}>
          {filtered.length} of {cases.length} cases
        </span>
      </div>

      <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, overflow:'hidden' }}>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
            <thead>
              <tr style={{ borderBottom:`2px solid ${C.border}` }}>
                {['#','Date','Program','Client','Category','Issue','County','DV','Disability','Veteran','Kids HH','Dev. Stage','Benefit Type','$/mo','Outcome'].map(h=>(
                  <th key={h} style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:C.text3, textTransform:'uppercase', letterSpacing:'0.06em', padding:'8px 12px', textAlign:'left', whiteSpace:'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0,200).map(c => (
                <tr key={c.id} style={{ borderBottom:`1px solid ${C.border}` }}>
                  <td style={{ padding:'9px 12px', fontFamily:"'DM Mono',monospace", fontSize:10, color:C.text3 }}>{c.id}</td>
                  <td style={{ padding:'9px 12px', fontFamily:"'DM Mono',monospace", fontSize:11 }}>{c.date||'-'}</td>
                  <td style={{ padding:'9px 12px' }}><Badge variant="violet">{c.program}</Badge></td>
                  <td style={{ padding:'9px 12px', fontFamily:"'DM Mono',monospace", fontSize:11, color:C.text3 }}>{c.client}</td>
                  <td style={{ padding:'9px 12px', fontSize:12 }}>{c.category}</td>
                  <td style={{ padding:'9px 12px', fontSize:12 }}>{c.issue}</td>
                  <td style={{ padding:'9px 12px', fontSize:12 }}>{c.county}</td>
                  <td style={{ padding:'9px 12px' }}>{c.dv==='yes'?<Badge variant="red">Yes</Badge>:<span style={{color:C.text3,fontSize:11}}>No</span>}</td>
                  <td style={{ padding:'9px 12px' }}>{c.disability==='yes'?<Badge variant="amber">Yes</Badge>:<span style={{color:C.text3,fontSize:11}}>No</span>}</td>
                  <td style={{ padding:'9px 12px' }}>{c.veteranStatus==='yes'?<Badge variant="amber">Yes</Badge>:<span style={{color:C.text3,fontSize:11}}>No</span>}</td>
                  <td style={{ padding:'9px 12px', fontFamily:"'DM Mono',monospace", fontSize:11, textAlign:'center' }}>{c.numChildren||'-'}</td>
                  <td style={{ padding:'9px 12px', fontSize:11 }}>{c.devBucket?{toddler:'Infant/Toddler',['school-age']:'School Age',teen:'Teen'}[c.devBucket]||c.devBucket:'-'}</td>
                  <td style={{ padding:'9px 12px', fontSize:11 }}>{c.benefitType||'-'}</td>
                  <td style={{ padding:'9px 12px', fontFamily:"'DM Mono',monospace", fontSize:11 }}>{c.benefitMonthly?`$${c.benefitMonthly}`:'-'}</td>
                  <td style={{ padding:'9px 12px' }}><Badge variant={OUTCOME_BADGE[c.outcome]||'slate'}>{c.outcome||'-'}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Page>
  )
}
