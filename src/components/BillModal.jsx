import { useState } from 'react'
import { COLORS } from '../constants'
import { fmt, parseNum } from '../utils'

export default function BillModal({ names, onClose }) {
  const [items, setItems] = useState([{ id: 1, label: '', amount: '' }])
  const [attending, setAttending] = useState(names.map(() => true))
  const [paid, setPaid] = useState(names.map(() => false))

  function addItem() {
    setItems(prev => [...prev, { id: Date.now(), label: '', amount: '' }])
  }
  function removeItem(id) {
    setItems(prev => prev.filter(it => it.id !== id))
  }
  function updateItem(id, field, val) {
    setItems(prev => prev.map(it => (it.id === id ? { ...it, [field]: val } : it)))
  }
  function toggleAttend(i) {
    setAttending(prev => prev.map((v, idx) => (idx === i ? !v : v)))
  }
  function togglePaid(i) {
    setPaid(prev => prev.map((v, idx) => (idx === i ? !v : v)))
  }

  const total = items.reduce((s, it) => s + parseNum(it.amount), 0)
  const attendCount = attending.filter(Boolean).length
  const perHead = attendCount > 0 ? total / attendCount : 0
  const paidCount = paid.filter((v, i) => v && attending[i]).length

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        background: 'rgba(0,0,0,0.75)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        backdropFilter: 'blur(6px)',
      }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 480,
          background: 'linear-gradient(160deg,#13103a,#1b1650)',
          borderRadius: '24px 24px 0 0',
          border: '1.5px solid rgba(255,255,255,0.12)',
          borderBottom: 'none',
          maxHeight: '92dvh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 -10px 50px rgba(0,0,0,0.5)',
          animation: 'slideUp 0.32s cubic-bezier(.22,.68,0,1.2) forwards',
        }}
      >
        {/* drag handle */}
        <div style={{ width: 40, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.2)', margin: '12px auto 0' }} />

        {/* header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px 10px' }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 900, color: '#fff', letterSpacing: 0.5 }}>💰 Chia tiền</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,.35)', marginTop: 2 }}>
              Nhập các khoản chi và chọn người tham dự
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: 'rgba(255,255,255,0.6)', fontSize: 16,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >✕</button>
        </div>

        <div style={{ overflowY: 'auto', padding: '0 16px 32px', flex: 1 }}>

          {/* Items */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,.4)', letterSpacing: 1, marginBottom: 8, fontWeight: 700 }}>
              CÁC KHOẢN CHI
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {items.map((it, idx) => (
                <div key={it.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div
                    style={{
                      width: 26, height: 26, borderRadius: '50%',
                      background: 'rgba(255,255,255,0.07)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 11, fontWeight: 900, color: 'rgba(255,255,255,.4)', flexShrink: 0,
                    }}
                  >{idx + 1}</div>
                  <input
                    type="text"
                    placeholder="Tên khoản (vd: Lẩu, Bia...)"
                    value={it.label}
                    onChange={e => updateItem(it.id, 'label', e.target.value)}
                    style={{
                      flex: 1, padding: '10px 12px',
                      background: 'rgba(255,255,255,0.07)',
                      border: '1.5px solid rgba(255,255,255,0.12)',
                      borderRadius: 12, color: '#fff', fontSize: 13, fontWeight: 600, minWidth: 0,
                    }}
                  />
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="0"
                    value={it.amount}
                    onChange={e => updateItem(it.id, 'amount', e.target.value)}
                    style={{
                      width: 110, padding: '10px 12px',
                      background: 'rgba(255,200,0,0.08)',
                      border: '1.5px solid rgba(255,200,0,0.25)',
                      borderRadius: 12, color: '#FFD93D',
                      fontSize: 13, fontWeight: 900, textAlign: 'right',
                    }}
                  />
                  {items.length > 1 && (
                    <button
                      onClick={() => removeItem(it.id)}
                      style={{
                        width: 28, height: 28, borderRadius: '50%',
                        background: 'rgba(255,80,80,0.15)',
                        border: '1px solid rgba(255,80,80,0.25)',
                        color: '#FF8787', fontSize: 14, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}
                    >×</button>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={addItem}
              style={{
                marginTop: 10, width: '100%', padding: '10px',
                background: 'rgba(77,150,255,0.08)',
                border: '1.5px dashed rgba(77,150,255,0.35)',
                borderRadius: 12, color: 'rgba(77,150,255,0.8)',
                fontSize: 13, fontWeight: 700, cursor: 'pointer',
              }}
            >+ Thêm khoản</button>
          </div>

          {/* Total */}
          <div
            style={{
              background: 'linear-gradient(135deg,rgba(255,217,61,.12),rgba(255,150,50,.12))',
              border: '1.5px solid rgba(255,200,0,0.25)',
              borderRadius: 16, padding: '14px 18px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              marginBottom: 16,
            }}
          >
            <div style={{ color: 'rgba(255,255,255,.6)', fontSize: 13, fontWeight: 700 }}>Tổng cộng</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: '#FFD93D', letterSpacing: 0.5 }}>
              {fmt(total)} <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,200,0,.6)' }}>₫</span>
            </div>
          </div>

          {/* Attendees */}
          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                fontSize: 12, color: 'rgba(255,255,255,.4)', letterSpacing: 1,
                marginBottom: 8, fontWeight: 700,
                display: 'flex', justifyContent: 'space-between',
              }}
            >
              <span>NGƯỜI THAM DỰ</span>
              <span style={{ color: 'rgba(255,255,255,.25)' }}>{attendCount}/{names.length} người</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {names.map((name, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 14px',
                    background: attending[i] ? COLORS[i % COLORS.length] + '18' : 'rgba(255,255,255,0.04)',
                    border: `1.5px solid ${attending[i] ? COLORS[i % COLORS.length] + '55' : 'rgba(255,255,255,0.08)'}`,
                    borderRadius: 14, transition: 'all 0.2s',
                  }}
                >
                  <div
                    style={{
                      width: 28, height: 28, borderRadius: '50%',
                      background: COLORS[i % COLORS.length] + '30',
                      border: `2px solid ${COLORS[i % COLORS.length]}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 11, fontWeight: 900, color: COLORS[i % COLORS.length], flexShrink: 0,
                    }}
                  >{i + 1}</div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 14, fontWeight: 800,
                        color: attending[i] ? '#fff' : 'rgba(255,255,255,.4)',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      }}
                    >{name}</div>
                    {attending[i] && perHead > 0 && (
                      <div style={{ fontSize: 12, color: 'rgba(255,200,0,.7)', fontWeight: 700, marginTop: 1 }}>
                        {fmt(perHead)} ₫
                      </div>
                    )}
                  </div>

                  {attending[i] && (
                    <button
                      onClick={() => togglePaid(i)}
                      style={{
                        padding: '5px 11px',
                        background: paid[i] ? 'rgba(107,203,119,0.2)' : 'rgba(255,255,255,0.07)',
                        border: `1.5px solid ${paid[i] ? '#6BCB77' : 'rgba(255,255,255,0.15)'}`,
                        borderRadius: 20, fontSize: 11, fontWeight: 800,
                        color: paid[i] ? '#6BCB77' : 'rgba(255,255,255,.4)',
                        cursor: 'pointer', flexShrink: 0, whiteSpace: 'nowrap',
                      }}
                    >{paid[i] ? '✓ Đã trả' : 'Chưa trả'}</button>
                  )}

                  <button
                    onClick={() => toggleAttend(i)}
                    style={{
                      width: 30, height: 30, borderRadius: '50%',
                      background: attending[i] ? 'rgba(255,100,100,0.15)' : 'rgba(77,150,255,0.15)',
                      border: `1.5px solid ${attending[i] ? 'rgba(255,100,100,0.4)' : 'rgba(77,150,255,0.4)'}`,
                      color: attending[i] ? '#FF8787' : '#74C0FC',
                      fontSize: 14, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}
                  >{attending[i] ? '−' : '+'}</button>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          {total > 0 && attendCount > 0 && (
            <div
              style={{
                background: 'linear-gradient(135deg,rgba(107,203,119,.1),rgba(77,150,255,.1))',
                border: '1.5px solid rgba(107,203,119,.3)',
                borderRadius: 18, padding: '16px 18px',
              }}
            >
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,.45)', letterSpacing: 1, fontWeight: 700, marginBottom: 12 }}>
                KẾT QUẢ CHIA TIỀN
              </div>

              <Row label="Tổng bill" value={`${fmt(total)} ₫`} valueColor="#FFD93D" />
              <Row label="Số người tham dự" value={`${attendCount} người`} valueColor="#fff" />

              <div style={{ height: 1, background: 'rgba(255,255,255,0.1)', margin: '10px 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'rgba(255,255,255,.7)', fontSize: 14, fontWeight: 700 }}>Mỗi người trả</span>
                <span style={{ fontSize: 22, fontWeight: 900, color: '#6BCB77', textShadow: '0 0 14px rgba(107,203,119,.5)' }}>
                  {fmt(perHead)} ₫
                </span>
              </div>

              {paid.some(Boolean) && (
                <div style={{ marginTop: 12 }}>
                  <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', marginBottom: 10 }} />
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,.3)', letterSpacing: 1, marginBottom: 6, fontWeight: 700 }}>
                    TRẠNG THÁI
                  </div>
                  {names.map((name, i) =>
                    attending[i] ? (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                        <span style={{ fontSize: 12, color: 'rgba(255,255,255,.5)' }}>{name}</span>
                        <span style={{ fontSize: 11, fontWeight: 800, color: paid[i] ? '#6BCB77' : '#FF8787' }}>
                          {paid[i] ? `✓ ${fmt(perHead)} ₫` : `⏳ ${fmt(perHead)} ₫`}
                        </span>
                      </div>
                    ) : null
                  )}
                  <div
                    style={{
                      marginTop: 8, padding: '8px 12px',
                      background: paidCount === attendCount ? 'rgba(107,203,119,0.12)' : 'rgba(255,200,0,0.08)',
                      borderRadius: 10, fontSize: 12, fontWeight: 800, textAlign: 'center',
                      color: paidCount === attendCount ? '#6BCB77' : '#FFD93D',
                    }}
                  >
                    {paidCount === attendCount
                      ? '✅ Tất cả đã thanh toán!'
                      : `⏳ Còn ${attendCount - paidCount} người chưa trả`}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function Row({ label, value, valueColor }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
      <span style={{ color: 'rgba(255,255,255,.55)', fontSize: 13 }}>{label}</span>
      <span style={{ color: valueColor, fontWeight: 900, fontSize: 15 }}>{value}</span>
    </div>
  )
}
