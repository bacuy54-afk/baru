import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'
import { assignSeatForOrderItem } from '@/utils/assign'

type MidtransNotif = {
  order_id: string
  status_code: string
  gross_amount: string
  signature_key: string
  transaction_status: string
  transaction_id?: string
}

export async function POST(req: Request) {
  const body = (await req.json()) as MidtransNotif

  const expected = crypto.createHash('sha512')
    .update(`${body.order_id}${body.status_code}${body.gross_amount}${process.env.MIDTRANS_SERVER_KEY}`)
    .digest('hex')

  if (expected != body.signature_key) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 403 })
  }

  const paid = ['settlement', 'capture'].includes(body.transaction_status)
  if (!paid) return NextResponse.json({ ok: true })

  const order = await prisma.order.update({
    where: { id: body.order_id },
    data: { paymentStatus: 'PAID', status: 'PAID', paymentRef: body.transaction_id || null },
    include: { items: { include: { plan: true, product: true } } }
  })

  for (const item of order.items) {
    const { assignment } = await assignSeatForOrderItem(item.id, item.plan.durationDays)
    const token = crypto.randomBytes(16).toString('hex')
    const expires = new Date(Date.now() + 1000 * 60 * 30)
    await prisma.revealToken.create({ data: { assignmentId: assignment.id, token, expiresAt: expires } })
  }

  return NextResponse.json({ ok: true })
}
