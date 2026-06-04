'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const CATEGORIES = ['Ingredients', 'Rent', 'Salary', 'Gas/Fuel', 'Packaging', 'Maintenance', 'Other']

export default function ExpensesPage() {
  const { status } = useSession()
  const router = useRouter()
  const [expenses, setExpenses] = useState([])
  const [form, setForm] = useState({ category: 'Ingredients', description: '', amount: '', date: new Date().toISOString().split('T')[0] })
  const [loading, setLoading] = useState(true)

  const fetchExpenses = async () => {
    const res = await fetch('/api/expenses')
    setExpenses(await res.json())
    setLoading(false)
  }

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin/login')
    if (status === 'authenticated') fetchExpenses()
  }, [status, router])

  const addExpense = async (e) => {
    e.preventDefault()
    if (!form.description || !form.amount) return
    await fetch('/api/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setForm({ ...form, description: '', amount: '' })
    fetchExpenses()
  }

  const deleteExpense = async (id) => {
    await fetch(`/api/expenses/${id}`, { method: 'DELETE' })
    fetchExpenses()
  }

  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0)
  const todayExpenses = expenses.filter(e => e.date === new Date().toISOString().split('T')[0]).reduce((s, e) => s + e.amount, 0)

  if (status === 'loading' || loading) return <div className="loading"><div className="spinner" /></div>

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
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '24px' }}>💰 Expense Manager</h1>

        <div className="stats-grid" style={{ marginBottom: '32px' }}>
          <div className="stat-card">
            <div className="stat-icon">📅</div>
            <div className="stat-value">₹{todayExpenses}</div>
            <div className="stat-label">Today&apos;s Expenses</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-value">₹{totalExpenses}</div>
            <div className="stat-label">Total Expenses</div>
          </div>
        </div>

        <form onSubmit={addExpense} className="expense-form">
          <div className="form-group">
            <label>Category</label>
            <select className="form-input" value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Description</label>
            <input className="form-input" value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })} placeholder="What was it for?" />
          </div>
          <div className="form-group">
            <label>Amount (₹)</label>
            <input className="form-input" type="number" value={form.amount}
              onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="0" />
          </div>
          <div className="form-group">
            <label>Date</label>
            <input className="form-input" type="date" value={form.date}
              onChange={e => setForm({ ...form, date: e.target.value })} />
          </div>
          <button className="btn-primary" type="submit" style={{ height: '50px' }}>+ Add</button>
        </form>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
          <table className="expense-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Description</th>
                <th>Amount</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {expenses.length === 0 && (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No expenses recorded yet</td></tr>
              )}
              {expenses.map(exp => (
                <tr key={exp.id}>
                  <td>{exp.date}</td>
                  <td>{exp.category}</td>
                  <td>{exp.description}</td>
                  <td className="expense-amount">₹{exp.amount}</td>
                  <td><button className="del-btn" onClick={() => deleteExpense(exp.id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
