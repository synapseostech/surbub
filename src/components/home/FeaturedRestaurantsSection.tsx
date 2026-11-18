import React from 'react';
import Link from 'next/link';
import { ArrowRight, MapPin, Star } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { RestaurantCard } from '@/components/cards/RestaurantCard';
import { MOCK_RESTAURANTS } from '@/data/mock/restaurants';

export const FeaturedRestaurantsSection: React.FC = () => {
  const featured = MOCK_RESTAURANTS.slice(0, 3);
  const filters = [
    { label: 'All kitchens', href: '/restaurants', active: true },
    { label: 'Muchomo & grill', href: '/restaurants?category=grill_bbq' },
    { label: 'Campus bites', href: '/restaurants?category=snacks_rolex' },
    { label: 'Cafés', href: '/restaurants?category=breakfast' },
  ];

  return (
    <section className="border-b border-border bg-white py-12 sm:py-16">
      <div className="page-container">
        <SectionHeading
          eyebrow="Restaurant recommendations"
          title="Where the neighbourhood eats."
          description="Honest local kitchens, from charcoal grills to campus chapati counters."
          action={{ label: 'All restaurants', href: '/restaurants' }}
        />

        <div className="no-scrollbar mb-6 flex gap-2 overflow-x-auto pb-1">
          {filters.map((f) => (
            <Link
              key={f.label}
              href={f.href}
              className={`shrink-0 rounded-full border px-3.5 py-1.5 text-[11.5px] font-semibold transition-colors ${
                f.active
                  ? 'border-brand bg-brand text-white'
                  : 'border-border bg-white text-charcoal-secondary hover:border-brand/25 hover:text-brand'
              }`}
            >
              {f.label}
            </Link>
          ))}
          <span className="ml-auto hidden shrink-0 items-center gap-1.5 text-[11px] text-charcoal-muted sm:flex">
            <MapPin className="h-3.5 w-3.5 text-brand" />
            Delivering across Ishaka–Bushenyi
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((restaurant, i) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} priority={i === 0} />
          ))}
        </div>
      </div>
    </section>
  );
};
