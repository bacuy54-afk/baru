'use client';

import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { cn } from '@/lib/utils';

type Props = {
  children: React.ReactNode;
  disabled?: boolean;
  speed?: number;            // detik (lebih besar = lebih pelan)
  className?: string;
  size?: 'xs'|'sm'|'base'|'lg'|'xl'|'2xl'|'3xl'|'4xl'|'5xl'|'6xl';
  weight?: 'normal'|'medium'|'semibold'|'bold'|'extrabold'|'black';
  baseColor?: string;        // warna dasar teks
  shineColor?: string;       // warna kilau
  intensity?: number;        // 0–1
  direction?: 'left-to-right'|'right-to-left'|'top-to-bottom'|'bottom-to-top';
  shineWidth?: number;       // lebar kilau (%)
  delay?: number;
  repeat?: number | 'infinite';
  pauseOnHover?: boolean;
  gradientType?: 'linear'|'radial';
};

const sizeMap = {
  xs:'text-xs', sm:'text-sm', base:'text-base', lg:'text-lg',
  xl:'text-xl', '2xl':'text-2xl', '3xl':'text-3xl',
  '4xl':'text-4xl', '5xl':'text-5xl', '6xl':'text-6xl',
} as const;

const weightMap = {
  normal:'font-normal', medium:'font-medium', semibold:'font-semibold',
  bold:'font-bold', extrabold:'font-extrabold', black:'font-black',
} as const;

const dir = {
  'left-to-right':  { pos: ['100% 0%','-100% 0%'], size: '200% 100%' },
  'right-to-left':  { pos: ['-100% 0%','100% 0%'],  size: '200% 100%' },
  'top-to-bottom':  { pos: ['0% 100%','0% -100%'],  size: '100% 200%' },
  'bottom-to-top':  { pos: ['0% -100%','0% 100%'],  size: '100% 200%' },
} as const;

export default function ShinyText({
  children, disabled=false, speed=14, className, size='base', weight='bold',
  baseColor, shineColor, intensity=1, direction='left-to-right',
  shineWidth=40, delay=0, repeat='infinite', pauseOnHover=false, gradientType='linear',
}: Props) {
  const conf = dir[direction];
  const gradDir =
    direction === 'left-to-right' || direction === 'right-to-left' ? '90deg' :
    direction === 'top-to-bottom' ? '180deg' : '0deg';

  const base = baseColor  ?? 'rgba(255,255,255,0.75)';
  const shine = shineColor ?? '#ffffff';

  const makeGradient = () => {
    const start = Math.max(0, 50 - shineWidth/2);
    const end   = Math.min(100, 50 + shineWidth/2);
    return gradientType === 'linear'
      ? `linear-gradient(${gradDir}, ${base}, transparent ${start-5}%,
          ${shine} ${start}%, ${shine} ${end}%,
          transparent ${end+5}%, ${base})`
      : `radial-gradient(ellipse at center, ${shine} ${intensity*100}%, transparent)`;
  };

  const variants: Variants = {
    initial: { backgroundPosition: conf.pos[0] },
    animate: disabled ? {
      backgroundPosition: conf.pos[0],
      transition: { duration: 0, delay: 0, repeat: 0, ease: 'linear' },
    } : {
      backgroundPosition: conf.pos[1],
      transition: { duration: speed, delay, repeat: (repeat==='infinite'?Infinity:repeat), ease: 'linear' },
    },
    hover: pauseOnHover ? {} : {},
  };

  if (disabled) {
    return (
      <span className={cn('inline-block text-foreground', sizeMap[size], weightMap[weight], className)}>
        {children}
      </span>
    );
  }

  return (
    <motion.span
      className={cn('inline-block bg-clip-text !text-transparent', sizeMap[size], weightMap[weight], className)}
      style={{
        backgroundImage: makeGradient(),
        backgroundSize: conf.size,
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        opacity: intensity,
      }}
      variants={variants}
      initial="initial"
      animate="animate"
      whileHover="hover"
    >
      {children}
    </motion.span>
  );
}
