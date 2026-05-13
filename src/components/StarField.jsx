import { STARS } from '../constants'

export default function StarField() {
  return (
    <>
      {STARS.map(s => (
        <div
          key={s.id}
          style={{
            position: 'fixed',
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            borderRadius: '50%',
            background: '#fff',
            opacity: 0.4,
            animation: `twinkle ${s.dur}s ${s.delay}s ease-in-out infinite alternate`,
            pointerEvents: 'none',
          }}
        />
      ))}
    </>
  )
}
