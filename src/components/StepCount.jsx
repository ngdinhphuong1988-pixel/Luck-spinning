import { NUM_OPTIONS } from '../constants'

export default function StepCount({ onSelect }) {
  return (
    <div
      style={{
        marginTop: 20,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 20,
        padding: '0 24px',
        width: '100%',
      }}
    >
      <div style={{ fontSize: 46, filter: 'drop-shadow(0 0 16px rgba(255,217,61,.5))' }}>🎮</div>
      <div style={{ color: '#fff', fontSize: 18, fontWeight: 700 }}>Chọn số người chơi</div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 10,
          width: '100%',
          maxWidth: 320,
        }}
      >
        {NUM_OPTIONS.map(n => (
          <button
            key={n}
            onClick={() => onSelect(n)}
            style={{
              padding: '15px 0',
              background: 'rgba(255,255,255,0.07)',
              border: '1.5px solid rgba(255,255,255,0.14)',
              borderRadius: 16,
              color: '#fff',
              fontSize: 20,
              fontWeight: 900,
              cursor: 'pointer',
            }}
          >
            {n}
          </button>
        ))}
      </div>

      <div style={{ color: 'rgba(255,255,255,0.28)', fontSize: 12 }}>Chạm vào số để chọn</div>
    </div>
  )
}
