import { useState } from 'react'
import { COLORS } from '../constants'
import { fmt, parseNum } from '../utils'

export default function BillModal({ names, onClose }) {
  const [items, setItems]           = useState([{ id: 1, label: '', amount: '', payerIdx: null }])
  const [attending, setAttending]   = useState(names.map(() => true))
  const [transferred, setTransferred] = useState(names.map(() => false))
  const [openDropdown, setOpenDropdown] = useState(null)

  function addItem()             { setItems(p => [...p, { id: Date.now(), label: '', amount: '', payerIdx: null }]) }
  function removeItem(id)        { setItems(p => p.filter(it => it.id !== id)); if (openDropdown === id) setOpenDropdown(null) }
  function updateItem(id, f, v)  { setItems(p => p.map(it => it.id === id ? { ...it, [f]: v } : it)) }
  function toggleAttend(i)       { setAttending(p => p.map((v, idx) => idx === i ? !v : v)) }
  function toggleTransferred(i)  { setTransferred(p => p.map((v, idx) => idx === i ? !v : v)) }

  const attendCount    = attending.filter(Boolean).length
  const total          = items.reduce((s, it) => s + parseNum(it.amount), 0)
  const perHead        = attendCount > 0 ? total / attendCount : 0
  const paidByPerson   = names.map((_, ni) => items.reduce((s, it) => s + (it.payerIdx === ni ? parseNum(it.amount) : 0), 0))
  const net            = names.map((_, ni) => attending[ni] ? paidByPerson[ni] - perHead : null)
  const allSettled     = net.every(n => n === null || Math.abs(n) < 1)
  const owingIndices   = names.map((_, i) => i).filter(i => attending[i] && net[i] !== null && net[i] < -0.5)
  const transferredCount = owingIndices.filter(i => transferred[i]).length
  const allTransferred   = owingIndices.length > 0 && transferredCount === owingIndices.length

  return (
    <div
      style={{ position:'fixed', inset:0, zIndex:200, background:'rgba(0,0,0,0.75)', display:'flex', alignItems:'flex-end', justifyContent:'center', backdropFilter:'blur(6px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); setOpenDropdown(null) }}
    >
      <div style={{
        width:'100%', maxWidth:480,
        background:'linear-gradient(160deg,#13103a,#1b1650)',
        borderRadius:'24px 24px 0 0',
        border:'1.5px solid rgba(255,255,255,0.12)', borderBottom:'none',
        maxHeight:'92dvh', display:'flex', flexDirection:'column',
        boxShadow:'0 -10px 50px rgba(0,0,0,0.5)',
        animation:'slideUp 0.32s cubic-bezier(.22,.68,0,1.2) forwards',
      }}>
        {/* handle */}
        <div style={{ width:40, height:4, borderRadius:2, background:'rgba(255,255,255,0.2)', margin:'12px auto 0' }} />

        {/* header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 20px 10px' }}>
          <div>
            <div style={{ fontSize:17, fontWeight:900, color:'#fff', letterSpacing:.5 }}>💰 Chia tiền</div>
            <div style={{ fontSize:11, color:'rgba(255,255,255,.35)', marginTop:2 }}>Nhập khoản chi · chọn người trả · xem kết quả</div>
          </div>
          <button onClick={onClose} style={{ width:32, height:32, borderRadius:'50%', background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.15)', color:'rgba(255,255,255,0.6)', fontSize:16, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
        </div>

        <div style={{ overflowY:'auto', padding:'0 14px 32px', flex:1 }} onClick={() => setOpenDropdown(null)}>

          {/* ── Items ── */}
          <div style={{ marginBottom:14 }}>
            <div style={{ fontSize:11, color:'rgba(255,255,255,.4)', letterSpacing:1, marginBottom:8, fontWeight:700 }}>CÁC KHOẢN CHI</div>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {items.map((it, idx) => (
                <div key={it.id} style={{ background:'rgba(255,255,255,0.05)', border:'1.5px solid rgba(255,255,255,0.1)', borderRadius:16, padding:'10px 12px' }}>
                  {/* row 1 */}
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
                    <div style={{ width:24, height:24, borderRadius:'50%', background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.12)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:900, color:'rgba(255,255,255,.4)', flexShrink:0 }}>{idx + 1}</div>
                    <input type="text" placeholder="Tên khoản (vd: Lẩu, Bia…)" value={it.label}
                      onChange={e => updateItem(it.id, 'label', e.target.value)}
                      onClick={e => e.stopPropagation()}
                      style={{ flex:1, padding:'8px 10px', background:'rgba(255,255,255,0.07)', border:'1.5px solid rgba(255,255,255,0.1)', borderRadius:10, color:'#fff', fontSize:13, fontWeight:600, minWidth:0 }}
                    />
                    <input type="text" inputMode="numeric" placeholder="0" value={it.amount}
                      onChange={e => updateItem(it.id, 'amount', e.target.value)}
                      onClick={e => e.stopPropagation()}
                      style={{ width:100, padding:'8px 10px', background:'rgba(255,200,0,0.08)', border:'1.5px solid rgba(255,200,0,0.25)', borderRadius:10, color:'#FFD93D', fontSize:13, fontWeight:900, textAlign:'right' }}
                    />
                    {items.length > 1 && (
                      <button onClick={e => { e.stopPropagation(); removeItem(it.id) }}
                        style={{ width:26, height:26, borderRadius:'50%', background:'rgba(255,80,80,0.15)', border:'1px solid rgba(255,80,80,0.25)', color:'#FF8787', fontSize:13, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>×</button>
                    )}
                  </div>

                  {/* row 2 — payer dropdown */}
                  <div style={{ position:'relative' }} onClick={e => e.stopPropagation()}>
                    <button onClick={() => setOpenDropdown(openDropdown === it.id ? null : it.id)} style={{
                      width:'100%', padding:'8px 12px',
                      background: it.payerIdx !== null ? COLORS[it.payerIdx % COLORS.length] + '22' : 'rgba(255,255,255,0.04)',
                      border: `1.5px solid ${it.payerIdx !== null ? COLORS[it.payerIdx % COLORS.length] + '66' : 'rgba(255,255,255,0.1)'}`,
                      borderRadius:10, display:'flex', alignItems:'center', justifyContent:'space-between', cursor:'pointer',
                    }}>
                      <span style={{ fontSize:12, fontWeight:700, color: it.payerIdx !== null ? '#fff' : 'rgba(255,255,255,.35)' }}>
                        {it.payerIdx !== null ? `💳 ${names[it.payerIdx]} trả khoản này` : 'Ai trả khoản này? (tuỳ chọn)'}
                      </span>
                      <span style={{ fontSize:10, color:'rgba(255,255,255,.35)' }}>▾</span>
                    </button>

                    {openDropdown === it.id && (
                      <div style={{ position:'absolute', top:'calc(100% + 4px)', left:0, right:0, background:'#1e1a4a', border:'1.5px solid rgba(255,255,255,0.15)', borderRadius:12, zIndex:50, overflow:'hidden', boxShadow:'0 8px 30px rgba(0,0,0,0.5)' }}>
                        <button onClick={() => { updateItem(it.id, 'payerIdx', null); setOpenDropdown(null) }}
                          style={{ width:'100%', padding:'9px 14px', textAlign:'left', background: it.payerIdx === null ? 'rgba(255,255,255,0.08)' : 'transparent', border:'none', borderBottom:'1px solid rgba(255,255,255,0.07)', color:'rgba(255,255,255,.45)', fontSize:12, cursor:'pointer' }}>
                          — Không chọn
                        </button>
                        {names.map((name, ni) => (
                          <button key={ni} onClick={() => { updateItem(it.id, 'payerIdx', ni); setOpenDropdown(null) }}
                            style={{ width:'100%', padding:'9px 14px', textAlign:'left', background: it.payerIdx === ni ? COLORS[ni % COLORS.length] + '22' : 'transparent', border:'none', borderBottom: ni < names.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none', cursor:'pointer', display:'flex', alignItems:'center', gap:8 }}>
                            <span style={{ width:20, height:20, borderRadius:'50%', background:COLORS[ni % COLORS.length] + '33', border:`1.5px solid ${COLORS[ni % COLORS.length]}`, display:'inline-flex', alignItems:'center', justifyContent:'center', fontSize:9, fontWeight:900, color:COLORS[ni % COLORS.length], flexShrink:0 }}>{ni + 1}</span>
                            <span style={{ fontSize:13, fontWeight:700, color:'#fff' }}>{name}</span>
                            {it.payerIdx === ni && <span style={{ marginLeft:'auto', color:COLORS[ni % COLORS.length], fontSize:12 }}>✓</span>}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <button onClick={addItem} style={{ marginTop:10, width:'100%', padding:'10px', background:'rgba(77,150,255,0.08)', border:'1.5px dashed rgba(77,150,255,0.35)', borderRadius:12, color:'rgba(77,150,255,0.8)', fontSize:13, fontWeight:700, cursor:'pointer' }}>+ Thêm khoản</button>
          </div>

          {/* Total */}
          <div style={{ background:'linear-gradient(135deg,rgba(255,217,61,.12),rgba(255,150,50,.12))', border:'1.5px solid rgba(255,200,0,0.25)', borderRadius:14, padding:'12px 16px', display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
            <div style={{ color:'rgba(255,255,255,.6)', fontSize:13, fontWeight:700 }}>Tổng cộng</div>
            <div style={{ fontSize:22, fontWeight:900, color:'#FFD93D' }}>{fmt(total)} <span style={{ fontSize:11, color:'rgba(255,200,0,.5)' }}>₫</span></div>
          </div>

          {/* Attendees */}
          <div style={{ marginBottom:14 }}>
            <div style={{ fontSize:11, color:'rgba(255,255,255,.4)', letterSpacing:1, marginBottom:8, fontWeight:700, display:'flex', justifyContent:'space-between' }}>
              <span>NGƯỜI THAM DỰ</span>
              <span style={{ color:'rgba(255,255,255,.25)' }}>{attendCount}/{names.length} người</span>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
              {names.map((name, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 12px', background: attending[i] ? COLORS[i % COLORS.length] + '18' : 'rgba(255,255,255,0.04)', border:`1.5px solid ${attending[i] ? COLORS[i % COLORS.length] + '55' : 'rgba(255,255,255,0.08)'}`, borderRadius:14, transition:'all 0.2s' }}>
                  <div style={{ width:28, height:28, borderRadius:'50%', background:COLORS[i % COLORS.length] + '30', border:`2px solid ${COLORS[i % COLORS.length]}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:900, color:COLORS[i % COLORS.length], flexShrink:0 }}>{i + 1}</div>

                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:14, fontWeight:800, color: attending[i] ? '#fff' : 'rgba(255,255,255,.4)' }}>{name}</div>
                    {attending[i] && perHead > 0 && (
                      <div style={{ fontSize:11, color:'rgba(255,200,0,.65)', fontWeight:700, marginTop:1 }}>
                        Phần chia: {fmt(perHead)} ₫
                        {paidByPerson[i] > 0 && <span style={{ color:'rgba(150,220,255,.7)', marginLeft:6 }}>· Đã ứng: {fmt(paidByPerson[i])} ₫</span>}
                      </div>
                    )}
                  </div>

                  {/* Net badge */}
                  {attending[i] && net[i] !== null && total > 0 && (
                    <div style={{ padding:'4px 10px', background: net[i] > 0.5 ? 'rgba(107,203,119,0.18)' : net[i] < -0.5 ? 'rgba(255,100,100,0.18)' : 'rgba(255,255,255,0.08)', border:`1.5px solid ${net[i] > 0.5 ? '#6BCB77' : net[i] < -0.5 ? '#FF8787' : 'rgba(255,255,255,0.15)'}`, borderRadius:20, flexShrink:0, textAlign:'center' }}>
                      {net[i] > 0.5  ? (<><div style={{ fontSize:9, color:'#6BCB77', fontWeight:700, letterSpacing:.5 }}>ĐƯỢC TRẢ LẠI</div><div style={{ fontSize:12, color:'#6BCB77', fontWeight:900 }}>{fmt(net[i])} ₫</div></>) :
                       net[i] < -0.5 ? (<><div style={{ fontSize:9, color:'#FF8787', fontWeight:700, letterSpacing:.5 }}>CÒN NỘP</div><div style={{ fontSize:12, color:'#FF8787', fontWeight:900 }}>{fmt(-net[i])} ₫</div></>) :
                       (<div style={{ fontSize:11, color:'rgba(255,255,255,.4)', fontWeight:700 }}>✓ Hòa</div>)}
                    </div>
                  )}

                  {/* Transfer toggle — only for people who OWE */}
                  {attending[i] && net[i] !== null && net[i] < -0.5 && total > 0 && (
                    <button onClick={() => toggleTransferred(i)} style={{ padding:'5px 10px', background: transferred[i] ? 'rgba(107,203,119,0.2)' : 'rgba(255,255,255,0.06)', border:`1.5px solid ${transferred[i] ? '#6BCB77' : 'rgba(255,255,255,0.15)'}`, borderRadius:20, flexShrink:0, cursor:'pointer', textAlign:'center', minWidth:64 }}>
                      <div style={{ fontSize:9, fontWeight:700, letterSpacing:.3, color: transferred[i] ? '#6BCB77' : 'rgba(255,255,255,.35)' }}>{transferred[i] ? 'ĐÃ CK' : 'CHƯA CK'}</div>
                      <div style={{ fontSize:13, lineHeight:1 }}>{transferred[i] ? '✅' : '💸'}</div>
                    </button>
                  )}

                  {/* Attend toggle */}
                  <button onClick={() => toggleAttend(i)} style={{ width:28, height:28, borderRadius:'50%', background: attending[i] ? 'rgba(255,100,100,0.15)' : 'rgba(77,150,255,0.15)', border:`1.5px solid ${attending[i] ? 'rgba(255,100,100,0.4)' : 'rgba(77,150,255,0.4)'}`, color: attending[i] ? '#FF8787' : '#74C0FC', fontSize:14, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    {attending[i] ? '−' : '+'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          {total > 0 && attendCount > 0 && (
            <div style={{ background:'linear-gradient(135deg,rgba(107,203,119,.08),rgba(77,150,255,.08))', border:'1.5px solid rgba(107,203,119,.3)', borderRadius:18, padding:'14px 16px' }}>
              <div style={{ fontSize:11, color:'rgba(255,255,255,.4)', letterSpacing:1, fontWeight:700, marginBottom:10 }}>KẾT QUẢ CHIA TIỀN</div>

              <Row label="Tổng bill"       value={`${fmt(total)} ₫`}    vc="#FFD93D" />
              <Row label="Người tham dự"   value={`${attendCount} người`} vc="#fff" />
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
                <span style={{ color:'rgba(255,255,255,.7)', fontSize:14, fontWeight:700 }}>Mỗi người trả</span>
                <span style={{ fontSize:20, fontWeight:900, color:'#6BCB77', textShadow:'0 0 12px rgba(107,203,119,.5)' }}>{fmt(perHead)} ₫</span>
              </div>

              <div style={{ height:1, background:'rgba(255,255,255,.08)', marginBottom:10 }} />
              <div style={{ fontSize:11, color:'rgba(255,255,255,.35)', letterSpacing:1, fontWeight:700, marginBottom:8 }}>CHI TIẾT TỪNG NGƯỜI</div>

              {names.map((name, i) => {
                if (!attending[i]) return null
                const n = net[i]
                const owes    = n < -0.5
                const receives = n > 0.5
                return (
                  <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 10px', marginBottom:6, background: owes && transferred[i] ? 'rgba(107,203,119,0.07)' : owes ? 'rgba(255,100,100,0.06)' : 'rgba(255,255,255,0.04)', borderRadius:12, border: owes && transferred[i] ? '1px solid rgba(107,203,119,0.2)' : owes ? '1px solid rgba(255,100,100,0.15)' : '1px solid transparent' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:7, minWidth:0 }}>
                      <div style={{ width:20, height:20, borderRadius:'50%', background:COLORS[i % COLORS.length] + '30', border:`1.5px solid ${COLORS[i % COLORS.length]}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, fontWeight:900, color:COLORS[i % COLORS.length], flexShrink:0 }}>{i+1}</div>
                      <div style={{ minWidth:0 }}>
                        <div style={{ fontSize:13, color:'#fff', fontWeight:700, whiteSpace:'nowrap' }}>{name}</div>
                        {owes    && <div style={{ fontSize:10, color: transferred[i] ? '#6BCB77' : 'rgba(255,150,150,.7)', fontWeight:700, marginTop:1 }}>{transferred[i] ? '✅ Đã chuyển khoản' : '⏳ Chưa chuyển khoản'}</div>}
                        {receives && <div style={{ fontSize:10, color:'rgba(100,200,255,.6)', fontWeight:700, marginTop:1 }}>💳 Chờ nhận tiền</div>}
                      </div>
                    </div>
                    <div style={{ textAlign:'right', flexShrink:0, marginLeft:8 }}>
                      {receives ? <span style={{ fontSize:12, fontWeight:900, color:'#6BCB77' }}>← nhận {fmt(n)} ₫</span>
                       : owes   ? <div style={{ fontSize:12, fontWeight:900, color: transferred[i] ? '#6BCB77' : '#FF8787' }}>→ nộp {fmt(-n)} ₫</div>
                       :          <span style={{ fontSize:12, color:'rgba(255,255,255,.4)' }}>✓ Hòa vốn</span>}
                    </div>
                  </div>
                )
              })}

              {/* Progress bar */}
              {owingIndices.length > 0 && (
                <div style={{ marginTop:10 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
                    <span style={{ fontSize:11, color:'rgba(255,255,255,.4)', fontWeight:700, letterSpacing:.5 }}>TIẾN ĐỘ CHUYỂN KHOẢN</span>
                    <span style={{ fontSize:11, fontWeight:900, color: allTransferred ? '#6BCB77' : '#FFD93D' }}>{transferredCount}/{owingIndices.length}</span>
                  </div>
                  <div style={{ width:'100%', height:6, background:'rgba(255,255,255,0.1)', borderRadius:10, overflow:'hidden' }}>
                    <div style={{ height:'100%', width:`${owingIndices.length > 0 ? (transferredCount / owingIndices.length) * 100 : 0}%`, background: allTransferred ? 'linear-gradient(90deg,#6BCB77,#20C997)' : 'linear-gradient(90deg,#FFD93D,#FF922B)', borderRadius:10, transition:'width 0.4s ease' }} />
                  </div>
                </div>
              )}

              <div style={{ marginTop:10, padding:'10px 14px', background: allTransferred || allSettled ? 'rgba(107,203,119,0.12)' : transferredCount > 0 ? 'rgba(255,200,0,0.08)' : 'rgba(255,100,100,0.08)', borderRadius:12, fontSize:12, fontWeight:800, textAlign:'center', color: allTransferred || allSettled ? '#6BCB77' : transferredCount > 0 ? '#FFD93D' : '#FF8787', border:`1px solid ${allTransferred || allSettled ? 'rgba(107,203,119,0.25)' : transferredCount > 0 ? 'rgba(255,200,0,0.2)' : 'rgba(255,100,100,0.2)'}` }}>
                {allSettled ? '✅ Tất cả hòa vốn!'
                  : allTransferred ? '✅ Tất cả đã chuyển khoản!'
                  : transferredCount > 0 ? `⏳ Còn ${owingIndices.length - transferredCount} người chưa chuyển`
                  : owingIndices.length > 0 ? `💸 ${owingIndices.length} người cần chuyển — bấm 💸 để cập nhật`
                  : '✅ Tất cả hòa vốn!'}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function Row({ label, value, vc }) {
  return (
    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
      <span style={{ color:'rgba(255,255,255,.5)', fontSize:13 }}>{label}</span>
      <span style={{ color:vc, fontWeight:900 }}>{value}</span>
    </div>
  )
}
