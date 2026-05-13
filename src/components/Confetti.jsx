import { useMemo } from 'react'
import { COLORS } from '../constants'

export default function Confetti({ active }) {
  const items = useMemo(() => {
    if (!active) return []
    return Array.from({ length: 36 }, (_, i) => ({
      id: i,
      left:  `${Math.random() * 100}%`,
      color: COLORS[i % COLORS.length],
      delay: Math.random() * 0.5,
      size:  Math.random() * 9 + 6,
      dur:   Math.random() * 1 + 1.5,
    }))
  }, [active])

  if (!active) return null
  return (
    <>
      {items.map(c => (
        <div key={c.id} style={{
          position:'fixed', top:'-10px', left:c.left,
          width:c.size, height:c.size * .45,
          background:c.color, borderRadius:'2px',
          animation:`fall ${c.dur}s ${c.delay}s ease-in forwards`,
          zIndex:100, pointerEvents:'none',
        }} />
      ))}
    </>
  )
}
