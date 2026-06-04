import Link from 'next/link'
import { MENU_ITEMS } from '@/lib/menu'

export default function Home() {
  return (
    <>
      <nav className="navbar">
        <Link href="/" className="navbar-brand">🔥 <span>Bunty</span> Chaap</Link>
        <div className="navbar-links">
          <Link href="/#menu">Menu</Link>
          <Link href="/order?table=OUT">Order Now</Link>
          <Link href="/admin/login"><button className="nav-btn">Owner Login</button></Link>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-content">
          <div className="hero-badge">🏆 #1 Chaap Spot in Town</div>
          <h1>The <span className="highlight">Legendary</span> Chaap Experience</h1>
          <p>From smoky Tandoori to creamy Malai — taste the chaap that has the whole city talking. Scan, Order, Enjoy!</p>
          <div className="hero-buttons">
            <Link href="/order?table=OUT"><button className="btn-primary">🛒 Order Now</button></Link>
            <a href="#menu"><button className="btn-outline">📖 View Menu</button></a>
          </div>
        </div>
      </section>

      <section className="section" id="menu">
        <h2 className="section-title">🍽️ Our Menu</h2>
        <p className="section-subtitle">Every item is made fresh with love and premium spices</p>
        <div className="menu-grid">
          {MENU_ITEMS.map(item => (
            <div key={item.id} className="menu-card">
              <div className="menu-card-img-wrap">
                <img src={item.image} alt={item.name} className="menu-card-img" />
                <span className="menu-card-tag" style={{background: item.tagColor}}>{item.tag}</span>
              </div>
              <div className="menu-card-body">
                <div className="menu-card-name">{item.emoji} {item.name}</div>
                <div className="menu-card-desc">{item.description}</div>
                <div className="menu-card-prices">
                  <div className="price-badge">Half: <span>₹{item.half}</span></div>
                  <div className="price-badge">Full: <span>₹{item.full}</span></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section" style={{textAlign:'center', paddingBottom:'120px'}}>
        <h2 className="section-title">📱 How to Order</h2>
        <p className="section-subtitle">It&apos;s super easy — 3 simple steps!</p>
        <div style={{display:'flex', justifyContent:'center', gap:'40px', flexWrap:'wrap', marginTop:'32px'}}>
          {[
            {icon:'📷', title:'Scan QR', desc:'Scan the QR code on your table'},
            {icon:'🍽️', title:'Pick Items', desc:'Choose your favourite chaap & size'},
            {icon:'✅', title:'Get Order #', desc:'Receive order number & wait time'},
          ].map((s,i) => (
            <div key={i} style={{background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'32px', maxWidth:'250px', flex:'1'}}>
              <div style={{fontSize:'3rem', marginBottom:'12px'}}>{s.icon}</div>
              <div style={{fontWeight:700, fontSize:'1.1rem', marginBottom:'8px'}}>{s.title}</div>
              <div style={{color:'var(--text-secondary)', fontSize:'0.9rem'}}>{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <footer style={{textAlign:'center', padding:'24px', borderTop:'1px solid var(--border)', color:'var(--text-muted)', fontSize:'0.85rem'}}>
        © 2024 Bunty Chaap. Made with 🔥 and love.
      </footer>
    </>
  )
}
