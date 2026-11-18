import React from 'react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { BusinessCard } from '@/components/cards/BusinessCard';
import { MOCK_RESTAURANTS } from '@/data/mock/restaurants';
import { MOCK_PHARMACIES } from '@/data/mock/pharmacies';
import { MOCK_LAUNDRY_PROVIDERS } from '@/data/mock/laundry';
import { Badge } from '@/components/ui/Badge';
import { MapPin } from 'lucide-react';

const nearby = [
  {
    name: MOCK_RESTAURANTS[0].name,
    category: 'Restaurant & grill',
    neighbourhood: MOCK_RESTAURANTS[0].location.neighborhood,
    image: MOCK_RESTAURANTS[0].bannerImage,
    href: `/restaurants/${MOCK_RESTAURANTS[0].id}`,
    rating: MOCK_RESTAURANTS[0].rating,
    meta: `${MOCK_RESTAURANTS[0].deliveryTimeEstimate} · Open now`,
  },
  {
    name: MOCK_PHARMACIES[0].name,
    category: 'Community pharmacy',
    neighbourhood: MOCK_PHARMACIES[0].location.neighborhood,
    image: MOCK_PHARMACIES[0].bannerImage,
    href: `/pharmacy/${MOCK_PHARMACIES[0].id}`,
    rating: MOCK_PHARMACIES[0].rating,
    meta: 'Published prices · Open',
  },
  {
    name: MOCK_LAUNDRY_PROVIDERS[0].name,
    category: 'Laundry & pressing',
    neighbourhood: MOCK_LAUNDRY_PROVIDERS[0].location.neighborhood,
    image: MOCK_LAUNDRY_PROVIDERS[0].bannerImage,
    href: `/laundry/${MOCK_LAUNDRY_PROVIDERS[0].id}`,
    rating: MOCK_LAUNDRY_PROVIDERS[0].rating,
    meta: 'Pickup in 2 hours',
  },
  {
    name: MOCK_RESTAURANTS[3].name,
    category: 'Café & bakery',
    neighbourhood: MOCK_RESTAURANTS[3].location.neighborhood,
    image: MOCK_RESTAURANTS[3].bannerImage,
    href: `/restaurants/${MOCK_RESTAURANTS[3].id}`,
    rating: MOCK_RESTAURANTS[3].rating,
    meta: '15–25 min · Open now',
  },
];

export const PopularNearby: React.FC = () => (
  <section className="border-b border-border bg-ivory py-12 sm:py-16">
    <div className="page-container">
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start lg:gap-12">
        <div className="lg:sticky lg:top-24">
          <SectionHeading
            eyebrow="Popular nearby"
            title="The places your neighbours keep coming back to."
            description="A short, honest list — not a directory. Every partner is verified, priced clearly and rated by real local orders."
            className="mb-5"
          />
          <div className="flex flex-wrap gap-2">
            <Badge tone="success" dot>Open now</Badge>
            <Badge tone="sage">Verified partners</Badge>
            <Badge tone="amber">Fast delivery</Badge>
          </div>
          <div className="mt-6 flex items-center gap-2 rounded-xl border border-border bg-white p-3 text-[11.5px] text-charcoal-secondary">
            <MapPin className="h-4 w-4 shrink-0 text-brand" />
            Showing partners around Ishaka Main Town, Hospital Road & KIU campus.
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {nearby.map((b) => (
            <BusinessCard key={b.name} {...b} />
          ))}
        </div>
      </div>
    </div>
  </section>
);
