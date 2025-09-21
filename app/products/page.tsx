// app/products/page.tsx
export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma';
import ProductCard from '@/components/product-card';
import ShinyText from '@/components/effects/ShinyText';

export default async function ProductsPage() {
  // Ambil data (urut terbaru dulu)
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <section className="bg-transparent">
      <div className="container mx-auto px-4 md:px-6 py-10">
        <header className="mb-8 text-center">
<h1 className="text-center font-extrabold">
  <ShinyText size="5xl" weight="black" shineWidth={46} speed={18}>
    All Products
  </ShinyText>
</h1>
<p className="mt-2 text-center">
  <ShinyText size="lg" weight="medium" shineWidth={36} speed={20} intensity={0.95}>
    Explore our complete collection of premium digital products
  </ShinyText>
</p>
</header>

        {/* Grid kartu produk */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              id={p.id}
              name={p.name}
              category={p.category}
              image={p.image ?? undefined}
              price={Number(p.price)}
              originalPrice={p.originalPrice ? Number(p.originalPrice) : undefined}
              description={p.description ?? undefined}
            />
          ))}
          {products.length === 0 && (
            <div className="col-span-full text-center text-zinc-400">
              Belum ada produk.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
