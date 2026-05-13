export function fmt(n) {
  if (!n && n !== 0) return ''
  return Math.round(n).toLocaleString('vi-VN')
}

export function parseNum(s) {
  const cleaned = String(s).replace(/[.,\s]/g, '')
  const val = parseFloat(cleaned)
  return isNaN(val) ? 0 : val
}
