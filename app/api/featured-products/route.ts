export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        featured: true,           // ⬅️ HANYA featured
      },
      orderBy: [
        { featuredOrder: 'asc' }, // urut manual dulu
        { createdAt: 'desc' },    // baru terbaru
      ],
      select: {
        id: true,
        name: true,
        category: true,
        description: true,
        image: true,
        tags: true,
      },
      take: 12,
    });

    return NextResponse.json({ products });
  } catch (e: any) {
    console.error('featured API error:', e);
    return NextResponse.json({ products: [] }, { status: 500 });
  }
}
