import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { HOME_PROMOTIONS } from '@/data/home';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { cn } from '@/lib/cn';

export const PromotionsSection: React.FC = () => {
  const [lead, ...rest] = HOME_PROMOTIONS;

  return (
    <section className="border-b border-border bg-ivory py-12 sm:py-16">
      <div className="page-container">
        <SectionHeading
          eyebrow="Worth a look"
          title="Small offers. Proper neighbourhood value."
          description="Hand-picked by the SUBURB+ team — no endless carousel, just things worth ordering this week."
          action={{ label: 'Browse all offers', href: '/restaurants' }}
        />

        <div className="grid gap-4 lg:grid-cols-[1.38fr_1fr]">
          {/* Lead promo */}
          <Link
            href={lead.href}
            className="group relative flex min-h-[430px] flex-col justify-end overflow-hidden rounded-card-xl border border-brand/10 shadow-card transition-shadow duration-300 hover:shadow-lift sm:min-h-[500px]"
          >
            <img
              src={lead.image}
              alt={lead.title}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out-premium group-hover:scale-[1.035]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-deep via-brand-deep/55 to-brand-deep/5" />
            <div className="relative p-5 sm:p-7">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.08em] text-brand-deep">
                <Sparkles className="h-3 w-3" /> {lead.kicker}
              </span>
              <h3 className="mt-3 max-w-md text-[27px] font-extrabold leading-[1.08] tracking-[-0.03em] text-white sm:text-[34px]">
                {lead.title}
              </h3>
              <p className="mt-2.5 max-w-sm text-[13px] leading-relaxed text-white/70">{lead.body}</p>
              <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/15 pt-4">
                <span className="numeric text-[14px] font-bold text-amber">{lead.price}</span>
                <span className="inline-flex items-center gap-2 text-[12px] font-bold text-white">
                  {lead.cta}
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 transition-transform group-hover:translate-x-0.5">
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </span>
              </div>
            </div>
          </Link>

          {/* Two supporting promos */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {rest.map((promo) => (
              <Link
                key={promo.id}
                href={promo.href}
                className={cn(
                  'group relative flex min-h-[220px] overflow-hidden rounded-card-lg border shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift',
                  promo.tone === 'sage'
                    ? 'border-sage-dark/40 bg-sage-light'
                    : 'border-border bg-white',
                )}
              >
                <div className="relative z-10 flex flex-1 flex-col justify-between p-4 sm:p-5">
                  <div>
                    <span className="text-[9.5px] font-bold uppercase tracking-[0.12em] text-brand-secondary">
                      {promo.kicker}
                    </span>
                    <h3 className="mt-1.5 max-w-[190px] text-[18px] font-extrabold leading-tight tracking-[-0.025em] text-charcoal">
                      {promo.title}
                    </h3>
                    <p className="mt-1.5 line-clamp-2 max-w-[230px] text-[11.5px] leading-relaxed text-charcoal-secondary">
                      {promo.body}
                    </p>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <span className="numeric text-[12px] font-bold text-brand">{promo.price}</span>
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand text-white transition-transform group-hover:translate-x-1">
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
                <div className="relative w-[38%] shrink-0 overflow-hidden">
                  <img
                    src={promo.image}
                    alt={promo.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out-premium group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
