'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLocation } from '@/context/LocationContext';
import { Search, MapPin, ArrowRight, Star, Bike, ShieldCheck, Clock } from 'lucide-react';
import { HOME_STATS } from '@/data/home';

const quickLinks = [
  { label: 'Muchomo', href: '/restaurants?category=grill_bbq' },
  { label: 'Campus rolex', href: '/restaurants?category=snacks_rolex' },
  { label: 'Pharmacy prices', href: '/pharmacy' },
  { label: 'Duvet wash', href: '/laundry' },
  { label: 'Boda ride', href: '/rides' },
];

export const HeroSection: React.FC = () => {
  const router = useRouter();
  const { selectedLocation } = useLocation();
  const [query, setQuery] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/restaurants?search=${encodeURIComponent(query.trim())}`);
  };

  return (
    <section className="relative overflow-hidden border-b border-border bg-ivory">
      <div className="pointer-events-none absolute -right-24 top-0 h-[520px] w-[520px] rounded-full bg-sage/45 blur-3xl" />
      <div className="pointer-events-none absolute -left-32 bottom-0 h-[360px] w-[360px] rounded-full bg-amber-wash/70 blur-3xl" />

      <div className="page-container relative py-8 sm:py-10 lg:py-16">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
          {/* ── Editorial copy ─────────────────────────────────── */}
          <div className="animate-fade-up">
            <button
              onClick={() => {
                const el = document.getElementById('neighbourhood');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-white/80 py-1.5 pl-2 pr-3.5 text-[11.5px] font-semibold text-charcoal-secondary shadow-card backdrop-blur transition-colors hover:border-brand/25 hover:text-charcoal"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sage-light text-brand">
                <MapPin className="h-3.5 w-3.5" />
              </span>
              Serving {selectedLocation.name}, Bushenyi
              <span className="h-1.5 w-1.5 rounded-full bg-status-success" />
            </button>

            <h1 className="text-[30px] leading-[1.06] tracking-[-0.04em] sm:text-display text-charcoal">
              Your neighbourhood.
              <span className="relative mt-1 block text-brand">
                Everything you need.
                <svg
                  className="absolute -bottom-2 left-0 h-3 w-[72%] text-amber"
                  viewBox="0 0 320 14"
                  fill="none"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3 10.5C84 3.5 183 2.5 317 7.5"
                    stroke="currentColor"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-body-lg leading-relaxed text-charcoal-secondary">
              Food from the grill down the road. Pharmacy prices before you leave home. Laundry that
              comes back folded. A boda that arrives when it says it will.
            </p>

            {/* Search */}
            <form onSubmit={submit} className="mt-7 max-w-xl">
              <div className="flex items-center gap-1.5 rounded-2xl border border-border bg-white p-1.5 shadow-lift transition-shadow focus-within:border-brand/25 focus-within:shadow-float">
                <Search className="ml-2.5 h-5 w-5 shrink-0 text-brand" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search food, medicine or rides"
                  aria-label="Search SUBURB+"
                  className="h-11 min-w-0 flex-1 bg-transparent px-1 text-[14px] font-medium text-charcoal outline-none placeholder:text-charcoal-muted sm:text-[15px]"
                />
                <button
                  type="submit"
                  className="flex h-11 shrink-0 items-center gap-1.5 rounded-xl bg-brand px-4 text-[12.5px] font-bold text-white transition-colors hover:bg-brand-secondary sm:px-5"
                >
                  <span className="hidden sm:inline">Search</span>
                  <ArrowRight className="h-4 w-4 text-amber" />
                </button>
              </div>
            </form>

            <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-2">
              <span className="text-[11px] font-semibold text-charcoal-muted">Popular now</span>
              {quickLinks.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  className="rounded-full border border-border/80 bg-white/60 px-2.5 py-1 text-[11px] font-semibold text-charcoal-secondary transition-colors hover:border-brand/25 hover:bg-white hover:text-brand"
                >
                  {l.label}
                </Link>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-border/80 pt-5">
              <div className="flex items-center gap-2.5">
                <div className="flex -space-x-2">
                  <img
                    src="/images/curated/portrait-woman.jpg"
                    alt=""
                    className="h-8 w-8 rounded-full border-2 border-ivory object-cover"
                  />
                  <img
                    src="/images/curated/portrait-woman-2.jpg"
                    alt=""
                    className="h-8 w-8 rounded-full border-2 border-ivory object-cover"
                  />
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-ivory bg-brand text-[9px] font-extrabold text-white">
                    +2k
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="h-3 w-3 fill-amber text-amber" />
                    ))}
                    <span className="ml-1 text-[11px] font-bold text-charcoal">4.8</span>
                  </div>
                  <p className="text-[10.5px] text-charcoal-secondary">from 2,400+ local orders</p>
                </div>
              </div>
              <div className="hidden h-8 w-px bg-border sm:block" />
              <div className="flex items-center gap-2 text-[11px] font-semibold text-charcoal-secondary">
                <ShieldCheck className="h-4 w-4 text-brand" />
                Verified local partners
              </div>
            </div>
          </div>

          {/* ── Editorial image composition ────────────────────── */}
          <div className="relative mx-auto w-full max-w-[560px] lg:mx-0 lg:ml-auto">
            <div className="relative overflow-hidden rounded-[30px] border border-brand/10 bg-sage shadow-float">
              <img
                src="/images/photos/photo-1544025162-d76694265947.jpg"
                alt="Charcoal-grilled muchomo platter with gonja and kachumbari"
                className="h-[360px] w-full object-cover sm:h-[440px] lg:h-[540px]"
                fetchPriority="high"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-deep/85 via-brand-deep/5 to-transparent" />

              <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-[10.5px] font-bold text-brand-deep shadow-sm backdrop-blur">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber" />
                Neighbourhood, elevated
              </div>

              <div className="absolute inset-x-4 bottom-4 sm:inset-x-5 sm:bottom-5">
                <Link
                  href="/restaurants/rest_01"
                  className="group flex items-center justify-between gap-4 rounded-2xl border border-white/20 bg-brand-deep/70 p-3.5 text-white shadow-lg backdrop-blur-md transition-colors hover:bg-brand-deep/85"
                >
                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 text-[9.5px] font-bold uppercase tracking-[0.14em] text-amber">
                      <span className="h-1 w-4 rounded-full bg-amber/70" /> Tonight&apos;s pick
                    </p>
                    <h2 className="mt-1 truncate text-[15px] font-bold">Ankole Spice Kitchen & Grill</h2>
                    <p className="mt-0.5 flex items-center gap-2 text-[11px] text-white/65">
                      <span className="inline-flex items-center gap-1">
                        <Star className="h-3 w-3 fill-amber text-amber" /> 4.8
                      </span>
                      <span>·</span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3 w-3" /> 20–35 min
                      </span>
                      <span>·</span>
                      <span>Muchomo</span>
                    </p>
                  </div>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber text-brand-deep transition-transform group-hover:translate-x-0.5">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              </div>
            </div>

            {/* Overlapping authentic food card */}
            <Link
              href="/restaurants?category=snacks_rolex"
              className="absolute -left-2 bottom-24 hidden w-[132px] overflow-hidden rounded-2xl border-[3px] border-ivory bg-white shadow-lift transition-transform duration-300 hover:-translate-y-1 sm:block lg:-left-8 lg:bottom-28"
            >
              <img
                src="/images/curated/rolex-stall.jpg"
                alt="A rolex stall at the KIU campus gate"
                className="h-[92px] w-full object-cover"
              />
              <div className="p-2.5">
                <p className="text-[9px] font-bold uppercase tracking-[0.08em] text-brand-secondary">Campus favourite</p>
                <p className="mt-0.5 text-[11px] font-bold leading-tight text-charcoal">The 10-minute rolex run</p>
              </div>
            </Link>

            {/* Ride card */}
            <div className="absolute -right-2 top-16 hidden items-center gap-2.5 rounded-xl border border-border bg-white px-3 py-2 shadow-lift sm:flex lg:-right-6 lg:top-24">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-wash text-[#8A5A12]">
                <Bike className="h-4 w-4" />
              </span>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.08em] text-charcoal-muted">Boda nearby</p>
                <p className="text-[11.5px] font-bold tabular-nums text-charcoal">4 min · UGX 1,300</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-4 lg:mt-14">
          {HOME_STATS.map((s) => (
            <div key={s.label} className="bg-white/70 px-4 py-3.5 backdrop-blur sm:px-5">
              <p className="numeric text-[17px] font-extrabold tracking-tight text-brand">{s.value}</p>
              <p className="mt-0.5 text-[10.5px] font-medium uppercase tracking-[0.08em] text-charcoal-muted">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
