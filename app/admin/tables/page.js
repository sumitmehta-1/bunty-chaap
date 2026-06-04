'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import QRCode from 'react-qr-code'
import { TABLES } from '@/lib/menu'

export default function TablesPage() {
  const { status } = useSession()
  const router = useRouter()
  const [baseUrl, setBaseUrl] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin/login')
    setBaseUrl(window.location.origin)
  }, [status, router])

  if (status === 'loading') return <div className="loading"><div className="spinner" /></div>

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

      <div style={{ paddingTop: '90px', maxWidth: '1000px', margin: '0 auto', padding: '90px 24px 60px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '8px' }}>📱 Table QR Codes</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
          Print these QR codes and place them on each table. Customers scan to order directly!
        </p>

        <div className="qr-grid">
          {TABLES.map(table => {
            const url = `${baseUrl}/order?table=${table.id}`
            return (
              <div key={table.id} className="qr-card">
                <h3>{table.id === 'OUT' ? '🚶' : '🪑'} {table.label}</h3>
                {baseUrl && (
                  <div style={{ background: '#fff', padding: '16px', borderRadius: '12px', display: 'inline-block' }}>
                    <QRCode value={url} size={180} />
                  </div>
                )}
                <div className="qr-url">{url}</div>
                <button className="btn-outline" style={{ marginTop: '12px', padding: '8px 20px', fontSize: '0.85rem' }}
                  onClick={() => window.print()}>
                  🖨️ Print
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
