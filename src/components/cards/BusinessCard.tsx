import React from 'react';
import Link from 'next/link';
import { Star, ArrowUpRight } from 'lucide-react';
import { SmartImage } from '@/components/ui/SmartImage';
import { cn } from '@/lib/cn';

interface BusinessCardProps {
  name: string;
  category: string;
  neighbourhood: string;
  image: string;
  href: string;
  rating?: number;
  meta?: string;
  tag?: string;
  className?: string;
}

export const BusinessCard: React.FC<BusinessCardProps> = ({
  name,
  category,
  neighbourhood,
  image,
  href,
  rating,
  meta,
  tag,
  className,
}) => (
  <Link
    href={href}
    className={cn(
      'group flex gap-3.5 rounded-card border border-border bg-white p-3 shadow-card transition-all duration-300 ease-out-premium hover:-translate-y-0.5 hover:border-brand/20 hover:shadow-lift',
      className,
    )}
  >
    <SmartImage
      src={image}
      alt={name}
      ratio="aspect-square"
      className="w-[82px] shrink-0 rounded-xl sm:w-[96px]"
      imgClassName="transition-transform duration-500 group-hover:scale-105"
      fallbackLabel={name}
    />
    <div className="flex min-w-0 flex-1 flex-col py-0.5">
      <div className="flex items-start justify-between gap-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-brand-secondary">{category}</span>
        {tag && (
          <span className="shrink-0 rounded-full bg-amber-wash px-2 py-0.5 text-[9.5px] font-bold text-[#8A5A12]">
            {tag}
          </span>
        )}
      </div>
      <h3 className="mt-0.5 truncate text-[14.5px] font-bold text-charcoal transition-colors group-hover:text-brand">
        {name}
      </h3>
      <p className="mt-0.5 truncate text-[11.5px] text-charcoal-secondary">{neighbourhood}</p>
      <div className="mt-auto flex items-center gap-2 pt-1.5 text-[11px] text-charcoal-secondary">
        {rating !== undefined && (
          <span className="inline-flex items-center gap-1 font-bold text-charcoal">
            <Star className="h-3 w-3 fill-amber text-amber" />
            {rating.toFixed(1)}
          </span>
        )}
        {meta && <span className="truncate">{meta}</span>}
        <ArrowUpRight className="ml-auto h-3.5 w-3.5 text-charcoal-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </div>
    </div>
  </Link>
);
