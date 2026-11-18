'use client';

import React from 'react';
import { MOCK_LAUNDRY_PROVIDERS } from '@/data/mock/laundry';
import { Currency } from '@/components/common/Currency';
import { PageHeader } from '@/components/ui/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { SmartImage } from '@/components/ui/SmartImage';
import { SectionHeading } from '@/components/ui/SectionHeading';
import {
  Shirt,
  Clock,
  Truck,
  MapPin,
  Sparkles,
  ArrowRight,
  Star,
  BadgeCheck,
  PackageCheck,
  CalendarCheck,
  Waves,
} from 'lucide-react';

const STEPS = [
  { icon: CalendarCheck, title: 'Choose a pickup window', body: 'Pick a day and a two-hour slot that fits around lectures or work.' },
  { icon: Truck, title: 'We collect at your door', body: 'A rider collects your bag, weighs it at intake and shares the ticket.' },
  { icon: PackageCheck, title: 'Returned fresh', body: 'Washed, pressed and bagged — delivered back to the same address.' },
];

export default function LaundryPage() {
  return (
    <div className="page-container">
      <PageHeader
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Laundry' }]}
        eyebrow="Garment care, doorstep"
        title="Laundry & pressing in Ishaka–Bushenyi"
        description="Wash-and-fold by the kilo, crisp steam pressing, duvet deep cleans and medical scrub care — collected from your hostel or home."
        meta={
          <>
            <Badge tone="success" dot>
              2 verified providers
            </Badge>
            <Badge tone="neutral">Free pickup over UGX 35,000</Badge>
            <span className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-charcoal-secondary">
              <Clock className="h-3.5 w-3.5 text-brand" />
              24-hour standard turnaround
            </span>
          </>
        }
        actions={
          <Button href="#providers" size="md">
            <Truck className="h-4 w-4" />
            Book a pickup
          </Button>
        }
      />

      {/* Service promise */}
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { icon: Truck, title: 'Motorised doorstep pickup', body: 'Scheduled at your hostel, flat or office.' },
          { icon: Clock, title: '24-hour turnaround', body: 'Same-day 6-hour express queue available.' },
          { icon: Sparkles, title: 'Gentle fabric care', body: 'Wrinkle guard, protective bagging, no bleach.' },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="flex items-start gap-3 rounded-card border border-border bg-white p-4 shadow-card">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sage-light text-brand">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-label font-bold text-charcoal">{item.title}</p>
                <p className="mt-0.5 text-[11.5px] leading-relaxed text-charcoal-secondary">{item.body}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Providers */}
      <section id="providers" className="mt-11 scroll-mt-24">
        <SectionHeading
          eyebrow="Service providers"
          title="Choose your laundry partner"
          description="Each package lists its price, unit and turnaround so you know the total before anything is collected."
        />

        <div className="grid gap-5 lg:grid-cols-2">
          {MOCK_LAUNDRY_PROVIDERS.map((provider) => (
            <article
              key={provider.id}
              className="flex flex-col overflow-hidden rounded-card border border-border bg-white shadow-card transition-all duration-300 hover:border-brand/20 hover:shadow-lift"
            >
              <div className="relative">
                <SmartImage
                  src={provider.bannerImage}
                  alt={provider.name}
                  ratio="aspect-[16/9]"
                  fallbackLabel={provider.name}
                />
                <div className="absolute left-3 top-3">
                  <Badge tone="dark" dot>
                    Verified provider
                  </Badge>
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-deep/90 via-brand-deep/40 to-transparent p-4">
                  <div className="flex items-end justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="text-card text-white sm:text-[19px]">{provider.name}</h3>
                      <p className="mt-0.5 flex items-center gap-1.5 truncate text-[11px] text-white/70">
                        <MapPin className="h-3 w-3 shrink-0 text-amber" />
                        {provider.location.neighborhood} · {provider.location.address}
                      </p>
                    </div>
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-white px-2 py-1 text-[11px] font-bold text-charcoal">
                      <Star className="h-3 w-3 fill-amber text-amber" />
                      {provider.rating.toFixed(1)}
                      <span className="font-medium text-charcoal-muted">({provider.reviewCount})</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-1 flex-col p-4 sm:p-5">
                <p className="text-[12.5px] leading-relaxed text-charcoal-secondary">{provider.description}</p>

                <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-ivory-soft p-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-charcoal-muted">Turnaround</p>
                    <p className="numeric mt-0.5 text-[13px] font-bold text-charcoal">{provider.turnaroundHoursStandard} hours</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-charcoal-muted">Pickup fee</p>
                    <p className="mt-0.5 text-[13px] font-bold text-charcoal">
                      {provider.pickupFeeUGX === 0 ? 'Free' : <Currency amount={provider.pickupFeeUGX} />}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-charcoal-muted">
                    <Shirt className="h-3 w-3 text-brand" />
                    Packages & pricing
                  </p>
                  <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border">
                    {provider.services.map((service) => (
                      <li key={service.id} className="flex items-center justify-between gap-3 px-3 py-2.5">
                        <div className="min-w-0">
                          <p className="truncate text-[12.5px] font-semibold text-charcoal">{service.name}</p>
                          <p className="mt-0.5 truncate text-[10.5px] text-charcoal-muted">
                            {service.turnaroundTime} · {service.description}
                          </p>
                        </div>
                        <div className="shrink-0 text-right">
                          <Currency amount={service.pricePerUnitUGX} className="text-[12px] font-extrabold text-brand" />
                          <span className="block text-[10px] font-medium text-charcoal-muted">per {service.unit}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
                  <p className="inline-flex items-center gap-1.5 text-[11px] font-medium text-charcoal-secondary">
                    <Waves className="h-3.5 w-3.5 text-brand" />
                    Free pickup above <Currency amount={provider.offersFreePickupAbove || 35000} className="font-bold text-charcoal" />
                  </p>
                  <Button href={`/laundry/${provider.id}`} size="sm">
                    Book pickup
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mt-12 border-t border-border pt-9">
        <SectionHeading
          eyebrow="How pickup works"
          title="Three steps, no queues"
          description="Booked in the browser, confirmed by a real person in Bushenyi."
        />
        <div className="grid gap-3 sm:grid-cols-3">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="relative rounded-card border border-border bg-white p-5">
                <span className="numeric absolute right-4 top-4 text-[11px] font-bold text-charcoal-muted">
                  0{index + 1}
                </span>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-amber">
                  <Icon className="h-5 w-5" />
                </span>
                <p className="mt-3 text-label font-bold text-charcoal">{step.title}</p>
                <p className="mt-1 text-[12px] leading-relaxed text-charcoal-secondary">{step.body}</p>
              </div>
            );
          })}
        </div>
        <p className="mt-4 inline-flex items-center gap-1.5 text-[11.5px] text-charcoal-secondary">
          <BadgeCheck className="h-4 w-4 text-status-success" />
          Weights are verified at intake and shared with you before washing begins.
        </p>
      </section>
    </div>
  );
}
