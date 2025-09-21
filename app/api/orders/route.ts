import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type Payload = {
  productId: string
  planId: string
  checkout: 'wa' | 'online'
  waNumber?: string
  customerEmail?: string
  customerPhone?: string
}

export async function POST(req: Request) {
  const body = (await req.json()) as Payload
  const product = await prisma.product.findUnique({ where: { id: body.productId } })
  const plan = await prisma.productPlan.findUnique({ where: { id: body.planId } })
  if (!product || !plan || plan.productId !== product.id) {
    return NextResponse.json({ error: 'Product/plan not found' }, { status: 404 })
  }

  const order = await prisma.order.create({
    data: {
      customerEmail: body.customerEmail ?? null,
      customerPhone: body.customerPhone ?? null,
      waNumber: body.waNumber ?? null,
      total: plan.price,
      paymentProvider: body.checkout === 'online' ? 'midtrans' : 'manual-wa',
      items: {
        create: [{
          productId: product.id,
          planId: plan.id,
          price: plan.price,
          quantity: 1
        }]
      }
    },
    include: { items: true }
  })

  if (body.checkout === 'wa') {
    return NextResponse.json({ ok: true, mode: 'wa', orderId: order.id })
  }
  return NextResponse.json({ ok: true, mode: 'online', orderId: order.id })
}
