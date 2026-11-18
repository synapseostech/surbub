'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, ShoppingBag, Bike, User } from 'lucide-react';
import { useCart } from '@/context/CartContext';

const navItems = [
  { label: 'Home', href: '/', icon: Home, exact: true },
  { label: 'Explore', href: '/restaurants', icon: Compass, match: ['/restaurants', '/pharmacy', '/laundry', '/vehicles'] },
  { label: 'Orders', href: '/account?tab=orders', icon: ShoppingBag, match: ['/account'], badge: true },
  { label: 'Rides', href: '/rides', icon: Bike, match: ['/rides'] },
  { label: 'Account', href: '/account', icon: User, match: ['/account'] },
];

export const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();
  const { itemCount } = useCart();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-white/95 backdrop-blur-xl md:hidden"
      aria-label="Mobile navigation"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="mx-auto grid h-[64px] max-w-lg grid-cols-5 px-1">
        {navItems.map((item) => {
          const isActive =
            pathname === '/account'
              ? item.href === '/account'
              : item.exact
                ? pathname === item.href
                : item.match?.some((p) => pathname.startsWith(p));
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`relative flex min-h-[48px] flex-col items-center justify-center gap-1 transition-colors ${
                isActive ? 'text-brand' : 'text-charcoal-muted hover:text-charcoal'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className="relative">
                <item.icon className={`h-[21px] w-[21px] ${isActive ? 'stroke-[2.2]' : 'stroke-[1.7]'}`} />
                {item.badge && itemCount > 0 && (
                  <span className="absolute -right-2.5 -top-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-amber px-0.5 text-[9px] font-extrabold text-brand-deep">
                    {itemCount}
                  </span>
                )}
              </span>
              <span className={`text-[10px] tracking-tight ${isActive ? 'font-bold' : 'font-semibold'}`}>
                {item.label}
              </span>
              {isActive && <span className="absolute bottom-1 h-1 w-1 rounded-full bg-amber" />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
