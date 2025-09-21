'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useCart } from '@/lib/cart';
import AddToCartButton from '@/components/product/AddToCartButton';

type Props = {
  id: string;
  name: string;
  category?: string | null;
  image?: string | null;
  price: number;
  originalPrice?: number | null;
  description?: string | null;
};

export default function ProductCard({
  id,
  name,
  category,
  image,
  price,
  originalPrice,
  description,
}: Props) {
  const router = useRouter();
  const add = useCart((s) => s.add);

  const hasDiscount =
    typeof originalPrice === 'number' && Number(originalPrice) > Number(price);

  const discountPct = hasDiscount
    ? Math.round(((Number(originalPrice) - Number(price)) / Number(originalPrice)) * 100)
    : 0;

  function handleBuyNow() {
    // Pastikan produk berada di cart minimal qty 1, lalu langsung ke checkout
    add({ id, name, price, image: image ?? undefined }, 1);
    router.push('/checkout');
  }

  return (
    <Card
      className={cn(
        'relative overflow-hidden rounded-2xl',
        'bg-zinc-900/90 text-white',      // card solid agar teks selalu kebaca
        'border border-white/10'
      )}
    >
      {/* Gambar */}
      <div className="relative">
        {image ? (
          <Link href={`/products/${id}`} aria-label={`Lihat detail ${name}`}>
            <Image
              src={image}
              alt={name}
              width={1200}
              height={800}
              className="h-48 w-full object-cover"
              priority={false}
            />
          </Link>
        ) : (
          <div className="h-48 w-full bg-white/5" />
        )}

        {hasDiscount && (
          <div className="absolute left-3 top-3 rounded-full bg-rose-600 px-2 py-1 text-xs font-semibold text-white">
            -{discountPct}%
          </div>
        )}

        {category && (
          <div className="absolute right-3 top-3">
            <Badge variant="secondary" className="backdrop-blur">
              {category}
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-5 space-y-3">
        {/* Judul & deskripsi */}
        <h3 className="line-clamp-1 text-lg font-semibold tracking-tight">{name}</h3>
        {description ? (
          <p className="line-clamp-2 text-sm text-zinc-300">{description}</p>
        ) : null}

        {/* Harga */}
        <div className="flex items-baseline gap-2">
          <div className="text-xl font-bold text-emerald-400">
            Rp {Number(price).toLocaleString('id-ID')}
          </div>
          {hasDiscount && (
            <div className="text-sm text-zinc-400 line-through">
              Rp {Number(originalPrice).toLocaleString('id-ID')}
            </div>
          )}
        </div>

        {/* Aksi */}
        <div className="mt-2 grid grid-cols-2 gap-3">
          {/* Tambahkan ke keranjang */}
          <div className="relative isolate min-w-0">
            <AddToCartButton
              id={id}
              name={name}
              price={price}
              image={image ?? undefined}
              className="w-full h-11"
            />
          </div>

          {/* Beli sekarang → langsung checkout */}
          <div className="relative isolate min-w-0">
            <button
              type="button"
              onClick={handleBuyNow}
              className={cn(
                'inline-flex h-11 w-full items-center justify-center',
                'rounded-lg border border-white/20 px-3 text-sm font-semibold',
                'text-white hover:bg-white/10 transition',
                'truncate'
              )}
              aria-label="Beli sekarang"
            >
              Beli sekarang →
            </button>
          </div>
        </div>

        <div className="pt-1">
          <span className="text-xs text-zinc-400">Klik judul untuk detail</span>
        </div>
      </CardContent>
    </Card>
  );
}
