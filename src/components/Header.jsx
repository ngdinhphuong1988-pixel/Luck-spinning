export default function Header() {
  return (
    <div style={{ width:'100%', padding:'26px 20px 14px', textAlign:'center' }}>
      <div style={{
        fontFamily:"'Orbitron', sans-serif", fontSize:21, fontWeight:900,
        background:'linear-gradient(90deg,#FFD93D,#FF6B6B,#4D96FF,#6BCB77)',
        backgroundSize:'300% auto',
        WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
        animation:'shimmer 4s linear infinite', letterSpacing:2,
      }}>🎯 LUCKY SPIN</div>
      <div style={{ color:'rgba(255,255,255,0.3)', fontSize:11, marginTop:3, letterSpacing:1 }}>
        Vòng quay may mắn
      </div>
    </div>
  )
}
