'use client'
import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { MENU_ITEMS, TABLES } from '@/lib/menu'

function OrderForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const tableId = searchParams.get('table') || 'OUT'
  const tableInfo = TABLES.find(t => t.id === tableId) || { id: tableId, label: tableId }

  const [cart, setCart] = useState(
    MENU_ITEMS.map(item => ({ ...item, quantity: 0, size: 'half' }))
  )
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [popup, setPopup] = useState(null)

  const updateItem = (idx, field, value) => {
    setCart(prev => prev.map((item, i) => i === idx ? { ...item, [field]: value } : item))
  }

  const getItemPrice = (item) => item.size === 'full' ? item.full : item.half
  const total = cart.reduce((sum, item) => sum + (item.quantity > 0 ? getItemPrice(item) * item.quantity : 0), 0)
  const hasItems = cart.some(i => i.quantity > 0)

  const handleSubmit = async () => {
    if (!hasItems) return
    setLoading(true)
    const orderItems = cart.filter(i => i.quantity > 0).map(i => ({
      name: `${i.name} (${i.size === 'full' ? 'Full' : 'Half'})`,
      price: getItemPrice(i),
      quantity: i.quantity,
      image: i.image,
    }))

    // Show food popup
    const firstItem = orderItems[0]
    setPopup(firstItem)
    setTimeout(() => setPopup(null), 3000)

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tableNumber: tableId,
          customerName: name || 'Guest',
          items: orderItems,
        }),
      })
      const order = await res.json()
      setTimeout(() => {
        router.push(`/order/success?num=${order.orderNumber}&eta=${order.estimatedTime}&name=${encodeURIComponent(name || 'Guest')}`)
      }, 2500)
    } catch (e) {
      alert('Order failed! Please try again.')
      setLoading(false)
    }
  }

  return (
    <>
      {popup && (
        <div className="food-popup-overlay" onClick={() => setPopup(null)}>
          <div className="food-popup">
            <img src={popup.image} alt={popup.name} />
            <div className="food-popup-text">🔥 {popup.name} — Coming right up!</div>
          </div>
        </div>
      )}

      <nav className="navbar">
        <Link href="/" className="navbar-brand">🔥 <span>Bunty</span> Chaap</Link>
        <div className="navbar-links">
          <Link href="/">Home</Link>
        </div>
      </nav>

      <div className="order-page">
        <div className="order-container">
          <div className="order-header">
            <h1>Place Your Order</h1>
            <div className="table-badge">📍 {tableInfo.label}</div>
          </div>

          {cart.map((item, idx) => (
            <div key={item.id} className="order-item">
              <img src={item.image} alt={item.name} className="order-item-img" />
              <div className="order-item-info">
                <div className="order-item-name">{item.emoji} {item.name}</div>
                <div className="order-item-price">
                  Half: ₹{item.half} | Full: ₹{item.full}
                </div>
              </div>
              <div className="order-item-controls" style={{display:'flex', flexDirection:'column', gap:'8px'}}>
                <div className="size-toggle">
                  <button className={`size-btn ${item.size === 'half' ? 'active' : ''}`}
                    onClick={() => updateItem(idx, 'size', 'half')}>Half</button>
                  <button className={`size-btn ${item.size === 'full' ? 'active' : ''}`}
                    onClick={() => updateItem(idx, 'size', 'full')}>Full</button>
                </div>
                <div className="qty-controls">
                  <button className="qty-btn" onClick={() => updateItem(idx, 'quantity', Math.max(0, item.quantity - 1))}>−</button>
                  <span className="qty-num">{item.quantity}</span>
                  <button className="qty-btn" onClick={() => updateItem(idx, 'quantity', item.quantity + 1)}>+</button>
                </div>
              </div>
            </div>
          ))}

          <div className="order-form-section">
            <div className="form-group">
              <label>Your Name (optional)</label>
              <input className="form-input" placeholder="Enter your name"
                value={name} onChange={e => setName(e.target.value)} />
            </div>
          </div>

          {hasItems && (
            <div className="order-summary">
              {cart.filter(i => i.quantity > 0).map(i => (
                <div key={i.id} className="order-summary-row">
                  <span>{i.name} ({i.size}) × {i.quantity}</span>
                  <span>₹{getItemPrice(i) * i.quantity}</span>
                </div>
              ))}
              <div className="order-summary-row order-summary-total">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </div>
          )}

          <button className="submit-order" disabled={!hasItems || loading}
            onClick={handleSubmit}>
            {loading ? '🔄 Placing Order...' : `🛒 Place Order — ₹${total}`}
          </button>
        </div>
      </div>
    </>
  )
}

export default function OrderPage() {
  return (
    <Suspense fallback={<div className="loading"><div className="spinner" /></div>}>
      <OrderForm />
    </Suspense>
  )
}
