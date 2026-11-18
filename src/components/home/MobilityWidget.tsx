'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Bike,
  Package,
  Car,
  Users,
  MapPin,
  ArrowDownUp,
  ShieldCheck,
  Check,
  Gauge,
  CalendarDays,
} from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Currency } from '@/components/common/Currency';
import { MOCK_RIDE_OPTIONS, POPULAR_LOCATIONS } from '@/data/mock/mobility';
import { MOCK_VEHICLE_HIRE_LISTINGS } from '@/data/mock/mobility';
import { rideService } from '@/services/ride-service';
import { RideType } from '@/types/mobility';
import { cn } from '@/lib/cn';

const rideIcons: Record<string, React.ElementType> = {
  boda: Bike,
  delivery_boda: Package,
  matatu_shared: Users,
  special_hire: Car,
};

const vehicles = [MOCK_VEHICLE_HIRE_LISTINGS[1], MOCK_VEHICLE_HIRE_LISTINGS[3], MOCK_VEHICLE_HIRE_LISTINGS[4]];

export const MobilityWidget: React.FC = () => {
  const [type, setType] = useState<RideType>('boda');
  const [pickup, setPickup] = useState(POPULAR_LOCATIONS[1] || POPULAR_LOCATIONS[0]);
  const [destination, setDestination] = useState(POPULAR_LOCATIONS[2] || POPULAR_LOCATIONS[0]);

  const estimate = useMemo(
    () => rideService.calculateEstimate(pickup, destination, type),
    [pickup, destination, type],
  );

  const selected = MOCK_RIDE_OPTIONS.find((o) => o.type === type);

  return (
    <section className="border-b border-border bg-white py-12 sm:py-16">
      <div className="page-container">
        {/* ── Rides estimator ─────────────────────────────────── */}
        <div className="relative overflow-hidden rounded-card-xl bg-brand text-white shadow-float">
          <div className="pointer-events-none absolute inset-0 texture-forest" />
          <div className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -right-6 -top-10 h-48 w-48 rounded-full border border-white/10" />

          <div className="relative grid gap-8 p-5 sm:p-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:gap-12 lg:p-10">
            <div>
              <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[9.5px] font-bold uppercase tracking-[0.12em] text-amber backdrop-blur">
                <Bike className="h-3 w-3" /> Rides & delivery
              </span>
              <h2 className="max-w-md text-display-sm text-white">
                The whole town,
                <br /> a fare away.
              </h2>
              <p className="mt-4 max-w-md text-[13.5px] leading-relaxed text-white/60">
                Vetted boda riders and private drivers across Ishaka, KIU, Hospital Road and Bushenyi.
                See the fare before you get on.
              </p>

              <ul className="mt-5 space-y-2.5">
                {[
                  'Transparent fare estimate before booking',
                  'Vetted riders with helmets and delivery boxes',
                  'Parcel dispatch for food, documents and pharmacy items',
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2.5 text-[12px] text-white/75">
                    <span className="mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-amber/20 text-amber">
                      <Check className="h-3 w-3" />
                    </span>
                    {t}
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-white/10 pt-4 text-[10.5px] text-white/45">
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-amber" /> Verified riders
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-amber" /> 7 neighbourhoods
                </span>
              </div>
            </div>

            {/* Estimator card */}
            <div className="rounded-card-lg border border-white/15 bg-white p-4 text-charcoal shadow-float sm:p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-charcoal-muted">Fare estimator</p>
                  <h3 className="mt-0.5 text-[16px] font-extrabold tracking-tight text-charcoal">Where are you going?</h3>
                </div>
                <span className="rounded-full bg-sage-light px-2 py-1 text-[9.5px] font-bold text-brand">Simulated</span>
              </div>

              {/* Ride types */}
              <div className="mt-4 grid grid-cols-2 gap-1.5 sm:grid-cols-4">
                {MOCK_RIDE_OPTIONS.map((option) => {
                  const Icon = rideIcons[option.type] || Bike;
                  const active = option.type === type;
                  return (
                    <button
                      key={option.type}
                      onClick={() => setType(option.type)}
                      aria-pressed={active}
                      className={cn(
                        'flex flex-col items-start gap-1.5 rounded-xl border p-2.5 text-left transition-all',
                        active
                          ? 'border-brand bg-brand text-white shadow-card'
                          : 'border-border bg-white text-charcoal hover:border-brand/25 hover:bg-ivory-soft',
                      )}
                    >
                      <Icon className={cn('h-4 w-4', active ? 'text-amber' : 'text-brand')} />
                      <span className="text-[10.5px] font-bold leading-tight">{option.title.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>

              {/* Locations */}
              <div className="relative mt-3 grid gap-2">
                <label className="sr-only" htmlFor="ride-pickup">Pickup location</label>
                <div className="flex items-center gap-2 rounded-xl border border-border bg-ivory-soft px-3">
                  <span className="h-2 w-2 shrink-0 rounded-full bg-brand" />
                  <select
                    id="ride-pickup"
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                    className="h-10 w-full appearance-none bg-transparent text-[12px] font-semibold text-charcoal outline-none"
                  >
                    {POPULAR_LOCATIONS.map((l) => (
                      <option key={l}>{l}</option>
                    ))}
                  </select>
                </div>
                <label className="sr-only" htmlFor="ride-destination">Destination</label>
                <div className="flex items-center gap-2 rounded-xl border border-border bg-ivory-soft px-3">
                  <span className="h-2 w-2 shrink-0 rounded-full bg-amber" />
                  <select
                    id="ride-destination"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="h-10 w-full appearance-none bg-transparent text-[12px] font-semibold text-charcoal outline-none"
                  >
                    {POPULAR_LOCATIONS.map((l) => (
                      <option key={l}>{l}</option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={() => {
                    setPickup(destination);
                    setDestination(pickup);
                  }}
                  aria-label="Swap pickup and destination"
                  className="absolute -right-1 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white text-charcoal-secondary shadow-card transition-colors hover:text-brand"
                >
                  <ArrowDownUp className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Result */}
              <div className="mt-3 flex items-end justify-between gap-3 rounded-xl bg-sage-soft p-3.5">
                <div>
                  <p className="text-[9.5px] font-bold uppercase tracking-[0.1em] text-charcoal-muted">
                    {selected?.title} · {estimate.distanceKm} km · {estimate.durationMinutes} min
                  </p>
                  <Currency amount={estimate.totalFareUGX} className="mt-0.5 text-[24px] font-extrabold tracking-tight text-brand" />
                </div>
                <span className="pb-1 text-right text-[9.5px] leading-tight text-charcoal-secondary">
                  Base {estimate.baseFareUGX.toLocaleString()}
                  <br />+ {estimate.distanceFareUGX.toLocaleString()} distance
                </span>
              </div>

              <Link
                href={`/rides?pickup=${encodeURIComponent(pickup)}&destination=${encodeURIComponent(destination)}&type=${type}`}
                className="mt-2.5 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand text-[12px] font-bold text-white transition-colors hover:bg-brand-secondary"
              >
                Continue to booking <ArrowRight className="h-4 w-4 text-amber" />
              </Link>
              <p className="mt-2 text-center text-[9px] text-charcoal-muted">
                Estimate only. Final fare confirmed on the booking screen.
              </p>
            </div>
          </div>
        </div>

        {/* ── Vehicle hire ────────────────────────────────────── */}
        <div className="mt-12 sm:mt-14">
          <SectionHeading
            eyebrow="Vehicle hire"
            title="For the longer road."
            description="Self-drive or chauffeured Toyotas for field work, family trips and Western Uganda journeys."
            action={{ label: 'All vehicles', href: '/vehicles' }}
            className="mb-6"
          />

          <div className="grid gap-4 sm:grid-cols-3">
            {vehicles.map((v) => (
              <Link
                key={v.id}
                href="/vehicles"
                className="group overflow-hidden rounded-card border border-border bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-brand/20 hover:shadow-lift"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-sage-light">
                  <img
                    src={v.images[0]}
                    alt={v.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                  <span className="absolute left-2.5 top-2.5 rounded-full bg-white px-2 py-1 text-[9.5px] font-bold text-brand-deep shadow-sm">
                    {v.availability === 'Available Now' ? 'Available now' : v.availability}
                  </span>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-[13.5px] font-bold leading-snug text-charcoal">{v.title}</h3>
                    <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-charcoal-muted transition-transform group-hover:translate-x-0.5 group-hover:text-brand" />
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10.5px] text-charcoal-secondary">
                    <span className="inline-flex items-center gap-1"><Users className="h-3 w-3 text-brand" /> {v.seats} seats</span>
                    <span className="inline-flex items-center gap-1"><Gauge className="h-3 w-3 text-brand" /> {v.transmission}</span>
                    <span className="inline-flex items-center gap-1"><CalendarDays className="h-3 w-3 text-brand" /> {v.withDriverOnly ? 'With driver' : 'Self-drive'}</span>
                  </div>
                  <div className="mt-3 flex items-baseline justify-between border-t border-border pt-2.5">
                    <Currency amount={v.dailyRateUGX} className="text-[14px] font-extrabold text-brand" />
                    <span className="text-[10px] text-charcoal-muted">per day</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
