'use client';

import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { cn } from '@/lib/utils';
import HomeCarousel from '@/components/HomeCarousel';

/* ===== ShinyText util ===== */

const sizeClasses = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
  '4xl': 'text-4xl',
} as const;

const weightClasses = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
  extrabold: 'font-extrabold',
} as const;

const directionConfig = {
  'left-to-right': {
    backgroundPosition: ['100% 0%', '-100% 0%'],
    backgroundSize: '200% 100%',
  },
  'right-to-left': {
    backgroundPosition: ['-100% 0%', '100% 0%'],
    backgroundSize: '200% 100%',
  },
  'top-to-bottom': {
    backgroundPosition: ['0% 100%', '0% -100%'],
    backgroundSize: '100% 200%',
  },
  'bottom-to-top': {
    backgroundPosition: ['0% -100%', '0% 100%'],
    backgroundSize: '100% 200%',
  },
} as const;

type ShinyTextProps = {
  children: React.ReactNode;
  disabled?: boolean;
  speed?: number;
  className?: string;
  size?: keyof typeof sizeClasses;
  weight?: keyof typeof weightClasses;
  baseColor?: string;
  shineColor?: string;
  intensity?: number;
  direction?: keyof typeof directionConfig;
  shineWidth?: number; // in percentage (0–100), 0 = tipis
  delay?: number;
  repeat?: number | 'infinite';
  pauseOnHover?: boolean;
  gradientType?: 'linear' | 'radial';
};

export function ShinyText({
  children,
  disabled = false,
  speed = 3,
  className,
  size = 'base',
  weight = 'medium',
  baseColor,
  shineColor,
  intensity = 1,
  direction = 'left-to-right',
  shineWidth = 0,
  delay = 0,
  repeat = 'infinite',
  pauseOnHover = false,
  gradientType = 'linear',
}: ShinyTextProps) {
  const config = directionConfig[direction];

  const gradientDirection =
    direction === 'left-to-right' || direction === 'right-to-left'
      ? '90deg'
      : direction === 'top-to-bottom'
      ? '180deg'
      : '0deg';

  const defaultBaseColor = 'hsl(var(--foreground)/20)';
  const defaultShineColor = 'hsl(var(--primary)/20)';
  const finalBaseColor = baseColor || defaultBaseColor;
  const finalShineColor = shineColor || defaultShineColor;

  const createGradient = () => {
    const s = Math.max(0, 50 - shineWidth / 2);
    const e = Math.min(100, 50 + shineWidth / 2);

    if (gradientType === 'radial') {
      return `radial-gradient(ellipse at center, ${finalShineColor} ${intensity * 100}%, transparent)`;
    }

    return `linear-gradient(${gradientDirection},
      ${finalBaseColor},
      transparent ${s - 5}%,
      ${finalShineColor} ${s}%,
      ${finalShineColor} ${e}%,
      transparent ${e + 5}%,
      ${finalBaseColor}
    )`;
  };

  const animation: Variants = {
    initial: { backgroundPosition: config.backgroundPosition[0] },
    animate: disabled
      ? {
          backgroundPosition: config.backgroundPosition[0],
          transition: { duration: 0, delay: 0, repeat: 0, ease: 'linear' },
        }
      : {
          backgroundPosition: config.backgroundPosition[1],
          transition: {
            duration: speed,
            delay,
            repeat: typeof repeat === 'number' ? repeat : Infinity,
            ease: 'linear',
          },
        },
    hover: pauseOnHover ? {} : {},
  };

  if (disabled) {
    return (
      <span
        className={cn(
          'inline-block text-foreground',
          sizeClasses[size],
          weightClasses[weight],
          className,
        )}
      >
        {children}
      </span>
    );
  }

  return (
    <motion.span
      className={cn(
        'inline-block bg-clip-text !text-transparent',
        sizeClasses[size],
        weightClasses[weight],
        className,
      )}
      style={{
        backgroundImage: createGradient(),
        backgroundSize: config.backgroundSize,
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        opacity: intensity,
      }}
      variants={animation}
      initial="initial"
      animate="animate"
      whileHover="hover"
    >
      {children}
    </motion.span>
  );
}

/* ===== Halaman Home ===== */

export default function Page() {
  return (
    <div className="px-6 pt-16 text-center">
      <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl">
        <ShinyText
          size="4xl"
          weight="extrabold"
          shineWidth={46}
          speed={16}
          intensity={1}
          baseColor="rgba(255,255,255,0.78)"
          shineColor="#ffffff"
          className="drop-shadow-[0_0_12px_rgba(255,255,255,0.22)]"
        >
          DigitalStore
        </ShinyText>
      </h1>

      <p className="mt-3 text-base md:text-lg">
        <ShinyText
          size="lg"
          weight="medium"
          shineWidth={40}
          speed={18}
          intensity={0.95}
          baseColor="rgba(255,255,255,0.66)"
          shineColor="#ffffff"
          className="drop-shadow-[0_0_8px_rgba(255,255,255,0.16)]"
        >
          Premium digital products—akun streaming, tools, dan lainnya.
        </ShinyText>
      </p>

      {/* Preview produk */}
      <HomeCarousel />
    </div>
  );
}
