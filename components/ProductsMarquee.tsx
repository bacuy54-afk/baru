'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';
import { cn } from '@/lib/utils';

type Item = {
  id: string;
  name: string;
  price: number;
  originalPrice?: number | null;
  image?: string | null;
  category?: string | null;
};

export default function ProductsMarquee({ items }: { items: Item[] }) {
  // gandakan array agar loop mulus
  const looped = useMemo(() => [...items, ...items], [items]);

  return (
    <div className="relative overflow-hidden">
      <div className="group flex gap-4 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="animate-marquee flex shrink-0 gap-4 group-hover:[animation-play-state:paused]">
          {looped.map((p, i) => (
            <CardProduct key={`${p.id}-${i}`} item={p} />
          ))}
        </div>
      </div>
    </div>
  );
}

function CardProduct({ item }: { item: Item }) {
  return (
    <Link
      href={`/products/${item.id}`}
      className={cn(
        'w-[320px] overflow-hidden rounded-2xl border border-white/10 bg-white/10 text-white backdrop-blur',
        'shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl'
      )}
    >
      {item.image ? (
        <Image
          src={item.image}
          alt={item.name}
          width={640}
          height={400}
          className="h-36 w-full object-cover"
        />
      ) : (
        <div className="h-36 w-full bg-white/10" />
      )}
      <div className="space-y-1 p-4">
        <div className="line-clamp-1 font-semibold">{item.name}</div>
        <div className="text-emerald-300">
          Rp {Number(item.price).toLocaleString('id-ID')}
        </div>
        {item.originalPrice ? (
          <div className="text-xs text-white/70 line-through">
            Rp {Number(item.originalPrice).toLocaleString('id-ID')}
          </div>
        ) : null}
      </div>
    </Link>
  );
}
