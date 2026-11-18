import React from 'react';
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';
import { cn } from '@/lib/cn';

interface StatCardProps {
  label: string;
  value: React.ReactNode;
  hint?: string;
  trend?: { value: string; direction?: 'up' | 'down' | 'neutral' };
  icon?: React.ReactNode;
  tone?: 'default' | 'accent' | 'dark';
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  hint,
  trend,
  icon,
  tone = 'default',
  className,
}) => {
  const dark = tone === 'dark';
  const accent = tone === 'accent';
  const TrendIcon = trend?.direction === 'down' ? ArrowDownRight : trend?.direction === 'neutral' ? Minus : ArrowUpRight;

  return (
    <div
      className={cn(
        'flex flex-col justify-between rounded-card border p-5',
        dark
          ? 'border-brand-deep/40 bg-brand text-white shadow-card'
          : accent
            ? 'border-amber/30 bg-amber-wash'
            : 'border-border bg-white shadow-card',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className={cn('text-[10.5px] font-bold uppercase tracking-[0.12em]', dark ? 'text-white/55' : 'text-charcoal-muted')}>
          {label}
        </p>
        {icon && (
          <span
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-lg [&>svg]:h-4 [&>svg]:w-4',
              dark ? 'bg-white/10 text-amber' : 'bg-sage-light text-brand',
            )}
          >
            {icon}
          </span>
        )}
      </div>

      <div className="mt-4">
        <div className={cn('numeric text-[20px] font-extrabold leading-none tracking-[-0.03em] sm:text-[26px]', dark ? 'text-white' : 'text-charcoal')}>
          {value}
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
          {trend && (
            <span
              className={cn(
                'numeric inline-flex items-center gap-0.5 text-[11px] font-bold',
                dark ? 'text-amber' : trend.direction === 'down' ? 'text-status-error' : 'text-status-success',
              )}
            >
              <TrendIcon className="h-3 w-3" />
              {trend.value}
            </span>
          )}
          {hint && (
            <span className={cn('text-[11px]', dark ? 'text-white/55' : 'text-charcoal-secondary')}>{hint}</span>
          )}
        </div>
      </div>
    </div>
  );
};
