import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/cn';

interface SectionHeadingProps {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: { label: string; href: string };
  align?: 'left' | 'center';
  className?: string;
  tone?: 'light' | 'dark';
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  title,
  description,
  action,
  align = 'left',
  className,
  tone = 'light',
}) => {
  const dark = tone === 'dark';
  return (
    <div
      className={cn(
        'mb-7 flex flex-col gap-4 sm:mb-9',
        action ? 'sm:flex-row sm:items-end sm:justify-between' : '',
        align === 'center' ? 'items-center text-center' : '',
        className,
      )}
    >
      <div className={cn('max-w-2xl', align === 'center' && 'mx-auto')}>
        {eyebrow && (
          <span className={cn('mb-2 flex items-center gap-2 text-micro uppercase', dark ? 'text-amber' : 'text-brand-secondary')}>
            <span className={cn('h-px w-5', dark ? 'bg-amber/70' : 'bg-brand/40')} aria-hidden="true" />
            {eyebrow}
          </span>
        )}
        <h2 className={cn('text-h1', dark ? 'text-white' : 'text-charcoal')}>{title}</h2>
        {description && (
          <p className={cn('mt-2 text-body', dark ? 'text-white/65' : 'text-charcoal-secondary')}>
            {description}
          </p>
        )}
      </div>

      {action && (
        <Link
          href={action.href}
          className={cn(
            'group inline-flex shrink-0 items-center gap-2 text-label font-bold transition-colors',
            dark ? 'text-amber hover:text-white' : 'text-brand hover:text-brand-secondary',
          )}
        >
          {action.label}
          <span
            className={cn(
              'flex h-7 w-7 items-center justify-center rounded-full transition-all group-hover:translate-x-0.5',
              dark ? 'bg-white/10 group-hover:bg-white/20' : 'bg-sage group-hover:bg-brand group-hover:text-white',
            )}
          >
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </Link>
      )}
    </div>
  );
};
