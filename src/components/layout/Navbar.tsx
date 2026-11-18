'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocation } from '@/context/LocationContext';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { LocationModal } from './LocationModal';
import { SearchDialog } from './SearchDialog';
import { AccountMenu } from './AccountMenu';
import { BrandMark } from './BrandMark';
import {
  ShoppingBag,
  MapPin,
  Menu,
  X,
  UtensilsCrossed,
  Pill,
  Shirt,
  Bike,
  Car,
  Search,
  ChevronDown,
  LayoutDashboard,
  User,
  ArrowUpRight,
} from 'lucide-react';

const navLinks = [
  { href: '/restaurants', label: 'Restaurants' },
  { href: '/pharmacy', label: 'Pharmacy' },
  { href: '/laundry', label: 'Laundry' },
  { href: '/rides', label: 'Rides' },
  { href: '/vehicles', label: 'Vehicles' },
];

const exploreLinks = [
  { href: '/restaurants', label: 'Restaurants & grills', icon: UtensilsCrossed, hint: 'Muchomo, rolex, local plates' },
  { href: '/pharmacy', label: 'Pharmacy', icon: Pill, hint: 'Compare published prices' },
  { href: '/laundry', label: 'Laundry & pressing', icon: Shirt, hint: 'Doorstep pickup and delivery' },
  { href: '/rides', label: 'Rides & courier', icon: Bike, hint: 'Boda and parcel dispatch' },
  { href: '/vehicles', label: 'Vehicle hire', icon: Car, hint: 'Self-drive or chauffeured' },
];

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { selectedLocation } = useLocation();
  const { itemCount, setIsDrawerOpen } = useCart();
  const { role } = useAuth();

  const [locationOpen, setLocationOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const dashboardHref =
    role === 'customer'
      ? '/account'
      : role === 'rider'
        ? '/dashboard/rider'
        : role === 'admin'
          ? '/dashboard/admin'
          : '/dashboard/business';

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-ivory/95 backdrop-blur-xl">
        <div className="page-container">
          <div className="flex h-[72px] items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3 lg:gap-6">
              <BrandMark />

              <button
                onClick={() => setLocationOpen(true)}
                className="group hidden items-center gap-2 rounded-xl border border-transparent px-2.5 py-1.5 text-left transition-colors hover:border-border hover:bg-white md:flex"
                aria-label={`Change location. Current location: ${selectedLocation.name}`}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sage-light text-brand transition-colors group-hover:bg-sage">
                  <MapPin className="h-4 w-4" />
                </span>
                <span className="hidden xl:block">
                  <span className="block text-[9.5px] font-bold uppercase tracking-[0.14em] text-charcoal-muted">
                    Delivering to
                  </span>
                  <span className="block max-w-[150px] truncate text-[12.5px] font-bold text-charcoal">
                    {selectedLocation.name}
                  </span>
                </span>
                <ChevronDown className="hidden h-3 w-3 text-charcoal-muted xl:block" />
              </button>
            </div>

            <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Main navigation">
              {navLinks.map((link) => {
                const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative whitespace-nowrap rounded-lg px-3 py-2 text-[12.5px] font-semibold transition-colors ${
                      active ? 'text-brand' : 'text-charcoal-secondary hover:text-charcoal'
                    }`}
                  >
                    {link.label}
                    <span
                      className={`absolute inset-x-3 -bottom-[21px] h-[2px] rounded-full bg-amber transition-opacity ${
                        active ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                  </Link>
                );
              })}
            </nav>

            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => setSearchOpen(true)}
                className="hidden h-10 items-center gap-2 rounded-xl border border-border bg-white px-3 text-[12px] font-medium text-charcoal-muted transition-colors hover:border-brand/30 hover:text-charcoal xl:flex xl:w-[168px]"
                aria-label="Search SUBURB+"
              >
                <Search className="h-4 w-4 text-brand" />
                <span className="flex-1 text-left">Search…</span>
                <span className="rounded border border-border px-1 py-0.5 text-[9px] font-bold text-charcoal-muted">⌘K</span>
              </button>

              <button
                onClick={() => setSearchOpen(true)}
                className="hidden h-10 w-10 items-center justify-center rounded-xl text-charcoal transition-colors hover:bg-white sm:flex xl:hidden"
                aria-label="Search SUBURB+"
              >
                <Search className="h-[19px] w-[19px]" />
              </button>

              <button
                onClick={() => setLocationOpen(true)}
                className="flex h-10 w-10 items-center justify-center rounded-xl text-charcoal transition-colors hover:bg-white md:hidden"
                aria-label="Change location"
              >
                <MapPin className="h-[19px] w-[19px] text-brand" />
              </button>

              <button
                onClick={() => setIsDrawerOpen(true)}
                className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-white text-brand transition-colors hover:border-brand/30"
                aria-label={`Cart, ${itemCount} items`}
              >
                <ShoppingBag className="h-[18px] w-[18px]" />
                {itemCount > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-full border-2 border-ivory bg-amber px-1 text-[10px] font-extrabold text-brand-deep">
                    {itemCount}
                  </span>
                )}
              </button>

              <div className="hidden sm:block">
                <AccountMenu />
              </div>

              <button
                onClick={() => setMenuOpen(true)}
                className="flex h-10 w-10 items-center justify-center rounded-xl text-charcoal transition-colors hover:bg-white lg:hidden"
                aria-label="Open menu"
                aria-expanded={menuOpen}
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 h-full w-full bg-brand-deep/45 backdrop-blur-sm animate-fade-in"
          />
          <div className="absolute inset-y-0 right-0 flex w-[92%] max-w-sm flex-col bg-ivory shadow-float animate-slide-up">
            <div className="flex h-[72px] items-center justify-between border-b border-border px-5">
              <BrandMark />
              <button
                onClick={() => setMenuOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-charcoal shadow-card"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  setSearchOpen(true);
                }}
                className="mb-2 flex w-full items-center gap-2.5 rounded-xl border border-border bg-white px-3.5 py-3 text-left text-[12.5px] font-medium text-charcoal-muted"
              >
                <Search className="h-4 w-4 text-brand" />
                Search food, medicine, laundry or rides
              </button>

              <button
                onClick={() => {
                  setMenuOpen(false);
                  setLocationOpen(true);
                }}
                className="mb-4 flex w-full items-center justify-between rounded-xl border border-border bg-white p-3.5 text-left"
              >
                <span className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-sage-light text-brand">
                    <MapPin className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block text-[9.5px] font-bold uppercase tracking-[0.12em] text-charcoal-muted">
                      Delivering to
                    </span>
                    <span className="block text-[13px] font-bold text-charcoal">{selectedLocation.name}</span>
                  </span>
                </span>
                <ChevronDown className="h-4 w-4 text-charcoal-muted" />
              </button>

              <p className="px-1 pb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-charcoal-muted">
                Explore
              </p>
              <div className="space-y-1.5">
                {exploreLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-white"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-white text-brand">
                      <link.icon className="h-[18px] w-[18px]" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[13px] font-bold text-charcoal">{link.label}</span>
                      <span className="block truncate text-[11.5px] text-charcoal-secondary">{link.hint}</span>
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-charcoal-muted" />
                  </Link>
                ))}
              </div>

              <p className="mt-5 px-1 pb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-charcoal-muted">
                You
              </p>
              <div className="space-y-1.5">
                <Link href="/account" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 rounded-xl p-3 text-[13px] font-semibold text-charcoal hover:bg-white">
                  <User className="h-[18px] w-[18px] text-brand" /> My account
                </Link>
                <Link href={dashboardHref} onClick={() => setMenuOpen(false)} className="flex items-center gap-3 rounded-xl p-3 text-[13px] font-semibold text-charcoal hover:bg-white">
                  <LayoutDashboard className="h-[18px] w-[18px] text-brand" />
                  {role === 'customer' ? 'My orders & rides' : 'My dashboard'}
                </Link>
              </div>
            </div>

            <div className="border-t border-border p-4">
              <Link
                href="/account"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between rounded-xl bg-brand p-3.5 text-white"
              >
                <span>
                  <span className="block text-[12px] font-bold">Signed in as</span>
                  <span className="block text-[11px] text-white/60">Manage your SUBURB+ profile</span>
                </span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

      <LocationModal open={locationOpen} onClose={() => setLocationOpen(false)} />
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};
