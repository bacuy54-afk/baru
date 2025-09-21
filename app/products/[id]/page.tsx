// app/products/[id]/page.tsx
export const dynamic = "force-dynamic";

import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";
import ProductActions from "@/components/product/ProductActions";

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
  });

  if (!product) return notFound();

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Gambar / hero */}
          <div className="relative overflow-hidden rounded-lg">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                width={800}
                height={500}
                className="h-auto w-full object-cover"
                priority
              />
            ) : (
              <div className="h-80 rounded-lg bg-muted" />
            )}
          </div>

          {/* Detail + aksi */}
          <div className="space-y-6">
            <div>
              {product.category ? (
                <Badge className="mb-2">{product.category}</Badge>
              ) : null}
              <h1 className="mb-2 text-3xl font-bold">{product.name}</h1>
              {product.description ? (
                <p className="text-muted-foreground">{product.description}</p>
              ) : null}
            </div>

            <div className="flex items-baseline gap-3">
              <div className="text-4xl font-bold text-primary">
                Rp {Number(product.price).toLocaleString("id-ID")}
              </div>
              {product.originalPrice ? (
                <div className="text-xl line-through text-muted-foreground">
                  Rp {Number(product.originalPrice).toLocaleString("id-ID")}
                </div>
              ) : null}
            </div>

            {/* Aksi: tambah ke keranjang & beli sekarang */}
            <ProductActions
              id={product.id}
              name={product.name}
              price={product.price}
              image={product.image ?? undefined}
            />
          </div>
        </div>

        {/* Fitur */}
        <div className="mt-16">
          <h2 className="mb-6 text-2xl font-bold">Yang Kamu Dapat</h2>
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {(product.features ?? []).map((f, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-emerald-600" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
