import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/cn';

interface RatingStarsProps {
  rating: number;
  reviewCount?: number;
  size?: 'sm' | 'md' | 'lg';
  showNumber?: boolean;
  className?: string;
}

const iconSizes = {
  sm: 'h-3 w-3',
  md: 'h-3.5 w-3.5',
  lg: 'h-4 w-4',
};

const textSizes = {
  sm: 'text-[11px]',
  md: 'text-[12px]',
  lg: 'text-[13px]',
};

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  reviewCount,
  size = 'sm',
  showNumber = true,
  className,
}) => (
  <span
    className={cn('inline-flex items-center gap-1', textSizes[size], className)}
    aria-label={`Rated ${rating.toFixed(1)} out of 5${reviewCount ? ` from ${reviewCount} reviews` : ''}`}
  >
    <Star className={cn(iconSizes[size], 'shrink-0 fill-amber text-amber')} aria-hidden="true" />
    {showNumber && <span className="numeric font-bold text-charcoal">{rating.toFixed(1)}</span>}
    {reviewCount !== undefined && (
      <span className="numeric font-medium text-charcoal-muted">({reviewCount})</span>
    )}
  </span>
);
