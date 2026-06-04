'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await signIn('credentials', {
      username, password, redirect: false,
    })
    if (res?.error) {
      setError('Invalid username or password')
      setLoading(false)
    } else {
      router.push('/admin/dashboard')
    }
  }

  return (
    <>
      <nav className="navbar">
        <Link href="/" className="navbar-brand">🔥 <span>Bunty</span> Chaap</Link>
      </nav>
      <div className="login-page">
        <div className="login-card">
          <h1>🔐 Owner Login</h1>
          <p>Access your restaurant dashboard</p>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Username</label>
              <input className="form-input" value={username}
                onChange={e => setUsername(e.target.value)} placeholder="Enter username" />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input className="form-input" type="password" value={password}
                onChange={e => setPassword(e.target.value)} placeholder="Enter password" />
            </div>
            <button className="login-btn" type="submit" disabled={loading}>
              {loading ? '🔄 Logging in...' : '🚀 Login'}
            </button>
            {error && <div className="login-error">{error}</div>}
          </form>
        </div>
      </div>
    </>
  )
}
