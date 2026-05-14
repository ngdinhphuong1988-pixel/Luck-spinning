import { useRef, useEffect, useImperativeHandle, forwardRef } from 'react'
import { COLORS } from '../constants'

const SpinCanvas = forwardRef(function SpinCanvas({ names, size }, ref) {
  const canvasRef = useRef(null)
  const rotRef    = useRef(0)
  const animRef   = useRef(null)

  function drawWheel(angle, nameList) {
    const canvas = canvasRef.current
    if (!canvas) return
    const n = nameList || names
    if (!n || n.length < 2) return
    const ctx = canvas.getContext('2d')
    const cx = canvas.width  / 2
    const cy = canvas.height / 2
    const r  = cx - 4
    const slice = (2 * Math.PI) / n.length

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // ── Slices ──
    n.forEach((name, i) => {
      const start = angle + i * slice
      const end   = start + slice
      const mid   = start + slice / 2

      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.arc(cx, cy, r, start, end)
      ctx.closePath()
      ctx.fillStyle   = COLORS[i % COLORS.length]
      ctx.fill()
      ctx.strokeStyle = 'rgba(0,0,0,0.18)'
      ctx.lineWidth   = 2
      ctx.stroke()

      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(mid)
      ctx.textAlign   = 'right'
      ctx.fillStyle   = '#fff'
      ctx.font        = `bold ${n.length > 8 ? 11 : 13}px 'Nunito', sans-serif`
      ctx.shadowColor = 'rgba(0,0,0,0.6)'
      ctx.shadowBlur  = 4
      const maxLen = n.length > 8 ? 8 : 11
      const label  = name.length > maxLen ? name.slice(0, maxLen - 1) + '…' : name
      ctx.fillText(label, r - 14, 5)
      ctx.restore()
    })

    // Outer ring
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, 2 * Math.PI)
    ctx.strokeStyle = 'rgba(255,255,255,0.15)'
    ctx.lineWidth   = 3
    ctx.stroke()

    // Center hub
    const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, 22)
    cg.addColorStop(0, '#fff')
    cg.addColorStop(1, '#ccc')
    ctx.beginPath()
    ctx.arc(cx, cy, 22, 0, 2 * Math.PI)
    ctx.fillStyle   = cg
    ctx.shadowColor = 'rgba(0,0,0,0.4)'
    ctx.shadowBlur  = 8
    ctx.fill()
    ctx.shadowBlur  = 0
    ctx.strokeStyle = '#bbb'
    ctx.lineWidth   = 2
    ctx.stroke()

    // ── Needle (fixed, points UP) ──
    const needleLen  = r * 0.72
    const needleBase = 14

    ctx.save()
    ctx.translate(cx, cy)

    ctx.beginPath()
    ctx.moveTo(0, -needleLen)
    ctx.lineTo( needleBase, 10)
    ctx.lineTo(-needleBase, 10)
    ctx.closePath()
    ctx.fillStyle   = '#FF3B3B'
    ctx.shadowColor = 'rgba(0,0,0,0.5)'
    ctx.shadowBlur  = 8
    ctx.fill()

    ctx.beginPath()
    ctx.moveTo(0, -needleLen + 6)
    ctx.lineTo(6, 8)
    ctx.lineTo(0, 6)
    ctx.closePath()
    ctx.fillStyle  = 'rgba(255,120,120,0.5)'
    ctx.shadowBlur = 0
    ctx.fill()

    ctx.beginPath()
    ctx.arc(0, 0, 12, 0, 2 * Math.PI)
    ctx.fillStyle   = '#FF3B3B'
    ctx.shadowColor = 'rgba(0,0,0,0.3)'
    ctx.shadowBlur  = 4
    ctx.fill()
    ctx.shadowBlur  = 0
    ctx.strokeStyle = '#fff'
    ctx.lineWidth   = 2
    ctx.stroke()

    ctx.beginPath()
    ctx.arc(0, 0, 4, 0, 2 * Math.PI)
    ctx.fillStyle = '#fff'
    ctx.fill()

    ctx.restore()
  }

  useEffect(() => { drawWheel(rotRef.current, names) }, [names, size])

  useImperativeHandle(ref, () => ({
    spin(onWinner) {
      const n     = names.length
      const slice = (2 * Math.PI) / n
      const totalAngle  = (6 + Math.random() * 4) * 2 * Math.PI
      const startAngle  = rotRef.current
      const duration    = 3000
      const startTime   = performance.now()

      function easeOut(t) { return 1 - Math.pow(1 - t, 4) }

      function animate(now) {
        const t       = Math.min((now - startTime) / duration, 1)
        const current = startAngle + totalAngle * easeOut(t)
        rotRef.current = current
        drawWheel(current, names)

        if (t < 1) {
          animRef.current = requestAnimationFrame(animate)
        } else {
          const norm         = ((current % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)
          const needleInWheel = (2 * Math.PI - norm + 3 * Math.PI / 2) % (2 * Math.PI)
          const wi           = Math.floor(needleInWheel / slice) % n
          onWinner(names[wi])
        }
      }
      animRef.current = requestAnimationFrame(animate)
    },
    reset() {
      rotRef.current = 0
      drawWheel(0, names)
    },
  }))

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      style={{ borderRadius:'50%', display:'block', boxShadow:'0 0 40px rgba(77,150,255,0.15)' }}
    />
  )
})

export default SpinCanvas
