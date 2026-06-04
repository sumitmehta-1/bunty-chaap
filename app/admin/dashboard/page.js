'use client'
import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { MENU_ITEMS, TABLES } from '@/lib/menu'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [orders, setOrders] = useState([])
  const [filter, setFilter] = useState('ALL')
  const [loading, setLoading] = useState(true)
  const [showManual, setShowManual] = useState(false)
  const [manualTable, setManualTable] = useState('T1')
  const [manualName, setManualName] = useState('')
  const [manualCart, setManualCart] = useState(
    MENU_ITEMS.map(item => ({ ...item, quantity: 0, size: 'half' }))
  )

  const fetchOrders = useCallback(async () => {
    const res = await fetch('/api/orders')
    const data = await res.json()
    setOrders(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin/login')
    if (status === 'authenticated') {
      fetchOrders()
      const interval = setInterval(fetchOrders, 5000)
      return () => clearInterval(interval)
    }
  }, [status, router, fetchOrders])

  const updateStatus = async (id, newStatus) => {
    await fetch(`/api/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    fetchOrders()
  }

  const deleteOrder = async (id) => {
    if (!confirm('Delete this order?')) return
    await fetch(`/api/orders/${id}`, { method: 'DELETE' })
    fetchOrders()
  }

  const submitManualOrder = async () => {
    const items = manualCart.filter(i => i.quantity > 0).map(i => ({
      name: `${i.name} (${i.size === 'full' ? 'Full' : 'Half'})`,
      price: i.size === 'full' ? i.full : i.half,
      quantity: i.quantity,
      image: i.image,
    }))
    if (items.length === 0) return alert('Add at least one item!')
    await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tableNumber: manualTable,
        customerName: manualName || 'Walk-in',
        items, isManual: true,
      }),
    })
    setManualCart(MENU_ITEMS.map(item => ({ ...item, quantity: 0, size: 'half' })))
    setManualName('')
    setShowManual(false)
    fetchOrders()
  }

  const todayOrders = orders.filter(o => new Date(o.createdAt).toDateString() === new Date().toDateString())
  const todayRevenue = todayOrders.reduce((s, o) => s + o.totalAmount, 0)
  const pendingCount = orders.filter(o => o.status === 'PENDING' || o.status === 'PREPARING').length

  const filtered = filter === 'ALL' ? orders : orders.filter(o => o.status === filter)
  const statuses = ['PENDING', 'PREPARING', 'READY', 'SERVED']

  if (status === 'loading' || loading) return <div className="loading"><div className="spinner" /></div>
  if (status === 'unauthenticated') return null

  return (
    <>
      <nav className="navbar">
        <Link href="/" className="navbar-brand">🔥 <span>Bunty</span> Chaap</Link>
        <div className="navbar-links">
          <Link href="/admin/dashboard">Dashboard</Link>
          <Link href="/admin/expenses">Expenses</Link>
          <Link href="/admin/tables">QR Codes</Link>
        </div>
      </nav>

      <div style={{ paddingTop: '90px', maxWidth: '1200px', margin: '0 auto', padding: '90px 24px 60px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '24px' }}>📊 Dashboard</h1>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <div className="stat-value">{todayOrders.length}</div>
            <div className="stat-label">Today&apos;s Orders</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-value">₹{todayRevenue}</div>
            <div className="stat-label">Today&apos;s Revenue</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-value">{pendingCount}</div>
            <div className="stat-label">In Queue</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <div className="stat-value">{orders.length}</div>
            <div className="stat-label">Total Orders</div>
          </div>
        </div>

        <button className="btn-primary" style={{ marginBottom: '24px' }}
          onClick={() => setShowManual(!showManual)}>
          {showManual ? '✕ Close' : '✍️ Add Manual Order'}
        </button>

        {showManual && (
          <div className="manual-order-form">
            <h3>✍️ New Manual Order</h3>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
              <div className="form-group" style={{ flex: 1, minWidth: '200px' }}>
                <label>Table</label>
                <select className="form-input" value={manualTable}
                  onChange={e => setManualTable(e.target.value)}>
                  {TABLES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ flex: 1, minWidth: '200px' }}>
                <label>Customer Name</label>
                <input className="form-input" value={manualName}
                  onChange={e => setManualName(e.target.value)} placeholder="Walk-in customer" />
              </div>
            </div>
            <div className="manual-items-grid">
              {manualCart.map((item, idx) => (
                <div key={item.id} className="manual-item">
                  <div className="manual-item-name">{item.emoji} {item.name}</div>
                  <div className="size-toggle" style={{ justifyContent: 'center', marginBottom: '8px' }}>
                    <button className={`size-btn ${item.size === 'half' ? 'active' : ''}`}
                      onClick={() => setManualCart(p => p.map((it, i) => i === idx ? { ...it, size: 'half' } : it))}>H ₹{item.half}</button>
                    <button className={`size-btn ${item.size === 'full' ? 'active' : ''}`}
                      onClick={() => setManualCart(p => p.map((it, i) => i === idx ? { ...it, size: 'full' } : it))}>F ₹{item.full}</button>
                  </div>
                  <div className="qty-controls" style={{ justifyContent: 'center' }}>
                    <button className="qty-btn" onClick={() => setManualCart(p => p.map((it, i) => i === idx ? { ...it, quantity: Math.max(0, it.quantity - 1) } : it))}>−</button>
                    <span className="qty-num">{item.quantity}</span>
                    <button className="qty-btn" onClick={() => setManualCart(p => p.map((it, i) => i === idx ? { ...it, quantity: it.quantity + 1 } : it))}>+</button>
                  </div>
                </div>
              ))}
            </div>
            <button className="btn-primary" onClick={submitManualOrder}>✅ Add Order</button>
          </div>
        )}

        <div className="filter-tabs">
          {['ALL', ...statuses].map(s => (
            <button key={s} className={`filter-tab ${filter === s ? 'active' : ''}`}
              onClick={() => setFilter(s)}>{s} {s !== 'ALL' ? `(${orders.filter(o => o.status === s).length})` : `(${orders.length})`}</button>
          ))}
        </div>

        <div className="order-cards">
          {filtered.length === 0 && <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px' }}>No orders yet</p>}
          {filtered.map(order => {
            const items = JSON.parse(order.items || '[]')
            const table = TABLES.find(t => t.id === order.tableNumber)
            return (
              <div key={order.id} className="admin-order-card">
                <div className="admin-order-num">#{order.id}</div>
                <div className="admin-order-info">
                  <div className="order-customer">
                    {order.customerName} {order.isManual && <span style={{ color: 'var(--purple)', fontSize: '0.75rem' }}>(Manual)</span>}
                  </div>
                  <div className="order-items-list">
                    {items.map((it, i) => `${it.name} ×${it.quantity}`).join(', ')}
                  </div>
                  <div className="order-meta">
                    📍 {table?.label || order.tableNumber} · 🕐 {new Date(order.createdAt).toLocaleTimeString()}
                  </div>
                </div>
                <div className="admin-order-amount">₹{order.totalAmount}</div>
                <span className={`status-badge status-${order.status}`}>{order.status}</span>
                <div className="status-actions">
                  {statuses.map(s => (
                    <button key={s} className={`status-btn ${order.status === s ? 'active-status' : ''}`}
                      onClick={() => updateStatus(order.id, s)}
                      title={s}>{s.charAt(0)}</button>
                  ))}
                  <button className="del-btn" onClick={() => deleteOrder(order.id)}>🗑️</button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
