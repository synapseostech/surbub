'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  MapPin,
  ShieldCheck,
  ArrowRight,
  Smartphone,
  Instagram,
  Facebook,
  Twitter,
  Check,
} from 'lucide-react';
import { BrandMark } from './BrandMark';
import { useToast } from '@/components/ui/Toast';

const columns = [
  {
    title: 'Marketplace',
    links: [
      { label: 'Restaurants', href: '/restaurants' },
      { label: 'Pharmacy', href: '/pharmacy' },
      { label: 'Laundry & pressing', href: '/laundry' },
      { label: 'Rides & delivery', href: '/rides' },
      { label: 'Vehicle hire', href: '/vehicles' },
    ],
  },
  {
    title: 'Your account',
    links: [
      { label: 'My profile', href: '/account' },
      { label: 'Orders & tracking', href: '/account?tab=orders' },
      { label: 'Rides & trips', href: '/account?tab=rides' },
      { label: 'Saved places', href: '/account?tab=saved' },
      { label: 'Notifications', href: '/account?tab=alerts' },
    ],
  },
  {
    title: 'For partners',
    links: [
      { label: 'Business dashboard', href: '/dashboard/business' },
      { label: 'Rider console', href: '/dashboard/rider' },
      { label: 'Platform admin', href: '/dashboard/admin' },
      { label: 'List your business', href: '/dashboard/business' },
    ],
  },
];

export const Footer: React.FC = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  const subscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) {
      toast('Enter a valid email', 'We need an email address to send neighbourhood updates.', 'error');
      return;
    }
    setDone(true);
    setEmail('');
    toast('You are on the list', 'Neighbourhood offers will arrive in your inbox.');
  };

  return (
    <footer className="relative overflow-hidden bg-brand text-white">
      <div className="pointer-events-none absolute inset-0 texture-forest opacity-90" />

      <div className="page-container relative">
        {/* Newsletter band */}
        <div className="grid gap-6 border-b border-white/12 py-10 sm:py-12 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div>
            <p className="mb-2 flex items-center gap-2 text-micro uppercase text-amber">
              <span className="h-px w-5 bg-amber/70" /> Neighbourhood notes
            </p>
            <h2 className="max-w-md text-h1 text-white">
              The best of your neighbourhood, once a week.
            </h2>
            <p className="mt-2 max-w-md text-body text-white/60">
              New openings, honest food picks and practical local offers. No noise.
            </p>
          </div>
          <form onSubmit={subscribe} className="w-full max-w-md lg:ml-auto">
            <label htmlFor="footer-email" className="mb-2 block text-[11px] font-bold uppercase tracking-[0.12em] text-white/50">
              Email address
            </label>
            <div className="flex gap-2">
              <input
                id="footer-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="h-12 min-w-0 flex-1 rounded-xl border border-white/15 bg-white/10 px-3.5 text-[13px] text-white placeholder:text-white/35 focus:border-amber/60 focus:bg-white/15 focus:outline-none"
              />
              <button
                type="submit"
                className="flex h-12 shrink-0 items-center gap-2 rounded-xl bg-amber px-4 text-[12px] font-bold text-brand-deep transition-colors hover:bg-amber-soft"
              >
                {done ? <Check className="h-4 w-4" /> : <>Subscribe <ArrowRight className="h-3.5 w-3.5" /></>}
              </button>
            </div>
            <p className="mt-2 text-[10.5px] text-white/40">One email a week. Unsubscribe any time.</p>
          </form>
        </div>

        {/* Main footer */}
        <div className="grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div className="max-w-xs">
            <BrandMark tone="dark" />
            <p className="mt-4 text-body text-white/60">
              Your neighbourhood. Everything you need. Local food, healthcare, laundry and mobility —
              beautifully connected across Ishaka–Bushenyi.
            </p>
            <div className="mt-4 flex items-start gap-2 text-[12px] text-white/55">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-amber" />
              <span>Ishaka Roundabout & KIU commercial hub, Bushenyi District, Uganda</span>
            </div>
            <div className="mt-5 flex items-center gap-2">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social profile"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/12 bg-white/5 text-white/70 transition-colors hover:border-amber/40 hover:text-amber"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-amber">{col.title}</h3>
              <ul className="mt-3.5 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-[12.5px] text-white/65 transition-colors hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Trust row */}
        <div className="grid gap-3 border-t border-white/10 py-6 sm:grid-cols-2">
          <div className="flex items-start gap-2.5 rounded-xl border border-white/10 bg-white/[0.04] p-3.5">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-amber" />
            <p className="text-[11px] leading-relaxed text-white/50">
              <strong className="font-bold text-white/75">Health partnerships.</strong> Pharmacy listings are
              discovery and price comparison only. Prescription medicines are dispensed by licensed pharmacists
              under NDA Uganda guidelines.
            </p>
          </div>
          <div className="flex items-start gap-2.5 rounded-xl border border-white/10 bg-white/[0.04] p-3.5">
            <Smartphone className="mt-0.5 h-4 w-4 shrink-0 text-amber" />
            <p className="text-[11px] leading-relaxed text-white/50">
              <strong className="font-bold text-white/75">Local payments.</strong> MTN MoMo, Airtel Money and
              cash on delivery. Fares shown are transparent simulated estimates in Ugandan Shillings (UGX).
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-white/10 py-6 text-[11px] text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} SUBURB+ Uganda. Built for Ishaka–Bushenyi.</p>
          <div className="flex flex-wrap items-center gap-4">
            <span>Neighbourhood, elevated.</span>
            <Link href="#" className="hover:text-white/70">Privacy</Link>
            <Link href="#" className="hover:text-white/70">Terms</Link>
            <span className="rounded-full border border-white/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white/50">
              Demo environment
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
