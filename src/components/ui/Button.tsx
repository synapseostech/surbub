'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'amber' | 'outline' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg' | 'icon';

const variants: Record<Variant, string> = {
  primary:
    'bg-brand text-white shadow-card hover:bg-brand-hover active:bg-brand-deep disabled:bg-brand/40',
  secondary:
    'bg-sage text-brand hover:bg-sage-dark active:bg-sage-dark disabled:bg-sage/60',
  amber:
    'bg-amber text-brand-deep shadow-card hover:bg-amber-hover active:bg-amber-hover disabled:bg-amber/50',
  outline:
    'border border-border bg-white text-charcoal hover:border-brand/35 hover:bg-ivory-soft active:bg-ivory-deep',
  ghost:
    'text-charcoal hover:bg-sage-light active:bg-sage disabled:text-charcoal-muted',
  danger:
    'bg-status-error text-white hover:brightness-95 active:brightness-90',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-label gap-1.5 rounded-[10px]',
  md: 'h-11 px-5 text-label gap-2 rounded-xl',
  lg: 'h-[52px] px-6 text-body font-bold gap-2 rounded-[14px]',
  icon: 'h-10 w-10 rounded-xl',
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  href?: string;
  loading?: boolean;
  fullWidth?: boolean;
}

const base =
  'inline-flex select-none items-center justify-center font-semibold transition-all duration-200 ease-out-premium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-70 whitespace-nowrap';

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = 'primary', size = 'md', href, loading, fullWidth, children, disabled, ...props },
  ref,
) {
  const classes = cn(base, variants[variant], sizes[size], fullWidth && 'w-full', className);

  if (href) {
    return (
      <Link
        href={href}
        className={classes}
        aria-disabled={disabled}
        onClick={props.onClick as unknown as React.MouseEventHandler<HTMLAnchorElement>}
      >
        {children}
      </Link>
    );
  }

  return (
    <button ref={ref} className={classes} disabled={disabled || loading} {...props}>
      {loading && (
        <span
          className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden="true"
        />
      )}
      {children}
    </button>
  );
});
