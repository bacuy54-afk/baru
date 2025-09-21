"use client";

import React from "react";
import ThreeDCarousel, {
  type ThreeDCarouselItem,
} from "@/components/ThreeDCarousel";

/** Bentuk data produk yang kamu kirim dari server/parent */
export type PreviewProduct = {
  id: string;
  name: string;
  category: string | null;
  description: string | null;
  image: string | null;           // <- bisa null/undefined
  tags?: string[] | null;         // opsional
};

/** SVG fallback yang sudah di-encode (garis besar “No Image”) */
const FALLBACK_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='630'%3E%3Crect fill='%2318181b' width='100%25' height='100%25'/%3E%3Ctext x='50%25' y='50%25' fill='%23a1a1aa' font-family='sans-serif' font-size='42' text-anchor='middle' dominant-baseline='middle'%3ENo Image%3C/text%3E%3C/svg%3E";

interface ProductPreviewCarouselProps {
  products: PreviewProduct[];
  className?: string;
}

/**
 * Mengonversi produk mentah -> ThreeDCarouselItem[]
 * dengan penanganan null/undefined yang aman untuk TS
 */
function toCarouselItems(products: PreviewProduct[]): ThreeDCarouselItem[] {
  return (products || []).map((p) => ({
    id: p.id,
    title: p.name,
    brand: p.category ?? "Produk",
    description: p.description ?? "",
    tags: Array.isArray(p.tags) ? (p.tags as string[]) : [],
    // ⬇⬇⬇ pastikan SELALU string (bukan undefined)
    imageUrl: p.image ?? FALLBACK_IMAGE,
    link: `/products/${p.id}`,
  }));
}

const ProductPreviewCarousel: React.FC<ProductPreviewCarouselProps> = ({
  products,
  className,
}) => {
  const items = toCarouselItems(products);

  return (
    <ThreeDCarousel
      className={className}
      items={items}
      title="Produk Unggulan"
      subtitle="Preview cepat koleksi terbaik kami"
      rotateInterval={4500}
      cardHeight={360}
    />
  );
};

export default ProductPreviewCarousel;
