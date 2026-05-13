import { COLORS } from '../constants'

export default function StepNames({ numPlayers, nameInputs, errors, onChange, onBack, onSubmit }) {
  return (
    <div style={{ marginTop:6, display:'flex', flexDirection:'column', alignItems:'center', gap:10, padding:'0 18px', width:'100%' }}>
      <div style={{ color:'rgba(255,255,255,0.45)', fontSize:13, letterSpacing:1, marginBottom:2 }}>
        Nhập tên {numPlayers} người chơi
      </div>

      <div style={{ width:'100%', maxWidth:360, display:'flex', flexDirection:'column', gap:9 }}>
        {nameInputs.map((val, i) => (
          <div key={i} style={{ position:'relative', display:'flex', alignItems:'center' }}>
            <div style={{
              position:'absolute', left:12,
              width:26, height:26, borderRadius:'50%',
              background:COLORS[i % COLORS.length] + '25',
              border:`2px solid ${errors[i] ? '#FF6B6B' : COLORS[i % COLORS.length]}`,
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:11, fontWeight:900,
              color:errors[i] ? '#FF6B6B' : COLORS[i % COLORS.length],
              flexShrink:0, zIndex:1,
            }}>{i + 1}</div>
            <input
              autoFocus={i === 0}
              type="text"
              value={val}
              onChange={e => onChange(i, e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') onSubmit() }}
              placeholder={`Người chơi ${i + 1}`}
              style={{
                width:'100%', padding:'12px 14px 12px 48px',
                fontSize:15, fontWeight:700,
                background:errors[i] ? 'rgba(255,80,80,0.07)' : 'rgba(255,255,255,0.07)',
                border:errors[i]
                  ? '2px solid rgba(255,100,100,0.55)'
                  : `2px solid ${val.trim() ? COLORS[i % COLORS.length] + '60' : 'rgba(255,255,255,0.11)'}`,
                borderRadius:14, color:'#fff',
                animation:errors[i] ? 'shake 0.35s ease' : 'none',
              }}
            />
            {errors[i] && (
              <div style={{ position:'absolute', right:11, fontSize:10, color:'#FF8787', fontWeight:700, whiteSpace:'nowrap' }}>
                Bắt buộc!
              </div>
            )}
          </div>
        ))}
      </div>

      {errors.some(Boolean) && (
        <div style={{
          color:'#FF8787', fontSize:12, fontWeight:700,
          background:'rgba(255,80,80,0.1)', border:'1px solid rgba(255,80,80,0.25)',
          borderRadius:12, padding:'7px 16px', marginTop:2,
        }}>⚠️ Vui lòng nhập đủ tên tất cả người chơi</div>
      )}

      <div style={{ display:'flex', gap:10, marginTop:6 }}>
        <button onClick={onBack} style={{
          padding:'12px 22px', background:'rgba(255,255,255,0.07)',
          border:'1.5px solid rgba(255,255,255,0.16)', borderRadius:50,
          fontSize:13, fontWeight:700, color:'rgba(255,255,255,0.55)', cursor:'pointer',
        }}>← Quay lại</button>
        <button onClick={onSubmit} style={{
          padding:'12px 34px', background:'linear-gradient(135deg,#FFD93D,#FF922B)',
          border:'none', borderRadius:50, fontSize:15, fontWeight:900,
          color:'#1a1a4e', cursor:'pointer',
          boxShadow:'0 5px 22px rgba(255,170,0,0.35)',
          animation:'pulse 2s ease-in-out infinite',
        }}>Bắt đầu 🎯</button>
      </div>
    </div>
  )
}
