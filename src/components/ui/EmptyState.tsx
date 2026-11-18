import React from 'react';
import { Button } from './Button';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  children?: React.ReactNode;
  compact?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
  children,
  compact,
}) => (
  <div
    className={`flex flex-col items-center justify-center rounded-card border border-dashed border-border bg-ivory-soft px-6 text-center ${
      compact ? 'py-10' : 'py-16'
    }`}
  >
    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-sage bg-sage-light text-brand">
      {icon}
    </div>
    <h3 className="text-card text-charcoal">{title}</h3>
    <p className="mt-1.5 max-w-sm text-label leading-relaxed text-charcoal-secondary">{description}</p>
    {children}
    {actionLabel && actionHref && (
      <Button href={actionHref} size="sm" className="mt-5">
        {actionLabel}
      </Button>
    )}
  </div>
);
