import './globals.css'

export const metadata = {
  title: 'Bunty Chaap - Best Chaap & Paneer Tikka in Town',
  description: 'Order delicious Afghani, Malai, Tandoori, Seekh Chaap and Paneer Tikka. Scan QR to order from your table!',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
