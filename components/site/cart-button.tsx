"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart";

/* Portalized toast — selalu fixed ke viewport */
function CartToast({ message }: { message: string | null }) {
  if (!message || typeof window === "undefined") return null;
  return createPortal(
    <div
      className="
        fixed bottom-6 right-6 z-[1000]
        pointer-events-none select-none
        px-3 py-2 rounded-lg
        bg-white/90 text-black text-sm font-medium shadow-lg
        backdrop-blur
      "
    >
      {message}
    </div>,
    document.body
  );
}

export default function CartButton() {
  const { count } = useCart();
  const itemsCount = count();

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    const onAdded = (e: Event) => {
      const name = (e as CustomEvent).detail?.name as string | undefined;
      setToastMsg(name ? `${name} ditambahkan ke keranjang` : "Produk ditambahkan");
      const t = window.setTimeout(() => setToastMsg(null), 1800);
      // cleanup timeout untuk event ini
      return () => window.clearTimeout(t);
    };

    window.addEventListener("cart:added", onAdded as EventListener);
    return () => window.removeEventListener("cart:added", onAdded as EventListener);
  }, []);

  return (
    <>
      <Link
        href="/cart"
        aria-label="Keranjang"
        className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-black/70 ring-1 ring-white/10 backdrop-blur transition hover:bg-black/80"
      >
        <ShoppingCart className="h-5 w-5 text-white/90" />
        {itemsCount > 0 && (
          <span className="absolute -right-1 -top-1 rounded-full bg-white px-1.5 text-xs font-semibold text-black">
            {itemsCount}
          </span>
        )}
      </Link>

      {/* 🔒 toast sekarang dipasang ke document.body, tidak ikut navbar */}
      <CartToast message={toastMsg} />
    </>
  );
}
