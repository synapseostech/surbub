import React from 'react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { BusinessCard } from '@/components/cards/BusinessCard';
import { RECENTLY_ADDED } from '@/data/home';
import { Sparkles } from 'lucide-react';

export const RecentlyAdded: React.FC = () => (
  <section className="border-b border-border bg-ivory py-12 sm:py-16">
    <div className="page-container">
      <SectionHeading
        eyebrow="Recently added"
        title="New on your street."
        description="Fresh partners, verified and ready for their first neighbours."
        action={{ label: 'Explore all partners', href: '/restaurants' }}
      />

      <div className="grid gap-3 sm:grid-cols-2">
        {RECENTLY_ADDED.map((biz) => (
          <BusinessCard
            key={biz.name}
            name={biz.name}
            category={biz.category}
            neighbourhood={biz.neighbourhood}
            image={biz.image}
            href="/restaurants"
            meta={biz.note}
            tag={biz.tag}
          />
        ))}
      </div>

      <div className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-dashed border-sage-dark bg-sage-soft px-4 py-3 text-[11px] text-charcoal-secondary">
        <Sparkles className="h-3.5 w-3.5 text-amber" />
        Know a great local business that should be here? Tell us at{' '}
        <a href="mailto:hello@suburbplus.ug" className="font-bold text-brand hover:underline">
          hello@suburbplus.ug
        </a>
      </div>
    </div>
  </section>
);
