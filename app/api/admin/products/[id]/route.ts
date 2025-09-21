import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// UPDATE (PATCH)
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();

    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        name: body.name,
        description: body.description ?? null,
        price: Number(body.price ?? 0),
        originalPrice: body.originalPrice !== null
          ? Number(body.originalPrice)
          : null,
        category: body.category ?? null,
        image: body.image ?? null,
        features: Array.isArray(body.features) ? body.features : [],
        tags: Array.isArray(body.tags) ? body.tags : [],
        isActive: body.isActive ?? true,
        // 🆕 featured fields (pastikan sudah ada di Prisma schema)
        featured: typeof body.featured === "boolean" ? body.featured : undefined,
        featuredOrder:
          typeof body.featuredOrder === "number"
            ? body.featuredOrder
            : body.featuredOrder === null
            ? null
            : undefined,
      },
    });

    return NextResponse.json({ product });
  } catch (e: any) {
    console.error("PATCH /admin/products/:id", e);
    return NextResponse.json(
      { error: e?.message ?? "Failed to update" },
      { status: 500 }
    );
  }
}

// DELETE (kalau belum ada)
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.product.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Failed to delete" },
      { status: 500 }
    );
  }
}
