import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { assignSeatForOrderItem } from '@/utils/assign'
import crypto from 'crypto'

export async function POST(req: Request) {
  const { orderItemId } = await req.json()
  const item = await prisma.orderItem.findUnique({ where: { id: orderItemId }, include: { plan: true, order: true, product: true } })
  if (!item) return NextResponse.json({ error: 'OrderItem not found' }, { status: 404 })

  const { assignment } = await assignSeatForOrderItem(item.id, item.plan.durationDays)

  const token = crypto.randomBytes(16).toString('hex')
  const expires = new Date(Date.now() + 1000 * 60 * 30)
  await prisma.revealToken.create({ data: { assignmentId: assignment.id, token, expiresAt: expires } })

  const revealUrl = `${process.env.APP_URL}/api/reveal?token=${token}`
  return NextResponse.json({ ok: true, orderItemId: item.id, assignmentId: assignment.id, revealUrl, expiresAt: expires })
}
