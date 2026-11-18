'use client';

import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { MOCK_RESTAURANTS } from '@/data/mock/restaurants';
import { RestaurantCard } from '@/components/cards/RestaurantCard';
import { PageHeader } from '@/components/ui/PageHeader';
import { Chip } from '@/components/ui/Chip';
import { EmptyState } from '@/components/ui/EmptyState';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Badge } from '@/components/ui/Badge';
import { useLocation } from '@/context/LocationContext';
import {
  Search,
  UtensilsCrossed,
  Flame,
  Coffee,
  Sandwich,
  Leaf,
  SlidersHorizontal,
  ShieldCheck,
  Bike,
  MapPin,
} from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'All kitchens', icon: UtensilsCrossed },
  { id: 'traditional', label: 'Traditional & kalo', icon: Leaf },
  { id: 'grill_bbq', label: 'Muchomo & grill', icon: Flame },
  { id: 'snacks_rolex', label: 'Rolex & kikomando', icon: Sandwich },
  { id: 'fast_food', label: 'Chips & chicken', icon: Flame },
  { id: 'breakfast', label: 'Katogo & breakfast', icon: Coffee },
];

const NEIGHBOURHOODS = [
  'All neighbourhoods',
  'Ishaka Roundabout',
  'KIU Main Campus',
  'Hospital Road',
  'Ishaka Main',
  'Nyakabirizi',
];

type SortKey = 'rating' | 'delivery' | 'minOrder';

