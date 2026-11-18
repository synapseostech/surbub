'use client';

import React from 'react';
import { cn } from '@/lib/cn';

interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  icon?: React.ReactNode;
}

/**
 * Filter chip used across category pages and dashboards.
 * Inactive chips stay quiet; the active chip is the only forest-green element
 * in the row so the page keeps a single clear point of focus.
 */
export const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(function Chip(
  { active, icon, className, children, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      aria-pressed={active}
      className={cn(
        'inline-flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 text-label transition-all duration-200 ease-out-premium',
        active
          ? 'border-brand bg-brand text-white shadow-card'
          : 'border-border bg-white text-charcoal-secondary hover:border-brand/25 hover:bg-ivory-soft hover:text-brand',
        className,
      )}
      {...props}
    >
      {icon && <span className="[&>svg]:h-3.5 [&>svg]:w-3.5">{icon}</span>}
      {children}
    </button>
  );
});
