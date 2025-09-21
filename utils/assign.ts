import { prisma } from '@/lib/prisma'

export async function assignSeatForOrderItem(orderItemId: string, durationDays: number) {
  const item = await prisma.orderItem.findUnique({
    where: { id: orderItemId },
    include: { product: true }
  })
  if (!item) throw new Error('OrderItem not found')
  const provider = item.product.provider

  const seat = await prisma.seat.findFirst({
    where: {
      isAssigned: false,
      disabled: false,
      account: { status: 'ACTIVE', provider }
    },
    include: { account: true }
  })
  if (!seat) throw new Error('No available seat')

  const expiresAt = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000)

  const assignment = await prisma.assignment.create({
    data: {
      orderItemId: item.id,
      seatId: seat.id,
      expiresAt
    }
  })

  await prisma.seat.update({
    where: { id: seat.id },
    data: { isAssigned: true, assignedAt: new Date() }
  })

  return { assignment, seat }
}
