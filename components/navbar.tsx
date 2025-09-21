'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Store, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/lib/cart';

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Product' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const cartCount = useCart((s) => s.count());
  const [progress, setProgress] = useState(0); // 0 -> terlihat, 1 -> hilang

  // Listener scroll: progres = scroll/tinggiAmbang
  useEffect(() => {
    const THRESHOLD = 260; // px — atur selera
    const onScroll = () => {
      const p = Math.min(1, Math.max(0, window.scrollY / THRESHOLD));
      setProgress(p);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Opacity makin kecil, blur makin besar ketika discroll
  const opacity = useMemo(() => 1 - progress, [progress]);
  const blurPx = useMemo(() => Math.round(16 * progress), [progress]); // 0px → 16px

  return (
    <header
      className="fixed inset-x-0 top-3 z-50 flex items-start justify-center px-4 pointer-events-none"
      style={{ opacity }}
    >
      {/* wrapper transparan yang makin blur saat discroll */}
      <div
        className="relative flex w-full max-w-5xl items-center justify-between"
        style={{ backdropFilter: `blur(${blurPx}px)` }}
      >
        {/* Left: store icon */}
        <Link
          href="/"
          className="pointer-events-auto inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/6 border border-white/10 text-white hover:bg-white/10 transition"
          aria-label="Beranda"
        >
          <Store className="h-5 w-5" />
        </Link>

        {/* Center: pill nav */}
        <nav
          className="
            pointer-events-auto
            mx-4 flex items-center gap-1 rounded-full
            bg-black/60 text-white
            border border-white/10 shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset]
            px-2 py-1
          "
        >
          {NAV.map((item) => {
            const active =
              item.href === '/'
                ? pathname === '/'
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'relative rounded-full px-5 py-2 text-sm transition',
                  'hover:bg-white/10',
                  active &&
                    'bg-white text-black shadow-sm hover:bg-white text-sm'
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: cart with badge */}
        <Link
          href="/cart"
          className="pointer-events-auto relative inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/6 border border-white/10 text-white hover:bg-white/10 transition"
          aria-label="Keranjang"
        >
          <ShoppingCart className="h-5 w-5" />
          {cartCount > 0 && (
            <span
              className="
                absolute -top-1 -right-1 min-w-[18px] h-[18px]
                rounded-full bg-emerald-500 text-[11px] leading-[18px]
                text-black font-semibold text-center px-1 shadow
              "
            >
              {cartCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
