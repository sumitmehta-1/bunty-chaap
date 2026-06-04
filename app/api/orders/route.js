export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const orders = await prisma.order.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json(orders)
  } catch (e) {
    console.error('GET /api/orders error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const body = await req.json()
    console.log('POST /api/orders body:', JSON.stringify(body))
    const { tableNumber, customerName, items, notes, isManual } = body
    const parsedItems = typeof items === 'string' ? JSON.parse(items) : items
    const totalAmount = parsedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const pendingCount = await prisma.order.count({
      where: { status: { in: ['PENDING', 'PREPARING'] } },
    })
    const estimatedTime = 10 + pendingCount * 5
    const order = await prisma.order.create({
      data: {
        tableNumber,
        customerName: customerName || 'Guest',
        items: typeof items === 'string' ? items : JSON.stringify(items),
        totalAmount,
        estimatedTime,
        notes: notes || null,
        isManual: isManual || false,
      },
    })
    console.log('Order created:', order)
    return NextResponse.json({ ...order, orderNumber: order.id }, { status: 201 })
  } catch (e) {
    console.error('POST /api/orders error:', e)
    return NextResponse.json({ error: e.message, stack: e.stack }, { status: 500 })
  }
}
