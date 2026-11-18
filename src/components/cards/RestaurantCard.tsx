import React from 'react';
import Link from 'next/link';
import { Clock, Bike, Star, BadgeCheck } from 'lucide-react';
import type { Restaurant } from '@/types/restaurant';
import { SmartImage } from '@/components/ui/SmartImage';
import { Currency } from '@/components/common/Currency';
import { cn } from '@/lib/cn';

interface RestaurantCardProps {
  restaurant: Restaurant;
  className?: string;
  priority?: boolean;
  compact?: boolean;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant, className, priority, compact }) => (
  <Link
    href={`/restaurants/${restaurant.id}`}
    className={cn(
      'group flex flex-col overflow-hidden rounded-card border border-border bg-white shadow-card transition-all duration-300 ease-out-premium hover:-translate-y-1 hover:border-brand/20 hover:shadow-lift',
      className,
    )}
  >
    <div className="relative">
      <SmartImage
        src={restaurant.bannerImage}
        alt={restaurant.name}
        ratio={compact ? 'aspect-[16/10]' : 'aspect-[4/3]'}
        imgClassName="transition-transform duration-500 ease-out-premium group-hover:scale-[1.04]"
        priority={priority}
        fallbackLabel={restaurant.name}
      />
      <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
        <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[10.5px] font-bold text-brand-deep shadow-sm">
          <BadgeCheck className="h-3 w-3 text-brand" />
          {restaurant.isVerified ? 'Verified local' : 'Local kitchen'}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-brand-deep/80 px-2.5 py-1 text-[10.5px] font-bold text-white backdrop-blur">
          <Star className="h-3 w-3 fill-amber text-amber" />
          {restaurant.rating.toFixed(1)}
          <span className="font-medium text-white/55">({restaurant.reviewCount})</span>
        </span>
      </div>
      <div className="absolute inset-x-3 bottom-3 flex items-end justify-between">
        <span className="rounded-lg bg-white px-2 py-1 text-[10.5px] font-bold text-charcoal shadow-sm">
          {restaurant.location.neighborhood}
        </span>
        <span className="rounded-lg bg-brand px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
          {restaurant.priceRange === 'UGX' ? 'Budget' : restaurant.priceRange === 'UGX UGX' ? 'Mid-range' : 'Premium'}
        </span>
      </div>
    </div>

    <div className="flex flex-1 flex-col p-4">
      <h3 className="text-card text-charcoal transition-colors group-hover:text-brand">{restaurant.name}</h3>
      <p className="mt-1 line-clamp-2 text-[12.5px] leading-relaxed text-charcoal-secondary">
        {restaurant.tagline}
      </p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {restaurant.cuisine.slice(0, 3).map((c) => (
          <span key={c} className="rounded-md bg-ivory px-2 py-1 text-[10.5px] font-semibold text-charcoal-secondary">
            {c}
          </span>
        ))}
      </div>

      <div className="mt-auto flex items-center justify-between gap-2 border-t border-border pt-3 text-[11.5px] text-charcoal-secondary">
        <span className="inline-flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-brand" />
          {restaurant.deliveryTimeEstimate}
        </span>
        <span className="inline-flex items-center gap-1.5 font-semibold text-brand">
          <Bike className="h-3.5 w-3.5" />
          <Currency amount={restaurant.averageDeliveryFee} showPrefix={false} className="font-semibold text-brand" />
          <span className="font-medium text-charcoal-secondary">delivery</span>
        </span>
      </div>
    </div>
  </Link>
);
