import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, BadgeCheck, PhoneCall, Clock3 } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Badge } from '@/components/ui/Badge';
import { Currency } from '@/components/common/Currency';
import { MOCK_PHARMACY_PRODUCTS, MOCK_PRICE_COMPARISONS } from '@/data/mock/pharmacies';

const featuredProducts = [MOCK_PHARMACY_PRODUCTS[0], MOCK_PHARMACY_PRODUCTS[1]];

export const PharmacyShowcase: React.FC = () => (
  <section className="border-b border-border bg-white py-12 sm:py-16">
    <div className="page-container">
      <SectionHeading
        eyebrow="Healthcare, close to home"
        title="Know the price before you leave home."
        description="Compare published prices across licensed Ishaka chemists. No account required, no surprise at the counter."
        action={{ label: 'Open pharmacy', href: '/pharmacy' }}
      />

      <div className="grid gap-4 lg:grid-cols-[1.28fr_0.72fr] lg:items-start">
        {/* Comparison cards */}
        <div className="grid gap-4 sm:grid-cols-2">
          {featuredProducts.map((product) => {
            const listings = (MOCK_PRICE_COMPARISONS[product.id] || []).slice(0, 3);
            const lowest = listings.reduce((min, l) => (l.priceUGX < min.priceUGX ? l : min), listings[0]);
            return (
              <article key={product.id} className="flex flex-col rounded-card border border-border bg-white p-4 shadow-card">
                <div className="flex items-start gap-3">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-ivory">
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      className="h-full w-full object-contain p-1.5 mix-blend-multiply"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Badge tone="success">OTC</Badge>
                      {product.requiresPrescription && <Badge tone="warning">Prescription</Badge>}
                    </div>
                    <h3 className="mt-1.5 line-clamp-2 text-[13.5px] font-bold leading-snug text-charcoal">
                      {product.name}
                    </h3>
                    <p className="mt-0.5 text-[10.5px] text-charcoal-secondary">{product.dosageForm}</p>
                  </div>
                </div>

                <p className="mt-3 border-y border-border py-1.5 text-[9.5px] font-bold uppercase tracking-[0.1em] text-charcoal-muted">
                  Published chemist prices
                </p>
                <ul className="divide-y divide-border">
                  {listings.map((l) => (
                    <li key={l.pharmacyId} className="flex items-center justify-between gap-2 py-2">
                      <span className="min-w-0">
                        <span className="block truncate text-[11.5px] font-semibold text-charcoal">{l.pharmacyName}</span>
                        <span className="block truncate text-[10px] text-charcoal-muted">{l.pharmacyLocation}</span>
                      </span>
                      <span className="shrink-0 text-right">
                        <Currency amount={l.priceUGX} showPrefix={false} className="text-[12px] font-bold text-brand" />
                        <span className="mt-0.5 block text-[9px] font-semibold text-status-success">{l.availabilityLabel}</span>
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto flex items-center justify-between gap-2 pt-3">
                  <span className="text-[10.5px] text-charcoal-secondary">
                    Lowest at <strong className="font-bold text-brand">{lowest?.pharmacyName.split(' ').slice(0, 2).join(' ')}</strong>
                  </span>
                  <Link
                    href={`/pharmacy?product=${product.id}`}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-brand hover:text-brand-secondary"
                  >
                    Compare <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        {/* Partner panel */}
        <aside className="relative flex flex-col overflow-hidden rounded-card-lg bg-brand text-white">
          <div className="relative h-[150px] overflow-hidden">
            <img
              src="/images/photos/photo-1576602976047-174e57a47881.jpg"
              alt="A licensed neighbourhood pharmacy display in Uganda"
              loading="lazy"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand via-brand/25 to-transparent" />
            <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[10px] font-bold text-brand-deep backdrop-blur">
              <BadgeCheck className="h-3 w-3 text-brand" /> Licensed partners
            </span>
          </div>

          <div className="flex flex-1 flex-col p-5">
            <h3 className="text-[19px] font-extrabold leading-tight tracking-[-0.02em]">
              Care, with a pharmacist at the end of the line.
            </h3>
            <p className="mt-2 text-[12px] leading-relaxed text-white/60">
              Every partner is NDA-licensed. Prices are published before you travel, and a pharmacist can
              call you back on anything you are unsure about.
            </p>

            <ul className="mt-4 space-y-2.5">
              {[
                { icon: ShieldCheck, text: 'Licensed & regularly verified' },
                { icon: PhoneCall, text: 'Direct pharmacist callback' },
                { icon: Clock3, text: 'Open late around campus & hospital' },
              ].map((item) => (
                <li key={item.text} className="flex items-center gap-2.5 text-[11.5px] text-white/80">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white/10 text-amber">
                    <item.icon className="h-3.5 w-3.5" />
                  </span>
                  {item.text}
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-5">
              <Link
                href="/pharmacy"
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-amber text-[12px] font-bold text-brand-deep transition-colors hover:bg-amber-soft"
              >
                Browse verified chemists <ArrowRight className="h-4 w-4" />
              </Link>
              <p className="mt-2.5 text-[9.5px] leading-relaxed text-white/35">
                Discovery and price comparison only. Prescription medicines require in-person dispensing
                under NDA Uganda guidelines.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </section>
);