function RestaurantsContent() {
  const searchParams = useSearchParams();
  const { selectedLocation } = useLocation();

  const queryParam = searchParams.get('search') || '';
  const categoryParam = searchParams.get('category') || 'all';

  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [searchQuery, setSearchQuery] = useState(queryParam);

  // Keep the page in sync when the navbar search sends a new query.
  useEffect(() => {
    setSearchQuery(queryParam);
  }, [queryParam]);
  useEffect(() => {
    setSelectedCategory(categoryParam);
  }, [categoryParam]);
  const [neighbourhood, setNeighbourhood] = useState('All neighbourhoods');
  const [sortBy, setSortBy] = useState<SortKey>('rating');

  const filteredRestaurants = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return MOCK_RESTAURANTS.filter((restaurant) => {
      const matchesSearch =
        !query ||
        restaurant.name.toLowerCase().includes(query) ||
        restaurant.tagline.toLowerCase().includes(query) ||
        restaurant.description.toLowerCase().includes(query) ||
        restaurant.cuisine.some((cuisine) => cuisine.toLowerCase().includes(query));

      const matchesCategory =
        selectedCategory === 'all' ||
        restaurant.cuisine.some((cuisine) =>
          cuisine.toLowerCase().includes(selectedCategory.replace('_', ' ')),
        ) ||
        (selectedCategory === 'traditional' && ['rest_01', 'rest_02', 'rest_06'].includes(restaurant.id)) ||
        (selectedCategory === 'grill_bbq' && ['rest_01', 'rest_02', 'rest_05'].includes(restaurant.id)) ||
        (selectedCategory === 'snacks_rolex' && restaurant.id === 'rest_03') ||
        (selectedCategory === 'fast_food' && ['rest_03', 'rest_04'].includes(restaurant.id)) ||
        (selectedCategory === 'breakfast' && ['rest_02', 'rest_04'].includes(restaurant.id));

      const matchesNeighbourhood =
        neighbourhood === 'All neighbourhoods' ||
        restaurant.location.neighborhood.toLowerCase().includes(neighbourhood.toLowerCase());

      return matchesSearch && matchesCategory && matchesNeighbourhood;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'delivery') return a.averageDeliveryFee - b.averageDeliveryFee;
      return (a.minOrder || 0) - (b.minOrder || 0);
    });
  }, [searchQuery, selectedCategory, neighbourhood, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setNeighbourhood('All neighbourhoods');
    setSortBy('rating');
  };

  const isFiltered = Boolean(searchQuery) || selectedCategory !== 'all' || neighbourhood !== 'All neighbourhoods';

  return (
    <div className="page-container">
      <PageHeader
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Restaurants & food' }]}
        eyebrow="Eat well, locally"
        title="Restaurants & food in Ishaka–Bushenyi"
        description="Charcoal-grilled muchomo, campus rolex, katogo breakfasts and garden dining from kitchens we have visited ourselves."
        meta={
          <>
            <Badge tone="success" dot>
              Open now
            </Badge>
            <Badge tone="neutral">6 verified kitchens</Badge>
            <span className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-charcoal-secondary">
              <MapPin className="h-3.5 w-3.5 text-brand" />
              Delivering to {selectedLocation.name}
            </span>
          </>
        }
      />

      {/* Filter panel */}
      <section
        aria-label="Filter restaurants"
        className="rounded-card border border-border bg-white p-4 shadow-card sm:p-5"
      >
        <div className="grid gap-3 md:grid-cols-12">
          <div className="relative md:col-span-6">
            <label htmlFor="restaurant-search" className="sr-only">
              Search restaurants, dishes or cuisine
            </label>
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-muted" />
            <input
              id="restaurant-search"
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search a kitchen, dish or craving — muchomo, rolex, kalo…"
              className="field h-11 pl-10 pr-3"
            />
          </div>

          <div className="md:col-span-3">
            <label htmlFor="restaurant-neighbourhood" className="sr-only">
              Filter by neighbourhood
            </label>
            <select
              id="restaurant-neighbourhood"
              value={neighbourhood}
              onChange={(event) => setNeighbourhood(event.target.value)}
              className="field h-11 font-semibold"
            >
              {NEIGHBOURHOODS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3">
            <label htmlFor="restaurant-sort" className="sr-only">
              Sort restaurants
            </label>
            <div className="relative">
              <SlidersHorizontal className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-muted" />
              <select
                id="restaurant-sort"
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value as SortKey)}
                className="field h-11 pl-10 font-semibold"
              >
                <option value="rating">Top rated first</option>
                <option value="delivery">Lowest delivery fee</option>
                <option value="minOrder">Lowest minimum order</option>
              </select>
            </div>
          </div>
        </div>

        <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-0.5">
          {CATEGORIES.map((category) => {
            const Icon = category.icon;
            return (
              <Chip
                key={category.id}
                active={selectedCategory === category.id}
                onClick={() => setSelectedCategory(category.id)}
                icon={<Icon />}
              >
                {category.label}
              </Chip>
            );
          })}
        </div>
      </section>

      {/* Results */}
      <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
        <p className="text-label text-charcoal-secondary">
          <span className="numeric font-bold text-charcoal">{filteredRestaurants.length}</span>{' '}
          {filteredRestaurants.length === 1 ? 'kitchen' : 'kitchens'}
          {neighbourhood !== 'All neighbourhoods' && <span> in {neighbourhood}</span>}
        </p>
        {isFiltered && (
          <button
            type="button"
            onClick={resetFilters}
            className="text-label font-bold text-brand underline-offset-4 transition-colors hover:text-brand-secondary hover:underline"
          >
            Clear all filters
          </button>
        )}
      </div>

      {filteredRestaurants.length === 0 ? (
        <div className="mt-5">
          <EmptyState
            icon={<UtensilsCrossed className="h-6 w-6" />}
            title="No kitchens match that search"
            description="Try a different dish, clear the neighbourhood filter, or browse every kitchen in Ishaka–Bushenyi."
          >
            <button
              type="button"
              onClick={resetFilters}
              className="mt-5 inline-flex h-9 items-center rounded-[10px] bg-brand px-3.5 text-label font-bold text-white transition-colors hover:bg-brand-hover"
            >
              Reset filters
            </button>
          </EmptyState>
        </div>
      ) : (
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredRestaurants.map((restaurant, index) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} priority={index < 3} />
          ))}
        </div>
      )}

      {/* Trust strip */}
      <section className="mt-12 border-t border-border pt-9">
        <SectionHeading
          eyebrow="Ordering with confidence"
          title="Local kitchens, checked in person"
          description="Every partner is visited before it joins SUBURB+. Prices, delivery fees and prep times are published upfront."
          action={{ label: 'Browse pharmacy', href: '/pharmacy' }}
        />
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { icon: ShieldCheck, title: 'Visited & verified', body: 'Kitchen hygiene, ownership and contact details confirmed.' },
            { icon: Bike, title: 'Rider tracked by stage', body: 'Your order is handed to a known boda stage in your neighbourhood.' },
            { icon: MapPin, title: 'Ishaka–Bushenyi only', body: 'Fees and timings reflect real roads around Greater Bushenyi.' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="flex gap-3 rounded-card border border-border bg-white p-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sage-light text-brand">
                  <Icon className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-label font-bold text-charcoal">{item.title}</p>
                  <p className="mt-1 text-[12px] leading-relaxed text-charcoal-secondary">{item.body}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default function RestaurantsPage() {
  return (
    <Suspense
      fallback={
        <div className="page-container py-10">
          <div className="h-8 w-64 rounded-lg bg-sage-soft skeleton" />
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <div key={index} className="overflow-hidden rounded-card border border-border bg-white">
                <div className="aspect-[4/3] w-full skeleton rounded-none" />
                <div className="space-y-2 p-4">
                  <div className="h-3.5 w-2/3 rounded bg-sage-soft skeleton" />
                  <div className="h-3 w-full rounded bg-sage-soft skeleton" />
                </div>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <RestaurantsContent />
    </Suspense>
  );
}
