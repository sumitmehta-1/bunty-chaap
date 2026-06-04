import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function PATCH(req, { params }) {
  try {
    const { id } = await params
    const body = await req.json()
    const order = await prisma.order.update({
      where: { id: parseInt(id) },
      data: { status: body.status, updatedAt: new Date() },
    })
    return NextResponse.json(order)
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params
    await prisma.order.delete({ where: { id: parseInt(id) } })
    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
