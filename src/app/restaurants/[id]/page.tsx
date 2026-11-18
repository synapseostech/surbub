'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { MOCK_RESTAURANTS, MOCK_MENU_ITEMS } from '@/data/mock/restaurants';
import { MOCK_REVIEWS } from '@/data/mock/reviews';
import type { MenuItem } from '@/types/restaurant';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/components/ui/Toast';
import { Currency } from '@/components/common/Currency';
import { SmartImage } from '@/components/ui/SmartImage';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { SectionHeading } from '@/components/ui/SectionHeading';
import {
  ArrowLeft,
  Clock,
  Bike,
  MapPin,
  Phone,
  ShoppingBag,
  Plus,
  Minus,
  Star,
  BadgeCheck,
  UtensilsCrossed,
} from 'lucide-react';

export default function RestaurantDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const restaurant = MOCK_RESTAURANTS.find((item) => item.id === id) || MOCK_RESTAURANTS[0];
  const menuItems = MOCK_MENU_ITEMS[restaurant.id] || [];
  const reviews = MOCK_REVIEWS.filter((review) => review.targetId === restaurant.id);

  const { addItem, itemCount, totalUGX, setIsDrawerOpen } = useCart();
  const { toast } = useToast();

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const categories = ['all', ...Array.from(new Set(menuItems.map((item) => item.category)))];

  const filteredItems = menuItems.filter((item) =>
    selectedCategory === 'all' ? true : item.category === selectedCategory,
  );

  const getQuantity = (itemId: string) => quantities[itemId] || 1;

  const changeQuantity = (itemId: string, delta: number) => {
    setQuantities((previous) => ({
      ...previous,
      [itemId]: Math.max(1, (previous[itemId] || 1) + delta),
    }));
  };

  const addToCart = (item: MenuItem) => {
    const quantity = getQuantity(item.id);
    addItem(item, restaurant.name, quantity);
    toast('Added to your order', `${quantity} × ${item.name} · ${restaurant.name}`);
  };

  return (
    <div className="pb-28">
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-brand-deep">
        <img
          src={restaurant.bannerImage}
          alt={`${restaurant.name} signature dishes`}
          className="h-[360px] w-full object-cover opacity-70 sm:h-[380px] lg:h-[440px]"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-deep via-brand-deep/55 to-brand-deep/10" />

        <div className="absolute inset-x-0 top-0">
          <div className="page-container flex items-center justify-between pt-5">
            <Link
              href="/restaurants"
              className="inline-flex h-9 items-center gap-1.5 rounded-full border border-white/20 bg-brand-deep/50 px-3.5 text-label text-white backdrop-blur transition-colors hover:bg-brand-deep/75"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">All restaurants</span>
              <span className="sm:hidden">Back</span>
            </Link>
            <div className="flex items-center gap-2">
              <Badge tone="dark" dot>
                {restaurant.isOpen ? 'Open now' : 'Closed today'}
              </Badge>
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0">
          <div className="page-container pb-7">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[10.5px] font-bold text-white backdrop-blur">
                <BadgeCheck className="h-3 w-3 text-amber" />
                {restaurant.isVerified ? 'Verified local kitchen' : 'Local kitchen'}
              </span>
              <span className="hidden rounded-full bg-white/15 px-2.5 py-1 text-[10.5px] font-bold text-white backdrop-blur sm:inline-flex">
                {restaurant.priceRange === 'UGX' ? 'Budget friendly' : restaurant.priceRange === 'UGX UGX' ? 'Mid-range' : 'Premium'}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[10.5px] font-bold text-white backdrop-blur">
                <MapPin className="h-3 w-3 text-amber" />
                {restaurant.location.neighborhood}
              </span>
            </div>

            <h1 className="mt-3 text-[30px] font-extrabold leading-[1.05] tracking-[-0.04em] text-white sm:text-[42px] lg:text-[50px]">
              {restaurant.name}
            </h1>
            <p className="mt-2 max-w-2xl text-[13.5px] leading-relaxed text-white/70 sm:text-body">
              {restaurant.tagline}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] font-semibold text-white/80">
              <span className="inline-flex items-center gap-1.5">
                <Star className="h-3.5 w-3.5 fill-amber text-amber" />
                <span className="numeric text-white">{restaurant.rating.toFixed(1)}</span>
                <span className="font-medium text-white/55">({restaurant.reviewCount} reviews)</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-amber" />
                {restaurant.deliveryTimeEstimate}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Bike className="h-3.5 w-3.5 text-amber" />
                <Currency amount={restaurant.averageDeliveryFee} showPrefix={false} className="text-white" /> delivery
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="page-container">
        {/* Info strip */}
        <div className="relative -mt-1 grid gap-px overflow-hidden rounded-card border border-border bg-border shadow-card sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Clock, label: 'Prep & delivery', value: restaurant.deliveryTimeEstimate },
            { icon: Bike, label: 'Delivery fee', value: `UGX ${restaurant.averageDeliveryFee.toLocaleString('en-US')}` },
            { icon: MapPin, label: 'Address', value: restaurant.location.address },
            { icon: Phone, label: 'Direct line', value: restaurant.phone },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-center gap-3 bg-white px-4 py-4 sm:px-5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sage-light text-brand">
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-charcoal-muted">{item.label}</p>
                  <p className="text-[12px] font-bold leading-snug text-charcoal">{item.value}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Menu */}
        <section className="mt-10">
          <div className="flex flex-col gap-4 border-b border-border pb-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="mb-1.5 flex items-center gap-2 text-micro uppercase text-brand-secondary">
                <span className="h-px w-5 bg-brand/40" />
                The menu
              </span>
              <h2 className="text-h2 text-charcoal">Cooked to order, priced plainly</h2>
              <p className="mt-1.5 text-label text-charcoal-secondary">
                Prices in Ugandan shillings · preparation starts when your ticket is confirmed.
              </p>
            </div>

            <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  aria-pressed={selectedCategory === category}
                  className={
                    'h-9 shrink-0 rounded-full border px-3.5 text-label capitalize transition-all duration-200 ' +
                    (selectedCategory === category
                      ? 'border-brand bg-brand text-white'
                      : 'border-border bg-white text-charcoal-secondary hover:border-brand/25 hover:text-brand')
                  }
                >
                  {category.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {filteredItems.map((item) => {
              const quantity = getQuantity(item.id);
              return (
                <article
                  key={item.id}
                  className="flex flex-col rounded-card border border-border bg-white p-4 shadow-card transition-all duration-300 ease-out-premium hover:border-brand/20 hover:shadow-lift"
                >
                  <div className="flex gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-card text-charcoal">{item.name}</h3>
                        {item.isPopular && <Badge tone="amber">Most ordered</Badge>}
                      </div>
                      <p className="mt-1.5 line-clamp-2 text-[12.5px] leading-relaxed text-charcoal-secondary">
                        {item.description}
                      </p>

                      {item.dietaryTags && item.dietaryTags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {item.dietaryTags.map((tag) => (
                            <span key={tag} className="rounded-md bg-ivory px-2 py-0.5 text-[10px] font-semibold text-charcoal-secondary">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="mt-3 flex items-baseline gap-2">
                        <Currency amount={item.price} className="text-[16px] font-extrabold text-brand" />
                        <span className="text-[11px] text-charcoal-muted">~{item.preparationTimeMinutes} min prep</span>
                      </div>
                    </div>

                    <SmartImage
                      src={item.image}
                      alt={item.name}
                      ratio="aspect-square"
                      className="w-[88px] shrink-0 rounded-xl sm:w-[104px]"
                    />
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-3">
                    <div className="inline-flex items-center gap-1 rounded-xl border border-border bg-ivory p-1">
                      <button
                        type="button"
                        onClick={() => changeQuantity(item.id, -1)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-charcoal shadow-sm transition-colors hover:bg-sage-light"
                        aria-label={`Reduce quantity of ${item.name}`}
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="numeric w-6 text-center text-[12px] font-bold text-charcoal">{quantity}</span>
                      <button
                        type="button"
                        onClick={() => changeQuantity(item.id, 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-charcoal shadow-sm transition-colors hover:bg-sage-light"
                        aria-label={`Increase quantity of ${item.name}`}
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    <Button size="sm" onClick={() => addToCart(item)}>
                      <ShoppingBag className="h-3.5 w-3.5 text-amber" />
                      Add to order
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>

          {filteredItems.length === 0 && (
            <div className="mt-5 flex flex-col items-center rounded-card border border-dashed border-border bg-ivory-soft px-6 py-14 text-center">
              <UtensilsCrossed className="h-7 w-7 text-brand/50" />
              <h3 className="mt-3 text-card text-charcoal">Nothing in this section yet</h3>
              <p className="mt-1 text-label text-charcoal-secondary">Choose another menu section to see what is cooking.</p>
            </div>
          )}
        </section>

        {/* Reviews */}
        <section className="mt-12 border-t border-border pt-9">
          <SectionHeading
            eyebrow="Verified diners"
            title={`What Ishaka says (${reviews.length})`}
            description="Reviews come from customers who completed an order with this kitchen."
          />
          <div className="grid gap-4 md:grid-cols-2">
            {reviews.map((review) => (
              <figure key={review.id} className="rounded-card border border-border bg-white p-5 shadow-card">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-label font-bold text-charcoal">{review.authorName}</p>
                    <p className="mt-0.5 text-[11px] text-charcoal-muted">
                      {review.authorLocation} · {review.date}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-sage-light px-2 py-1 text-[11px] font-bold text-brand">
                    <Star className="h-3 w-3 fill-amber text-amber" />
                    {review.rating.toFixed(1)}
                  </span>
                </div>
                <blockquote className="mt-3 text-[13px] leading-relaxed text-charcoal-secondary">
                  &ldquo;{review.comment}&rdquo;
                </blockquote>
              </figure>
            ))}
          </div>
        </section>
      </div>

      {/* Sticky order bar */}
      {itemCount > 0 && (
        <div className="fixed inset-x-0 bottom-[68px] z-40 px-4 md:bottom-6">
          <div className="mx-auto flex max-w-2xl items-center justify-between gap-3 rounded-card-lg border border-brand-secondary bg-brand-deep p-3 text-white shadow-float">
            <div className="flex items-center gap-3">
              <span className="numeric flex h-9 w-9 items-center justify-center rounded-xl bg-amber text-[13px] font-extrabold text-brand-deep">
                {itemCount}
              </span>
              <div>
                <p className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-white/50">Your order</p>
                <Currency amount={totalUGX} className="text-[15px] font-extrabold text-white" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsDrawerOpen(true)}
                className="h-10 rounded-xl border border-white/20 px-3.5 text-label font-semibold transition-colors hover:bg-white/10"
              >
                View cart
              </button>
              <Button href="/checkout" variant="amber" size="sm" className="h-10 px-4">
                Checkout
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
