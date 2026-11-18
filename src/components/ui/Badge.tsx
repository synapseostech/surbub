import React from 'react';
import { cn } from '@/lib/cn';

type Tone = 'brand' | 'sage' | 'amber' | 'neutral' | 'success' | 'warning' | 'error' | 'dark';

const tones: Record<Tone, string> = {
  brand: 'bg-brand text-white',
  sage: 'bg-sage text-brand',
  amber: 'bg-amber-wash text-[#8A5A12] ring-1 ring-inset ring-amber/25',
  neutral: 'bg-ivory text-charcoal-secondary ring-1 ring-inset ring-border',
  success: 'bg-status-successSoft text-status-success ring-1 ring-inset ring-status-success/20',
  warning: 'bg-status-warningSoft text-[#8A5A12] ring-1 ring-inset ring-status-warning/25',
  error: 'bg-status-errorSoft text-status-error ring-1 ring-inset ring-status-error/20',
  dark: 'bg-brand-deep/80 text-white ring-1 ring-inset ring-white/15 backdrop-blur',
};

export const Badge: React.FC<{
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
  dot?: boolean;
}> = ({ children, tone = 'neutral', className, dot }) => (
  <span
    className={cn(
      'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold leading-none tracking-tight',
      tones[tone],
      className,
    )}
  >
    {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />}
    {children}
  </span>
);
