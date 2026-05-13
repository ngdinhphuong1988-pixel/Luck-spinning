import { useState, useRef, useCallback } from 'react'
import { COLORS } from '../constants'
import SpinCanvas from './SpinCanvas'
import BillModal from './BillModal'

export default function StepWheel({ names, onReset }) {
  const [spinning, setSpinning] = useState(false)
  const [winner, setWinner] = useState(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showBill, setShowBill] = useState(false)
  const canvasRef = useRef(null)

  const canvasSize = Math.min(
    typeof window !== 'undefined' ? window.innerWidth - 48 : 300,
    320
  )

  const handleSpin = useCallback(() => {
    if (spinning) return
    setWinner(null)
    setShowConfetti(false)
    setSpinning(true)

    canvasRef.current?.spin(w => {
      setWinner(w)
      setSpinning(false)
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3500)
    })
  }, [spinning])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', padding: '0 16px' }}>
      {/* Wheel */}
      <div style={{ position: 'relative', marginTop: 10 }}>
        <div
          style={{
            position: 'absolute',
            top: -20,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
            filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.6))',
            animation: spinning ? 'none' : 'needle-idle 2.2s ease-in-out infinite',
          }}
        >
          <svg width="30" height="42" viewBox="0 0 30 42">
            <polygon points="15,0 27,38 15,30 3,38" fill="#FF6B6B" />
            <polygon points="15,3 25,38 15,28" fill="#FF8787" opacity=".4" />
            <circle cx="15" cy="36" r="6" fill="#FFD93D" />
            <circle cx="15" cy="36" r="3" fill="#FF922B" />
          </svg>
        </div>
        <SpinCanvas ref={canvasRef} names={names} size={canvasSize} />
      </div>

      {/* Buttons row */}
      <div style={{ display: 'flex', gap: 12, marginTop: 18, alignItems: 'center' }}>
        <button
          onClick={handleSpin}
          disabled={spinning}
          style={{
            width: 142,
            height: 142,
            borderRadius: '50%',
            background: spinning
              ? 'linear-gradient(135deg,#444,#2a2a2a)'
              : 'linear-gradient(135deg,#FF6B6B,#FF922B,#FFD93D)',
            border: 'none',
            cursor: spinning ? 'not-allowed' : 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            boxShadow: spinning
              ? 'none'
              : '0 8px 38px rgba(255,100,50,0.4),0 0 0 8px rgba(255,107,107,0.1)',
            animation: spinning ? 'none' : 'pulse 1.8s ease-in-out infinite',
            transition: 'all 0.3s',
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 28 }}>{spinning ? '⏳' : '🎯'}</span>
          <span style={{ fontSize: 12, fontWeight: 900, color: '#fff', letterSpacing: 1 }}>
            {spinning ? 'Đang quay...' : 'QUAY!'}
          </span>
        </button>

        <button
          onClick={() => setShowBill(true)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'linear-gradient(135deg,rgba(107,203,119,0.15),rgba(77,150,255,0.15))',
            border: '2px solid rgba(107,203,119,0.4)',
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(107,203,119,0.2)',
          }}
        >
          <span style={{ fontSize: 24 }}>💰</span>
          <span style={{ fontSize: 9, fontWeight: 900, color: '#6BCB77', letterSpacing: 0.5 }}>
            CHIA TIỀN
          </span>
        </button>
      </div>

      {/* Winner banner */}
      {winner && (
        <div
          style={{
            marginTop: 18,
            padding: '16px 26px',
            background: 'linear-gradient(135deg,rgba(255,217,61,.12),rgba(255,107,107,.12))',
            border: '2px solid rgba(255,217,61,.4)',
            borderRadius: 20,
            textAlign: 'center',
            animation: 'winner-pop 0.55s cubic-bezier(.175,.885,.32,1.275) forwards',
            maxWidth: 280,
            width: '100%',
          }}
        >
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,.45)', letterSpacing: 2, marginBottom: 5 }}>
            🏆 NGƯỜI CHIẾN THẮNG
          </div>
          <div
            style={{
              fontSize: 24,
              fontWeight: 900,
              color: '#FFD93D',
              fontFamily: "'Orbitron', sans-serif",
              textShadow: '0 0 16px rgba(255,217,61,.6)',
              wordBreak: 'break-word',
            }}
          >
            {winner}
          </div>
          <div style={{ fontSize: 18, marginTop: 5 }}>🎉🎊🎈</div>
        </div>
      )}

      <button
        onClick={onReset}
        style={{
          marginTop: 14,
          padding: '10px 24px',
          background: 'rgba(255,255,255,0.07)',
          border: '1.5px solid rgba(255,255,255,0.16)',
          borderRadius: 50,
          fontSize: 12,
          fontWeight: 700,
          color: 'rgba(255,255,255,0.5)',
          cursor: 'pointer',
        }}
      >
        ← Chơi lại
      </button>

      {/* Player chips */}
      <div
        style={{
          marginTop: 16,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 7,
          justifyContent: 'center',
          maxWidth: 310,
          padding: '0 8px',
        }}
      >
        {names.map((n, i) => (
          <span
            key={i}
            style={{
              padding: '4px 12px',
              background: winner === n ? COLORS[i % COLORS.length] + '40' : COLORS[i % COLORS.length] + '1a',
              border: `1.5px solid ${COLORS[i % COLORS.length]}${winner === n ? 'aa' : '40'}`,
              borderRadius: 20,
              color: '#fff',
              fontSize: 12,
              fontWeight: 700,
              boxShadow: winner === n ? `0 0 8px ${COLORS[i % COLORS.length]}50` : 'none',
            }}
          >
            {winner === n ? '🏆 ' : ''}{n}
          </span>
        ))}
      </div>

      {showBill && <BillModal names={names} onClose={() => setShowBill(false)} />}
    </div>
  )
}
