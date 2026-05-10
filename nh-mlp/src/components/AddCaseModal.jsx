import { useState } from 'react'
import { C } from './ui'

const AGE_BANDS = ['Under 1','1-2','3-5','6-8','9-11','12-14','15-17','18+']
const DEV_BUCKETS = [
  { value:'toddler', label:'Infant/Toddler (0-3)', desc:'Highest developmental risk' },
  { value:'school-age', label:'School Age (4-12)', desc:'Housing disruption = school instability' },
  { value:'teen', label:'Teen (13-18)', desc:'Independence & education impact' },
]

export default function AddCaseModal({ onClose, onSave, totalCases }) {
  const today = new Date().toISOString().slice(0,10)
  const [form, setForm] = useState({
    date: today, program:'TLC', client:`MLP-${1500+totalCases}`,
    category:'Personal & family', issue:'', county:'Sullivan',
    dv:'no', disability:'no', veteranStatus:'no',
    clientAge:'', nhCivil:'yes', childCustody:'no',
    numChildren:'', childrenSupported:'', childAges:[], devBucket:'',
    financialBenefit:'no', benefitType:'', benefitMonthly:'', benefitLump:'',
    outcome:'Pending', notes:''
  })

  const set = (k, v) => setForm(f => ({...f, [k]:v}))
  const toggleAge = (age) => set('childAges', form.childAges.includes(age) ? form.childAges.filter(a=>a!==age) : [...form.childAges, age])

  const handleSave = () => {
    if (!form.issue) { alert('Please enter a legal issue'); return }
    onSave(form); onClose()
  }

  const F = ({ label, children, hint }) => (
    <div style={{ marginBottom:0 }}>
      <label style={{ display:'block', fontFamily:"'DM Mono',monospace", fontSize:10, color:C.text3, textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:5 }}>{label}</label>
      {children}
      {hint && <div style={{ fontSize:10, color:C.text3, marginTop:3 }}>{hint}</div>}
    </div>
  )

  const inp = { width:'100%', padding:'8px 11px', border:`1px solid ${C.border}`, borderRadius:7, background:C.bg, color:C.text, fontFamily:"'DM Sans',sans-serif", fontSize:13, outline:'none', boxSizing:'border-box' }

  return (
    <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(26,25,22,0.55)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:C.surface, borderRadius:14, width:680, maxHeight:'92vh', overflowY:'auto', boxShadow:'0 24px 64px rgba(0,0,0,0.28)' }}>
        {/* Header */}
        <div style={{ padding:'22px 28px 18px', borderBottom:`1px solid ${C.border}`, display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
          <div>
            <div style={{ fontFamily:"'Instrument Serif',serif", fontSize:22, fontStyle:'italic', marginBottom:3 }}>Add New Case</div>
            <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:C.text3 }}>Charts update instantly after saving</div>
          </div>
          <button onClick={onClose} style={{ border:`1px solid ${C.border}`, background:'none', borderRadius:'50%', width:30, height:30, cursor:'pointer', fontSize:16, color:C.text2 }}>x</button>
        </div>

        <div style={{ padding:'20px 28px' }}>
          {/* Case Info */}
          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:C.text3, textTransform:'uppercase', letterSpacing:'0.08em', borderBottom:`1px solid ${C.border}`, paddingBottom:8, marginBottom:16 }}>Case Information</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:14, marginBottom:14 }}>
            <F label="Date"><input type="date" style={inp} value={form.date} onChange={e=>set('date',e.target.value)} /></F>
            <F label="Program">
              <select style={inp} value={form.program} onChange={e=>set('program',e.target.value)}>
                {['TLC','Moms','ATP'].map(p=><option key={p}>{p}</option>)}
              </select>
            </F>
            <F label="Client ID"><input style={inp} value={form.client} onChange={e=>set('client',e.target.value)} /></F>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
            <F label="iHELP Category">
              <select style={inp} value={form.category} onChange={e=>set('category',e.target.value)}>
                {['Personal & family','Housing & utilities','Income & insurance','Legal status','Education & employment'].map(c=><option key={c}>{c}</option>)}
              </select>
            </F>
            <F label="Legal Issue (specific)"><input style={inp} placeholder="e.g. Custody, Eviction, SSI..." value={form.issue} onChange={e=>set('issue',e.target.value)} /></F>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:14, marginBottom:14 }}>
            <F label="County">
              <select style={inp} value={form.county} onChange={e=>set('county',e.target.value)}>
                {['Sullivan','Grafton','Merrimack','Other'].map(c=><option key={c}>{c}</option>)}
              </select>
            </F>
            <F label="DV Survivor">
              <select style={inp} value={form.dv} onChange={e=>set('dv',e.target.value)}>
                <option value="no">No</option><option value="yes">Yes</option>
              </select>
            </F>
            <F label="Disability">
              <select style={inp} value={form.disability} onChange={e=>set('disability',e.target.value)}>
                <option value="no">No</option><option value="yes">Yes</option>
              </select>
            </F>
            <F label="Veteran">
              <select style={inp} value={form.veteranStatus} onChange={e=>set('veteranStatus',e.target.value)}>
                <option value="no">No</option><option value="yes">Yes</option>
              </select>
            </F>
          </div>

          {/* Inclusion Criteria */}
          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:C.text3, textTransform:'uppercase', letterSpacing:'0.08em', borderBottom:`1px solid ${C.border}`, paddingBottom:8, marginBottom:16, marginTop:20 }}>Inclusion Criteria</div>
          <div style={{ background:C.violetPale, border:'1px solid #C8C4F8', borderRadius:7, padding:'10px 14px', fontSize:12, color:C.violet, marginBottom:14, lineHeight:1.5 }}>
            NH Civil Legal Issue - Client age 12-18+ - One of TLC / Moms / ATP - Child custody/guardianship (age under 12)
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:14, marginBottom:14 }}>
            <F label="Client Age"><input type="number" style={inp} placeholder="e.g. 34" value={form.clientAge} onChange={e=>set('clientAge',e.target.value)} /></F>
            <F label="NH Civil Legal Issue?">
              <select style={inp} value={form.nhCivil} onChange={e=>set('nhCivil',e.target.value)}>
                <option value="yes">Yes</option><option value="no">No</option><option value="unknown">Unknown</option>
              </select>
            </F>
            <F label="Child Custody/GP under 12?">
              <select style={inp} value={form.childCustody} onChange={e=>set('childCustody',e.target.value)}>
                <option value="no">No</option><option value="yes">Yes</option><option value="na">N/A</option>
              </select>
            </F>
          </div>

          {/* Children */}
          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:C.text3, textTransform:'uppercase', letterSpacing:'0.08em', borderBottom:`1px solid ${C.border}`, paddingBottom:8, marginBottom:16, marginTop:20 }}>Children in Household</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
            <F label="Number of children in household"><input type="number" style={inp} placeholder="e.g. 2" min="0" max="20" value={form.numChildren} onChange={e=>set('numChildren',e.target.value)} /></F>
            <F label="Number of children supported by this case"><input type="number" style={inp} placeholder="e.g. 1" min="0" max="20" value={form.childrenSupported} onChange={e=>set('childrenSupported',e.target.value)} /></F>
          </div>

          <F label="Ages of children in household (select all that apply)">
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:6, marginTop:6 }}>
              {AGE_BANDS.map(age => (
                <button key={age} onClick={()=>toggleAge(age)}
                  style={{ padding:'6px 4px', border:`1px solid ${form.childAges.includes(age)?C.violet:C.border}`, borderRadius:6, background:form.childAges.includes(age)?C.violetPale:C.bg2, color:form.childAges.includes(age)?C.violet:C.text2, fontFamily:"'DM Mono',monospace", fontSize:11, cursor:'pointer', transition:'all 0.1s' }}>
                  {age}
                </button>
              ))}
            </div>
          </F>

          <div style={{ marginTop:14 }}>
            <F label="Developmental age group (Holly's framework)" hint="Infant/toddler (0-3): highest dev risk. School age (4-12): housing disruption = school disruption. Teen (13-18): independence impact.">
              <div style={{ display:'flex', gap:8, marginTop:6 }}>
                {DEV_BUCKETS.map(b => (
                  <button key={b.value} onClick={()=>set('devBucket',b.value)}
                    style={{ flex:1, padding:'8px 10px', border:`1px solid ${form.devBucket===b.value?C.violet:C.border}`, borderRadius:7, background:form.devBucket===b.value?C.violetPale:C.bg2, color:form.devBucket===b.value?C.violet:C.text2, cursor:'pointer', textAlign:'left', fontSize:11, transition:'all 0.1s' }}>
                    <div style={{ fontWeight:500, marginBottom:2 }}>{b.label}</div>
                    <div style={{ color:C.text3, fontSize:10 }}>{b.desc}</div>
                  </button>
                ))}
              </div>
            </F>
          </div>

          {/* Financial Benefit */}
          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:C.text3, textTransform:'uppercase', letterSpacing:'0.08em', borderBottom:`1px solid ${C.border}`, paddingBottom:8, marginBottom:16, marginTop:20 }}>Financial Benefit (NCMLP Measure 6)</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:14, marginBottom:14 }}>
            <F label="Financial benefit?">
              <select style={inp} value={form.financialBenefit} onChange={e=>set('financialBenefit',e.target.value)}>
                <option value="no">No</option><option value="yes">Yes</option><option value="pending">Pending</option>
              </select>
            </F>
            <F label="Benefit type">
              <select style={inp} value={form.benefitType} onChange={e=>set('benefitType',e.target.value)}>
                {['','SSI','SSD','SNAP','Medicaid','Medicare','TANF','LIHEAP','Child support','VA benefits','Housing subsidies','Unemployment','Other'].map(t=><option key={t} value={t}>{t||'Select...'}</option>)}
              </select>
            </F>
            <F label="Monthly amount ($)"><input type="number" style={inp} placeholder="e.g. 750" value={form.benefitMonthly} onChange={e=>set('benefitMonthly',e.target.value)} /></F>
            <F label="Lump sum ($)"><input type="number" style={inp} placeholder="e.g. 15000" value={form.benefitLump} onChange={e=>set('benefitLump',e.target.value)} /></F>
          </div>

          {/* Outcome */}
          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:C.text3, textTransform:'uppercase', letterSpacing:'0.08em', borderBottom:`1px solid ${C.border}`, paddingBottom:8, marginBottom:16, marginTop:20 }}>Outcome</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
            <F label="Outcome">
              <select style={inp} value={form.outcome} onChange={e=>set('outcome',e.target.value)}>
                {['Issue resolved','Settlement','Trial decision','Withdrew','Unbundled service','Closed/other','Pending'].map(o=><option key={o}>{o}</option>)}
              </select>
            </F>
            <F label="Notes"><input style={inp} placeholder="Brief notes..." value={form.notes} onChange={e=>set('notes',e.target.value)} /></F>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding:'16px 28px 22px', borderTop:`1px solid ${C.border}`, display:'flex', gap:10, justifyContent:'flex-end' }}>
          <button onClick={onClose} style={{ padding:'9px 18px', border:`1px solid ${C.border}`, borderRadius:8, background:'none', cursor:'pointer', fontFamily:"'DM Sans',sans-serif", fontSize:13, color:C.text2 }}>Cancel</button>
          <button onClick={handleSave} style={{ padding:'9px 22px', border:'none', borderRadius:8, background:C.violet, color:'#fff', cursor:'pointer', fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:500 }}>Save Case</button>
        </div>
      </div>
    </div>
  )
}
