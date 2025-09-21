'use client';

import { useEffect, useRef, useState } from 'react';
import { ShoppingCart, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/lib/cart';

type Props = {
  id: string;
  name: string;
  price: number;
  image?: string;
  className?: string;
};

type Ui = 'idle' | 'busy' | 'done';

export default function AddToCartButton({
  id,
  name,
  price,
  image,
  className,
}: Props) {
  const add = useCart((s) => s.add);
  const [ui, setUi] = useState<Ui>('idle');
  const tBusy = useRef<number | null>(null);
  const tIdle = useRef<number | null>(null);

  // bersihin timer saat unmount
  useEffect(() => {
    return () => {
      if (tBusy.current) clearTimeout(tBusy.current);
      if (tIdle.current) clearTimeout(tIdle.current);
    };
  }, []);

  const onClick = () => {
    if (ui !== 'idle') return; // cegah spam sementara animasi jalan

    // tambah ke keranjang
    add({ id, name, price, image });

    // trigger toast kecil di ikon cart (CartButton sudah listen event ini)
    window.dispatchEvent(new CustomEvent('cart:added', { detail: { name } }));

    // jalankan animasi status
    setUi('busy');
    tBusy.current = window.setTimeout(() => setUi('done'), 400);  // selesai gerak
    tIdle.current = window.setTimeout(() => setUi('idle'), 1100); // balik siap klik lagi
  };

  const label =
    ui === 'busy'
      ? 'Menambahkan…'
      : ui === 'done'
      ? 'Ditambahkan!'
      : 'Tambahkan ke keranjang';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={ui !== 'idle'}
      aria-live="polite"
      className={cn(
        'relative isolate inline-flex h-11 w-full items-center justify-center',
        'rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white',
        'transition-all duration-200 hover:bg-emerald-700 active:scale-[.99]',
        ui !== 'idle' && 'cursor-not-allowed opacity-95',
        'overflow-hidden', // biar sweep/ikon tetap di dalam tombol
        className
      )}
    >
      {/* sweep highlight halus */}
      <span
        className={cn(
          'pointer-events-none absolute inset-0 -translate-x-full bg-white/15',
          'transition-transform duration-700',
          (ui === 'busy' || ui === 'done') && 'translate-x-full'
        )}
      />

      {/* konten ikon + label (tanpa tumpang tindih) */}
      <span className="relative z-10 flex w-full items-center justify-center gap-2">
        {/* ikon: cart saat idle/busy, centang saat done */}
        {ui === 'done' ? (
          <Check className="h-5 w-5" />
        ) : (
          <ShoppingCart className="h-5 w-5" />
        )}

        {/* satu label yang berganti teks */}
        <span className="truncate">{label}</span>
      </span>
    </button>
  );
}
