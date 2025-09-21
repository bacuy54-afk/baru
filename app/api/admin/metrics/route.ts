export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { PaymentStatus } from '@prisma/client'

export async function GET() {
  try {
    // Total produk & kategori unik
    const [products, categories] = await Promise.all([
      prisma.product.count({ where: { isActive: true } }),
      prisma.product.findMany({ where: { isActive: true }, select: { category: true } }),
    ])
    const categoryCount = new Set(categories.map(c => c.category || '')).size

    // Revenue = sum(Order.total) untuk order PAID
    const paidOrders = await prisma.order.findMany({
      where: { paymentStatus: PaymentStatus.PAID },
      select: { total: true },
    })
    const revenue = paidOrders.reduce((sum, o) => sum + (o.total ?? 0), 0)

    // Avg price katalog (opsional)
    const productPrices = await prisma.product.findMany({ where: { isActive: true }, select: { price: true } })
    const avgPrice = productPrices.length
      ? Math.round(productPrices.reduce((s, p) => s + p.price, 0) / productPrices.length)
      : 0

    return NextResponse.json({ totals: { products, categories: categoryCount, revenue, avgPrice } })
  } catch (e: any) {
    console.error('metrics error:', e)
    return NextResponse.json({ error: e.message || 'Internal error' }, { status: 500 })
  }
}
