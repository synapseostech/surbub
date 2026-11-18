import React from 'react';
import { SmartImage } from '@/components/ui/SmartImage';
import { Currency } from '@/components/common/Currency';
import { Badge } from '@/components/ui/Badge';
import type { PharmacyProduct } from '@/types/pharmacy';
import { cn } from '@/lib/cn';

interface ProductCardProps {
  product: PharmacyProduct;
  pharmacyName?: string;
  lowestPriceUGX?: number;
  onClick?: () => void;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  pharmacyName,
  lowestPriceUGX,
  onClick,
  className,
}) => (
  <article
    className={cn(
      'group flex flex-col overflow-hidden rounded-card border border-border bg-white shadow-card transition-all duration-300 hover:border-brand/20 hover:shadow-lift',
      className,
    )}
  >
    <button
      type="button"
      onClick={onClick}
      className="relative block w-full text-left"
      aria-label={`View ${product.name} price comparison`}
    >
      <SmartImage
        src={product.image}
        alt={product.name}
        ratio="aspect-[5/4]"
        className="bg-ivory"
        imgClassName="object-contain p-5 mix-blend-multiply transition-transform duration-500 group-hover:scale-[1.03]"
        fallbackLabel={product.name}
      />
      <div className="absolute left-2.5 top-2.5 flex flex-wrap gap-1">
        {product.requiresPrescription ? (
          <Badge tone="warning">Prescription</Badge>
        ) : (
          <Badge tone="success">OTC</Badge>
        )}
      </div>
    </button>

    <div className="flex flex-1 flex-col border-t border-border p-4">
      <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-charcoal-muted">
        {product.dosageForm || product.category.replace(/_/g, ' ')}
      </p>
      <h3 className="mt-1 line-clamp-2 text-[13.5px] font-bold leading-snug text-charcoal">{product.name}</h3>
      {product.genericName && (
        <p className="mt-0.5 truncate text-[11px] text-charcoal-secondary">{product.genericName}</p>
      )}

      <div className="mt-3 flex items-end justify-between gap-2 border-t border-border pt-3">
        <div>
          <p className="text-[9.5px] font-bold uppercase tracking-[0.1em] text-charcoal-muted">From</p>
          <Currency
            amount={lowestPriceUGX ?? product.standardPriceUGX}
            className="text-[15px] font-extrabold text-brand"
          />
        </div>
        {pharmacyName ? (
          <span className="max-w-[45%] truncate text-right text-[10.5px] font-semibold text-charcoal-secondary">
            {pharmacyName}
          </span>
        ) : (
          <span className="text-[10.5px] font-semibold text-brand-secondary">Compare prices</span>
        )}
      </div>
    </div>
  </article>
);
