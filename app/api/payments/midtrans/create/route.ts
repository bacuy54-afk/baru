import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import midtransClient from 'midtrans-client'

export async function POST(req: Request) {
  const { orderId } = await req.json()
  const order = await prisma.order.findUnique({ where: { id: orderId }, include: { items: { include: { product: true, plan: true } } } })
  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

  const snap = new midtransClient.Snap({
    isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
    serverKey: process.env.MIDTRANS_SERVER_KEY!,
    clientKey: process.env.MIDTRANS_CLIENT_KEY!
  })

  const txParams = {
    transaction_details: { order_id: order.id, gross_amount: order.total },
    item_details: order.items.map(i => ({
      id: i.productId,
      price: i.price,
      quantity: i.quantity,
      name: `${i.product.provider} - ${i.plan.label}`.substring(0, 50)
    })),
    customer_details: { email: order.customerEmail || undefined, phone: order.customerPhone || undefined },
    callbacks: { finish: `${process.env.APP_URL}/order/${order.id}` }
  }

  const snapResp = await snap.createTransaction(txParams as any)
  return NextResponse.json({ redirect_url: snapResp.redirect_url, token: snapResp.token })
}
