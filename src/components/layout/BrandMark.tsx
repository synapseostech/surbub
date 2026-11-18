import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/cn';

export const BrandMark: React.FC<{
  className?: string;
  compact?: boolean;
  tone?: 'light' | 'dark';
  href?: string;
}> = ({ className, compact, tone = 'light', href = '/' }) => (
  <Link
    href={href}
    aria-label="SUBURB+ home"
    className={cn('group inline-flex items-center gap-2.5', className)}
  >
    <span className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-[13px] bg-brand text-white shadow-card transition-transform duration-300 group-hover:-rotate-3">
      <span className="text-[19px] font-extrabold leading-none tracking-[-0.08em]">S</span>
      <span className="absolute right-[7px] top-[7px] h-[5px] w-[5px] rounded-full bg-amber" aria-hidden="true" />
    </span>
    {!compact && (
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            'text-[21px] font-extrabold tracking-[-0.05em]',
            tone === 'dark' ? 'text-white' : 'text-brand',
          )}
        >
          SUBURB<span className="text-amber">+</span>
        </span>
        <span
          className={cn(
            'mt-1 hidden whitespace-nowrap text-[8.5px] font-bold uppercase tracking-[0.16em] sm:block',
            tone === 'dark' ? 'text-white/55' : 'text-charcoal-secondary',
          )}
        >
          Neighbourhood, elevated
        </span>
      </span>
    )}
  </Link>
);
