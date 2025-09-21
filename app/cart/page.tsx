'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/cart';
import { Button } from '@/components/ui/button';
import { Trash2, Minus, Plus } from 'lucide-react';
import AnimatedCheckoutButton from '@/components/cart/AnimatedCheckoutButton';

export default function CartPage() {
  const items = useCart((s) => s.items);
  const inc   = useCart((s) => s.inc);
  const dec   = useCart((s) => s.dec);
  const remove = useCart((s) => s.remove);
  const clear = useCart((s) => s.clear);
  const total = items.reduce((sum, it) => sum + it.price * it.qty, 0);

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-6 py-20 text-center">
        <h1 className="text-2xl md:text-3xl font-bold mb-4">Keranjang kosong</h1>
        <p className="text-muted-foreground mb-8">
          Yuk lihat-lihat produk dan tambahkan ke keranjang.
        </p>
        <Button asChild>
          <Link href="/products">Jelajahi Produk</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-10">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Keranjang</h1>

      <div className="grid gap-6 md:grid-cols-[1fr_320px]">
        {/* List items */}
        <div className="space-y-4">
          {items.map((it) => (
            <div
              key={it.id}
              className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
            >
              <div className="h-16 w-16 overflow-hidden rounded-lg bg-black/40">
                {it.image ? (
                  <Image
                    src={it.image}
                    alt={it.name}
                    width={64}
                    height={64}
                    className="h-16 w-16 object-cover"
                  />
                ) : null}
              </div>

              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{it.name}</div>
                <div className="text-xs text-zinc-300/90">
                  Rp {Number(it.price).toLocaleString('id-ID')} / item
                </div>
              </div>

              {/* Qty controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => dec(it.id)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-white/10 text-white hover:bg-white/15"
                  aria-label="Kurangi"
                  type="button"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <div className="w-8 text-center font-semibold tabular-nums">{it.qty}</div>
                <button
                  onClick={() => inc(it.id)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-white/10 text-white hover:bg-white/15"
                  aria-label="Tambah"
                  type="button"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {/* Harga total per item */}
              <div className="w-28 text-right font-semibold">
                Rp {(it.price * it.qty).toLocaleString('id-ID')}
              </div>

              {/* Hapus */}
              <button
                onClick={() => remove(it.id)}
                className="
                  inline-flex items-center justify-center
                  h-10 w-10 rounded-xl
                  border border-rose-400/20
                  bg-rose-500/15 hover:bg-rose-500/25
                  text-rose-300 hover:text-rose-200
                  transition-colors
                  focus:outline-none focus:ring-2 focus:ring-rose-400/40
                "
                aria-label="Hapus item"
                type="button"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <aside className="h-max rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm text-zinc-300/90">Jumlah Item</span>
            <span className="font-medium">
              {items.reduce((n, it) => n + it.qty, 0)}
            </span>
          </div>
          <div className="mb-6 flex items-center justify-between">
            <span className="text-sm text-zinc-300/90">Total</span>
            <span className="text-lg font-semibold">
              Rp {Number(total).toLocaleString('id-ID')}
            </span>
          </div>

          <div className="flex gap-2">
            {/* Kosongkan: dibuat kontras agar terlihat */}
            <Button
              variant="outline"
              className="w-1/3 border-white/25 bg-white/10 text-white hover:bg-white/15"
              onClick={clear}
            >
              Kosongkan
            </Button>

            {/* Checkout animasi kamu */}
            <AnimatedCheckoutButton className="w-2/3" />
          </div>
        </aside>
      </div>
    </div>
  );
}
