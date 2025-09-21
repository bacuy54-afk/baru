// app/checkout/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CheckoutPage() {
  const params = useSearchParams();
  const productId = params.get("product");

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-2xl md:text-3xl font-bold mb-4">Checkout</h1>
      {productId ? (
        <p className="text-zinc-300 mb-6">
          Melanjutkan pembelian untuk produk ID: <span className="font-mono">{productId}</span>
        </p>
      ) : (
        <p className="text-zinc-300 mb-6">
          Tidak ada produk yang dipilih. Silakan kembali ke halaman produk.
        </p>
      )}

      {/* Placeholder tombol aksi pembayaran */}
      <div className="flex gap-3">
        <Button className="bg-emerald-600 hover:bg-emerald-500">Bayar Sekarang</Button>
        <Button variant="outline" asChild>
          <Link href="/products">Kembali ke Produk</Link>
        </Button>
      </div>
    </div>
  );
}
