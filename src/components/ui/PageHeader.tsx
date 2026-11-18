import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface Crumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  breadcrumb?: Crumb[];
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  meta?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  breadcrumb,
  eyebrow,
  title,
  description,
  actions,
  meta,
  className,
}) => (
  <header className={cn('pb-7 pt-7 sm:pb-9 sm:pt-9', className)}>
    {breadcrumb && breadcrumb.length > 0 && (
      <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1.5 text-[11.5px] font-semibold text-charcoal-muted">
        {breadcrumb.map((crumb, index) => (
          <React.Fragment key={`${crumb.label}-${index}`}>
            {index > 0 && <ChevronRight className="h-3 w-3 shrink-0 text-charcoal-muted/60" aria-hidden="true" />}
            {crumb.href ? (
              <Link href={crumb.href} className="transition-colors hover:text-brand">
                {crumb.label}
              </Link>
            ) : (
              <span className="text-charcoal">{crumb.label}</span>
            )}
          </React.Fragment>
        ))}
      </nav>
    )}

    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0 max-w-2xl">
        {eyebrow && (
          <span className="mb-2.5 flex items-center gap-2 text-micro uppercase text-brand-secondary">
            <span className="h-px w-5 bg-brand/40" aria-hidden="true" />
            {eyebrow}
          </span>
        )}
        <h1 className="text-h1 text-charcoal">{title}</h1>
        {description && <p className="mt-2 max-w-xl text-body text-charcoal-secondary">{description}</p>}
        {meta && <div className="mt-4 flex flex-wrap items-center gap-2">{meta}</div>}
      </div>

      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2.5">{actions}</div>}
    </div>
  </header>
);
