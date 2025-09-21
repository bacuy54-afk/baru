import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// GET /api/admin/products
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const onlyActive = searchParams.get('active') === '1';

    const products = await prisma.product.findMany({
      where: onlyActive ? { isActive: true } : undefined,
      orderBy: [{ createdAt: 'desc' }],
    });

    return NextResponse.json({ products }, { status: 200 });
  } catch (e: any) {
    console.error('admin products error:', e);
    return NextResponse.json({ products: [], error: e?.message ?? 'Failed' }, { status: 500 });
  }
}

// POST /api/admin/products
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const product = await prisma.product.create({
      data: {
        name: body.name,
        description: body.description ?? null,
        price: Number(body.price ?? 0),
        originalPrice:
          body.originalPrice === undefined || body.originalPrice === '' || body.originalPrice === null
            ? null
            : Number(body.originalPrice),
        category: body.category ?? null,
        image: body.image ?? null,
        features: Array.isArray(body.features) ? body.features : [],
        tags: Array.isArray(body.tags) ? body.tags : [],
        isActive: body.isActive ?? true,

        // featured controls (aman kalau schema sudah ada kolomnya)
        featured: !!body.featured,
        featuredOrder:
          typeof body.featuredOrder === 'number'
            ? body.featuredOrder
            : body.featuredOrder === '' || body.featuredOrder === null || body.featuredOrder === undefined
            ? null
            : Number(body.featuredOrder),
      },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (e: any) {
    console.error('POST /admin/products', e);
    return NextResponse.json({ error: e?.message ?? 'Failed to create' }, { status: 500 });
  }
}
