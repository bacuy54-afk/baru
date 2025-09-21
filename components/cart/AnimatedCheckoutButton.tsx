"use client";

import React, { useState } from "react";
import { ShoppingCart, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

type AnimatedCheckoutButtonProps = {
  onClick?: () => void;
  disabled?: boolean;
  label?: string;
  className?: string;
};

/**
 * Tombol checkout dengan animasi:
 * - Klik -> animasi cart "lari" + teks berubah "Processing..."
 * - Selesai -> icon centang "Done"
 * - Kembali ke normal setelah 1.8s
 *
 * Warna & radius mengikuti style situs (dark/emerald).
 */
export default function AnimatedCheckoutButton({
  onClick,
  disabled,
  label = "Checkout",
  className,
}: AnimatedCheckoutButtonProps) {
  const [phase, setPhase] = useState<"idle" | "running" | "done">("idle");

  const handleClick = async () => {
    if (disabled || phase !== "idle") return;
    setPhase("running");

    // Jalankan callback user
    try {
      await onClick?.();
    } finally {
      // Tampilkan "Done" sejenak lalu reset
      setPhase("done");
      setTimeout(() => setPhase("idle"), 1800);
    }
  };

  const isBusy = phase === "running";

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || isBusy}
      className={cn(
        "relative w-full h-12 rounded-xl",
        "bg-emerald-600 text-white font-semibold",
        "shadow-[0_6px_20px_rgba(16,185,129,0.35)]",
        "transition-all duration-300",
        "enabled:hover:bg-emerald-500 enabled:active:scale-[0.98]",
        "disabled:opacity-60 disabled:cursor-not-allowed",
        "overflow-hidden",
        className
      )}
    >
      {/* Icon cart yang “lari” saat klik */}
      <span
        className={cn(
          "absolute left-4 top-1/2 -translate-y-1/2",
          "transition-transform",
          phase === "running" ? "animate-cart-run" : ""
        )}
      >
        {phase === "done" ? (
          <CheckCircle2 className="h-5 w-5 text-white" />
        ) : (
          <ShoppingCart className="h-5 w-5 text-white" />
        )}
      </span>

      {/* Teks */}
      <span
        className={cn(
          "relative z-10",
          "transition-opacity duration-200",
          phase === "running" ? "opacity-70" : "opacity-100"
        )}
      >
        {phase === "idle" && label}
        {phase === "running" && "Processing..."}
        {phase === "done" && "Done"}
      </span>

      {/* Glow garis bergerak */}
      <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl">
        <span
          className={cn(
            "absolute -left-1/3 top-0 h-full w-1/3",
            "bg-white/20 blur-2xl",
            "transition-transform duration-700",
            phase !== "idle" ? "translate-x-[300%]" : "translate-x-0"
          )}
        />
      </span>

      {/* CSS animasi lokal */}
      <style jsx>{`
        @keyframes cart-run {
          0% {
            transform: translateY(-50%) translateX(0);
          }
          60% {
            transform: translateY(-50%) translateX(14px);
          }
          100% {
            transform: translateY(-50%) translateX(0);
          }
        }
        .animate-cart-run {
          animation: cart-run 700ms ease-in-out 1;
        }
      `}</style>
    </button>
  );
}
