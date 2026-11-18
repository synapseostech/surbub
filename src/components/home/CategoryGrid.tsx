import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { HOME_CATEGORIES } from '@/data/home';
import { SectionHeading } from '@/components/ui/SectionHeading';

export const CategoryGrid: React.FC = () => (
  <section id="neighbourhood" className="border-b border-border bg-white py-12 sm:py-16">
    <div className="page-container">
      <SectionHeading
        eyebrow="Explore the neighbourhood"
        title="Five ways to get what you need."
        description="Local partners, published prices and a delivery network that actually knows Ishaka."
        action={{ label: 'See everything', href: '/restaurants' }}
      />

      <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory items-start gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-5">
        {HOME_CATEGORIES.map((cat, i) => (
          <Link
            key={cat.key}
            href={cat.href}
            className={`group relative w-[72%] shrink-0 snap-start overflow-hidden rounded-card border border-border bg-sage-light shadow-card transition-all duration-300 ease-out-premium hover:-translate-y-1 hover:border-brand/20 hover:shadow-lift sm:w-auto self-start ${
              i === 0 ? 'sm:col-span-2 lg:col-span-1' : ''
            }`}
          >
            <div className={`relative overflow-hidden ${i === 0 ? 'aspect-[4/5] sm:aspect-[16/9] lg:aspect-[4/5]' : 'aspect-[4/5]'}`}>
              <img
                src={cat.image}
                alt={`${cat.title} in Ishaka–Bushenyi`}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 ease-out-premium group-hover:scale-[1.06]"
              />
              <div className="absolute inset-0 bg-brand/15 mix-blend-multiply" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-deep via-brand-deep/35 to-brand-deep/5" />
              <span className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full border border-white/25 bg-white/15 text-white backdrop-blur transition-colors group-hover:bg-amber group-hover:text-brand-deep">
                <ArrowUpRight className="h-3.5 w-3.5" />
              </span>
              <div className="absolute inset-x-0 bottom-0 p-3.5">
                <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-amber/90">{cat.accent}</p>
                <h3 className="mt-1 text-[16px] font-extrabold leading-tight text-white">{cat.title}</h3>
                <p className="mt-1 text-[11px] leading-snug text-white/65">{cat.subtitle}</p>
                <p className="mt-2 border-t border-white/15 pt-2 text-[10px] font-semibold text-white/50">{cat.meta}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  </section>
);
