"use client";

import React, { useEffect, useState } from "react";
import ThreeDCarousel, { type ThreeDCarouselItem } from "@/components/ThreeDCarousel";
import ProductPreviewCarousel, { type PreviewProduct } from "@/components/ProductPreviewCarousel";

export default function HomeCarousel() {
  const [items, setItems] = useState<PreviewProduct[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Ambil produk featured
  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const r = await fetch("/api/featured-products", { cache: "no-store" });
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const j = await r.json();
        const products: PreviewProduct[] = Array.isArray(j.products) ? j.products : [];
        if (alive) setItems(products);
      } catch (e: any) {
        console.error("HomeCarousel fetch failed:", e);
        if (alive) setError("Gagal memuat produk unggulan.");
        // tetap biarkan items = null; nanti pakai fallback
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  // Fallback demo bila tidak ada featured
  const fallback: ThreeDCarouselItem[] = [
    {
      id: "demo-1",
      title: "Netflix Premium",
      brand: "Streaming",
      description: "Akun Netflix aman & garansi.",
      tags: ["Streaming", "4K", "Family"],
      imageUrl:
        "https://images.unsplash.com/photo-1587825140400-11d1e73b5b83?q=80&w=1600&auto=format&fit=crop",
      link: "/products",
    },
    {
      id: "demo-2",
      title: "Canva Pro",
      brand: "Design",
      description: "Akun Canva Pro untuk desain cepat.",
      tags: ["Design", "Pro", "Template"],
      imageUrl:
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1600&auto=format&fit=crop",
      link: "/products",
    },
    {
      id: "demo-3",
      title: "ChatGPT Plus",
      brand: "AI Tools",
      description: "Akses AI tools untuk produktivitas.",
      tags: ["AI", "Tools", "Productivity"],
      imageUrl:
        "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1600&auto=format&fit=crop",
      link: "/products",
    },
  ];

  // UI state ringan
  if (error && items === null) {
    return <div className="mt-10 text-sm text-red-400">{error}</div>;
  }
  if (items === null && !error) {
    return <div className="mt-10 text-sm text-muted-foreground">Memuat…</div>;
  }

  const hasFeatured = (items?.length ?? 0) > 0;

  return (
    <div className="mt-10">
      {hasFeatured ? (
        <ProductPreviewCarousel products={items!} />
      ) : (
        <ThreeDCarousel items={fallback} />
      )}
    </div>
  );
}
