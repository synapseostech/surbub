import React from 'react';
import Link from 'next/link';
import { Star, ShieldCheck, BadgeCheck, Wallet, Headphones, ArrowRight, Quote } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { TESTIMONIALS } from '@/data/home';

const pillars = [
  {
    icon: BadgeCheck,
    title: 'Verified partners',
    body: 'Every kitchen, chemist and laundry is visited and checked before it appears on SUBURB+.',
  },
  {
    icon: Wallet,
    title: 'Clear, local pricing',
    body: 'UGX prices, delivery fees and fare estimates are shown upfront. No invented stock claims.',
  },
  {
    icon: Headphones,
    title: 'Real local support',
    body: 'A team in Bushenyi answers the phone. Order issues are resolved by people who know the town.',
  },
];

export const TrustSection: React.FC = () => {
  const t = TESTIMONIALS[0];

  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="page-container">
        <SectionHeading
          eyebrow="Why neighbours trust us"
          title="Built on neighbourhood trust."
          description="A marketplace is only as good as the people in it. We keep the bar high."
          action={{ label: 'How SUBURB+ works', href: '/account' }}
        />

        <div className="grid items-stretch gap-4 lg:grid-cols-[0.82fr_1.18fr]">
          {/* Testimonial with authentic portrait */}
          <div className="relative min-h-[380px] overflow-hidden rounded-card-xl border border-border bg-sage-light shadow-card">
            <img
              src={t.image}
              alt={`${t.name}, a SUBURB+ customer in Ishaka`}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-deep via-brand-deep/25 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5">
              <div className="mb-2 flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-amber text-amber" />
                ))}
              </div>
              <p className="text-[12.5px] font-bold text-white">{t.name}</p>
              <p className="text-[10.5px] text-white/60">{t.role}</p>
            </div>
            <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[9.5px] font-bold text-brand-deep backdrop-blur">
              <BadgeCheck className="h-3 w-3 text-brand" /> Verified customer
            </span>
          </div>

          <div className="flex flex-col rounded-card-xl border border-border bg-sage-soft p-5 sm:p-7">
            <Quote className="h-7 w-7 text-brand/25" />
            <blockquote className="mt-2 text-[17px] font-semibold leading-[1.45] tracking-[-0.02em] text-charcoal sm:text-[20px]">
              “{t.quote}”
            </blockquote>
            <p className="mt-3 text-[11px] font-bold text-brand-secondary">
              {t.name} · <span className="font-medium text-charcoal-secondary">{t.role}</span>
            </p>

            <div className="mt-5 grid gap-2.5 border-t border-sage-dark/50 pt-5 sm:grid-cols-3">
              {pillars.map((p) => (
                <div key={p.title}>
                  <span className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white text-brand shadow-card">
                    <p.icon className="h-4 w-4" />
                  </span>
                  <h3 className="text-[11.5px] font-bold text-charcoal">{p.title}</h3>
                  <p className="mt-1 text-[10.5px] leading-relaxed text-charcoal-secondary">{p.body}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3 rounded-xl border border-sage-dark/50 bg-white/60 px-3.5 py-2.5">
              <ShieldCheck className="h-4 w-4 shrink-0 text-brand" />
              <p className="flex-1 text-[10.5px] leading-snug text-charcoal-secondary">
                Licensed pharmacy partners. Secure mobile money. Local support, seven days a week.
              </p>
              <Link
                href="/account"
                className="inline-flex shrink-0 items-center gap-1 text-[10.5px] font-bold text-brand hover:text-brand-secondary"
              >
                Learn more <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
