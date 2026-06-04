'use client'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function SuccessContent() {
  const searchParams = useSearchParams()
  const num = searchParams.get('num') || '?'
  const eta = searchParams.get('eta') || '15'
  const name = searchParams.get('name') || 'Guest'

  return (
    <div className="success-page">
      <div className="success-card">
        <div className="success-icon">✅</div>
        <h1>Order Placed!</h1>
        <p style={{color:'var(--text-secondary)'}}>Thank you, <strong>{name}</strong>!</p>
        <div className="order-num">#{num}</div>
        <div className="eta">
          Estimated Time: <strong>{eta} min</strong>
        </div>
        <p style={{color:'var(--text-muted)', fontSize:'0.9rem', marginBottom:'24px'}}>
          Please wait at your table. We&apos;ll call your order number when it&apos;s ready! 🔔
        </p>
        <Link href="/"><button className="btn-primary">🏠 Back to Home</button></Link>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="loading"><div className="spinner" /></div>}>
      <SuccessContent />
    </Suspense>
  )
}
