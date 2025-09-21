// components/ThreeDCarousel.tsx
"use client";

import React, { useRef, useEffect, useState, TouchEvent } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

/** =========================
 *  TIPE DATA
 * ======================== */
export interface ThreeDCarouselItem {
  id: number | string;
  title: string;
  brand: string;
  description: string;
  tags: string[];
  imageUrl: string;
  link: string; // bisa /products/xxx atau url luar
}

interface ThreeDCarouselProps {
  items: ThreeDCarouselItem[];
  autoRotate?: boolean;
  rotateInterval?: number;
  cardHeight?: number;
  className?: string;
  title?: string;
  subtitle?: string;
  isMobileSwipe?: boolean;
}

/** =========================
 *  KOMPONEN
 * ======================== */
const ThreeDCarousel: React.FC<ThreeDCarouselProps> = ({
  items,
  autoRotate = true,
  rotateInterval = 4500,
  cardHeight = 360, // lebih rendah supaya tidak menutupi hero
  className,
  title,
  subtitle,
  isMobileSwipe = true,
}) => {
  const [active, setActive] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const minSwipeDistance = 50;

  // observer untuk pause saat keluar viewport
  useEffect(() => {
    if (!containerRef.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.2 }
    );
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  // autorotate
  useEffect(() => {
    if (!autoRotate || !isInView || isHovering) return;
    const id = setInterval(
      () => setActive((p) => (p + 1) % items.length),
      rotateInterval
    );
    return () => clearInterval(id);
  }, [autoRotate, isInView, isHovering, rotateInterval, items.length]);

  // swipe mobile
  const onTouchStart = (e: TouchEvent) => {
    if (!isMobileSwipe) return;
    setTouchStart(e.targetTouches[0].clientX);
    setTouchEnd(null);
  };
  const onTouchMove = (e: TouchEvent) => {
    if (!isMobileSwipe) return;
    setTouchEnd(e.targetTouches[0].clientX);
  };
  const onTouchEnd = () => {
    if (!isMobileSwipe || touchStart === null || touchEnd === null) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) {
      setActive((p) => (p + 1) % items.length);
    } else if (distance < -minSwipeDistance) {
      setActive((p) => (p - 1 + items.length) % items.length);
    }
  };

  // animasi posisi kartu: lebih soft dan tidak terlalu melebar
  const getCardClass = (idx: number) => {
    if (idx === active) return "z-20 scale-100 opacity-100";
    if (idx === (active + 1) % items.length)
      return "z-10 translate-x-[22%] scale-95 opacity-60";
    if (idx === (active - 1 + items.length) % items.length)
      return "z-10 -translate-x-[22%] scale-95 opacity-60";
    return "opacity-0 scale-90";
  };

  return (
    <section
      ref={containerRef}
      className={["w-full px-4 md:px-6", className].filter(Boolean).join(" ")}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {title || subtitle ? (
        <div className="mx-auto mb-6 max-w-6xl text-center">
          {title && (
            <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
          )}
          {subtitle && (
            <p className="mt-1 text-sm md:text-base text-muted-foreground">
              {subtitle}
            </p>
          )}
        </div>
      ) : null}

      <div
        className="relative mx-auto h-[420px] md:h-[480px] max-w-6xl"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* TRACK */}
        <div className="absolute inset-0 flex items-center justify-center">
          {items.map((item, idx) => (
            <div
              key={item.id}
              className={`absolute transition-all duration-500 ease-out will-change-transform ${getCardClass(
                idx
              )}`}
              style={{ width: "min(92%, 720px)" }}
            >
              {/* KARTU */}
              <div
                className="overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/60 backdrop-blur-xl shadow-[0_10px_50px_-20px_rgba(0,0,0,0.5)]"
                style={{ height: cardHeight }}
              >
                {/* HEADER GAMBAR */}
                <div className="relative h-44 w-full">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 720px"
                    className="object-cover"
                    priority={idx === active}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <div className="text-sm text-white/70">{item.brand}</div>
                    <h3 className="mt-0.5 text-xl font-semibold text-white">
                      {item.title}
                    </h3>
                  </div>
                </div>

                {/* BODY */}
                <div className="p-5">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {item.description}
                  </p>

                  {/* TAGS */}
                  {item.tags?.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {item.tags.map((t, i) => (
                        <span
                          key={`${item.id}-${t}-${i}`}
                          className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-muted-foreground"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* LINK */}
                  <div className="mt-5">
                    <Link
                      href={item.link}
                      className="inline-flex items-center gap-2 text-sm text-foreground hover:opacity-80 transition"
                    >
                      Lihat detail <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
              {/* /KARTU */}
            </div>
          ))}
        </div>

        {/* NAV BUTTONS */}
        <button
          className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full border border-white/10 bg-white/10 text-white grid place-items-center backdrop-blur hover:bg-white/20 transition"
          onClick={() =>
            setActive((p) => (p - 1 + items.length) % items.length)
          }
          aria-label="Sebelumnya"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <button
          className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full border border-white/10 bg-white/10 text-white grid place-items-center backdrop-blur hover:bg-white/20 transition"
          onClick={() => setActive((p) => (p + 1) % items.length)}
          aria-label="Berikutnya"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* DOTS */}
        <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`h-1.5 rounded-full transition-all ${
                active === i ? "w-6 bg-white" : "w-2.5 bg-white/40"
              }`}
              aria-label={`Ke item ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ThreeDCarousel;
