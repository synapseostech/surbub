import React from 'react';
import Link from 'next/link';
import { ArrowRight, Truck, Clock, Shirt, Sparkles, Check } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Currency } from '@/components/common/Currency';
import { MOCK_LAUNDRY_PROVIDERS, MOCK_LAUNDRY_SERVICES } from '@/data/mock/laundry';

const packages = [
  { service: MOCK_LAUNDRY_SERVICES.laundry_01[0], icon: Shirt, note: 'Everyday clothing, folded and bagged' },
  { service: MOCK_LAUNDRY_SERVICES.laundry_01[3], icon: Sparkles, note: 'Duvets, blankets and heavy bedding' },
  { service: MOCK_LAUNDRY_SERVICES.laundry_01[1], icon: Check, note: 'Shirts, trousers and workwear' },
];

export const LaundrySection: React.FC = () => {
  const provider = MOCK_LAUNDRY_PROVIDERS[0];

  return (
    <section className="border-b border-border bg-ivory py-12 sm:py-16">
      <div className="page-container">
        <SectionHeading
          eyebrow="Laundry & home care"
          title="Laundry that comes back folded."
          description="Book a pickup from home, hostel or office. We collect, clean and return it — usually within a day."
          action={{ label: 'All laundry services', href: '/laundry' }}
        />

        <div className="grid gap-4 lg:grid-cols-[0.88fr_1.12fr]">
          {/* Feature */}
          <div className="relative flex min-h-[420px] flex-col justify-end overflow-hidden rounded-card-xl border border-brand/10 shadow-card">
            <img
              src="/images/photos/photo-1517677208171-0bc6725a3e60.jpg"
              alt="Freshly folded laundry ready for delivery"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-deep via-brand-deep/45 to-brand-deep/5" />
            <div className="relative p-5 sm:p-7">
              <span className="rounded-full bg-amber px-2.5 py-1 text-[9.5px] font-extrabold uppercase tracking-[0.08em] text-brand-deep">
                Doorstep pickup
              </span>
              <h3 className="mt-3 text-[27px] font-extrabold leading-[1.08] tracking-[-0.03em] text-white">
                Collected. Cleaned.
                <br /> Returned fresh.
              </h3>
              <p className="mt-2 max-w-xs text-[12.5px] leading-relaxed text-white/65">
                Motorised pickup across Ishaka and Bushenyi, with clear per-kilo pricing and 24-hour turnaround.
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="rounded-xl border border-white/15 bg-white/10 p-2.5 backdrop-blur">
                  <Truck className="h-4 w-4 text-amber" />
                  <p className="mt-1.5 text-[10px] font-bold text-white">Free pickup</p>
                  <p className="text-[9.5px] text-white/55">Above UGX 35,000</p>
                </div>
                <div className="rounded-xl border border-white/15 bg-white/10 p-2.5 backdrop-blur">
                  <Clock className="h-4 w-4 text-amber" />
                  <p className="mt-1.5 text-[10px] font-bold text-white">24-hour turnaround</p>
                  <p className="text-[9.5px] text-white/55">Express in 6 hours</p>
                </div>
              </div>
              <Link
                href="/laundry"
                className="mt-4 inline-flex h-10 items-center gap-2 rounded-xl bg-white px-4 text-[11.5px] font-bold text-brand transition-colors hover:bg-ivory"
              >
                Book a pickup <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Packages */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between rounded-card border border-border bg-white px-4 py-3 shadow-card">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-sage-light text-brand">
                  <Shirt className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-[12px] font-bold text-charcoal">{provider.name}</p>
                  <p className="text-[10.5px] text-charcoal-secondary">{provider.location.neighborhood} · Verified garment care</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-status-successSoft px-2 py-1 text-[9.5px] font-bold text-status-success">
                <span className="h-1.5 w-1.5 rounded-full bg-status-success" /> Open
              </span>
            </div>

            {packages.map(({ service, icon: Icon, note }) => (
              <Link
                key={service.id}
                href={`/laundry/${provider.id}`}
                className="group flex items-center gap-3.5 rounded-card border border-border bg-white p-3.5 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/20 hover:shadow-lift"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sage-light text-brand transition-colors group-hover:bg-brand group-hover:text-white">
                  <Icon className="h-[19px] w-[19px]" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[13.5px] font-bold text-charcoal">{service.name.split(' (')[0]}</span>
                  <span className="mt-0.5 block truncate text-[10.5px] text-charcoal-secondary">{note}</span>
                  <span className="mt-1 flex items-center gap-2 text-[10px] font-medium text-charcoal-muted">
                    <Clock className="h-3 w-3 text-brand" /> {service.turnaroundTime}
                  </span>
                </span>
                <span className="shrink-0 text-right">
                  <Currency amount={service.pricePerUnitUGX} className="text-[13px] font-extrabold text-brand" />
                  <span className="block text-[9.5px] font-medium text-charcoal-muted">per {service.unit}</span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-charcoal-muted transition-transform group-hover:translate-x-0.5 group-hover:text-brand" />
              </Link>
            ))}

            <div className="flex items-center justify-between gap-3 rounded-card border border-dashed border-sage-dark bg-sage-soft px-4 py-3">
              <p className="text-[11px] leading-snug text-charcoal-secondary">
                <strong className="font-bold text-charcoal">How it works:</strong> book → we collect → returned fresh.
              </p>
              <Link href="/laundry" className="shrink-0 text-[11px] font-bold text-brand hover:text-brand-secondary">
                Start booking
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
