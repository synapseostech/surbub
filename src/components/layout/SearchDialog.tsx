'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight, UtensilsCrossed, Pill, Shirt, Bike, Car } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';

const suggestions = [
  { label: 'Ankole muchomo', query: 'muchomo' },
  { label: 'Campus rolex', query: 'rolex' },
  { label: 'Paracetamol', query: 'paracetamol' },
  { label: 'Duvet wash', query: 'duvet' },
];

const categories = [
  { label: 'Restaurants', href: '/restaurants', icon: UtensilsCrossed },
  { label: 'Pharmacy', href: '/pharmacy', icon: Pill },
  { label: 'Laundry', href: '/laundry', icon: Shirt },
  { label: 'Rides', href: '/rides', icon: Bike },
  { label: 'Vehicle hire', href: '/vehicles', icon: Car },
];

export const SearchDialog: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const [query, setQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!open) setQuery('');
  }, [open]);

  const go = (q: string) => {
    if (!q.trim()) return;
    onClose();
    router.push(`/restaurants?search=${encodeURIComponent(q.trim())}`);
  };

  return (
    <Modal open={open} onClose={onClose} size="md" className="overflow-visible">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          go(query);
        }}
      >
        <div className="flex items-center gap-3 rounded-xl border border-border bg-ivory-soft px-4">
          <Search className="h-5 w-5 shrink-0 text-brand" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search food, medicines, laundry or rides…"
            aria-label="Search SUBURB+"
            className="h-14 w-full bg-transparent text-body font-medium text-charcoal outline-none placeholder:text-charcoal-muted"
          />
          <button
            type="submit"
            aria-label="Submit search"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand text-white transition-colors hover:bg-brand-secondary"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </form>

      <div className="mt-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-charcoal-muted">Popular searches</p>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              key={s.label}
              onClick={() => go(s.query)}
              className="rounded-full border border-border bg-white px-3 py-1.5 text-[12px] font-semibold text-charcoal transition-colors hover:border-brand/30 hover:bg-sage-light"
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 border-t border-border pt-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-charcoal-muted">Browse</p>
        <div className="mt-2.5 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {categories.map((c) => (
            <button
              key={c.label}
              onClick={() => {
                onClose();
                router.push(c.href);
              }}
              className="flex items-center gap-2 rounded-xl border border-border bg-white px-3 py-2.5 text-left text-[12px] font-semibold text-charcoal transition-colors hover:border-brand/30 hover:bg-ivory-soft"
            >
              <c.icon className="h-4 w-4 text-brand" />
              {c.label}
            </button>
          ))}
        </div>
      </div>
    </Modal>
  );
};
