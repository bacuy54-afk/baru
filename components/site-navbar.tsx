"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Store } from "lucide-react";
import CartButton from "@/components/site/cart-button";
import { useEffect, useState } from "react";

function NavItem({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      className={[
        "rounded-full px-4 py-2 text-sm font-medium transition",
        active
          ? "bg-white text-black"
          : "text-white/80 hover:text-white hover:bg-white/10",
      ].join(" ")}
    >
      {children}
    </Link>
  );
}

export default function SiteNavbar() {
  // nilai 0..1: 0 = di atas; 1 = sudah melewati ambang & makin hilang
  const [fade, setFade] = useState(0);

  useEffect(() => {
    const THRESHOLD = 240; // px – mulai samar, makin turun makin hilang
    const onScroll = () => {
      const y = window.scrollY || 0;
      const t = Math.min(1, Math.max(0, y / THRESHOLD));
      setFade(t);
    };
    onScroll(); // inisialisasi
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // turunkan opacity (1→0), naikkan blur (2→16px), tipiskan background (0.7→0)
  const opacity = 1 - fade;
  const bgAlpha = (1 - fade) * 0.7;            // hitam transparan
  const blur = 2 + fade * 14;                  // px
  const translateY = fade * -6;                // sedikit geser ke atas biar “menghilang”

  return (
    <nav className="sticky top-4 z-50 will-change-[opacity,filter,transform] transition-[opacity,transform] duration-200">
      <div
        className="container relative mx-auto flex h-14 items-center justify-center px-4"
        style={{
          opacity,
          transform: `translateY(${translateY}px)`,
        }}
      >
        {/* kiri: logo toko */}
        <Link
          href="/"
          aria-label="Beranda"
          className="absolute left-4 flex h-10 w-10 items-center justify-center rounded-xl ring-1 ring-white/10"
          style={{
            backgroundColor: `rgba(0,0,0,${bgAlpha})`,
            backdropFilter: `blur(${blur}px)`,
            WebkitBackdropFilter: `blur(${blur}px)`,
          }}
        >
          <Store className="h-5 w-5 text-white/90" />
        </Link>

        {/* tengah: menu selalu center */}
        <div className="pointer-events-auto absolute left-1/2 -translate-x-1/2">
          <div
            className="flex items-center gap-1 rounded-full p-1 ring-1 ring-white/10"
            style={{
              backgroundColor: `rgba(0,0,0,${bgAlpha})`,
              backdropFilter: `blur(${blur}px)`,
              WebkitBackdropFilter: `blur(${blur}px)`,
            }}
          >
            <NavItem href="/">Home</NavItem>
            <NavItem href="/products">Product</NavItem>
            <NavItem href="/contact">Contact</NavItem>
          </div>
        </div>

        {/* kanan: cart */}
        <div className="absolute right-4">
          <CartButton />
        </div>
      </div>
    </nav>
  );
}
