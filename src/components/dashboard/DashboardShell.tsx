'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight, LayoutDashboard, Store, Bike, ShieldCheck, Home } from 'lucide-react';
import { BrandMark } from '@/components/layout/BrandMark';
import { cn } from '@/lib/cn';

export const DASHBOARD_NAV = [
  { href: '/dashboard/business', label: 'Business', hint: 'Orders & catalogue', icon: Store },
  { href: '/dashboard/rider', label: 'Rider', hint: 'Dispatch & earnings', icon: Bike },
  { href: '/dashboard/admin', label: 'Admin', hint: 'Partners & platform', icon: ShieldCheck },
  { href: '/account', label: 'Customer', hint: 'Orders & addresses', icon: LayoutDashboard },
];

interface DashboardShellProps {
  title: string;
  eyebrow: string;
  subtitle?: string;
  roleLabel: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export const DashboardShell: React.FC<DashboardShellProps> = ({
  title,
  eyebrow,
  subtitle,
  roleLabel,
  actions,
  children,
}) => {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-ivory">
      <div className="mx-auto flex w-full max-w-[1440px]">
        {/* Desktop sidebar */}
        <aside className="sticky top-0 hidden h-screen w-[248px] shrink-0 flex-col border-r border-border bg-white lg:flex">
          <div className="border-b border-border px-6 py-5">
            <BrandMark href="/dashboard/business" />
          </div>

          <nav aria-label="Dashboard" className="flex-1 space-y-1 px-3 py-5">
            <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-charcoal-muted">
              Workspaces
            </p>
            {DASHBOARD_NAV.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'group flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors duration-200',
                    active ? 'bg-brand text-white shadow-card' : 'text-charcoal hover:bg-sage-light',
                  )}
                >
                  <Icon
                    className={cn(
                      'mt-0.5 h-4 w-4 shrink-0',
                      active ? 'text-amber' : 'text-charcoal-muted group-hover:text-brand',
                    )}
                  />
                  <span className="min-w-0">
                    <span className="block text-label font-bold">{item.label}</span>
                    <span className={cn('block truncate text-[10.5px]', active ? 'text-white/60' : 'text-charcoal-muted')}>
                      {item.hint}
                    </span>
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-border p-3">
            <Link
              href="/"
              className="flex items-center justify-between rounded-xl bg-ivory-soft px-3 py-3 text-label font-semibold text-charcoal transition-colors hover:bg-sage-light hover:text-brand"
            >
              <span className="inline-flex items-center gap-2">
                <Home className="h-4 w-4 text-brand" />
                Marketplace
              </span>
              <ArrowUpRight className="h-3.5 w-3.5 text-charcoal-muted" />
            </Link>
            <p className="mt-3 px-3 text-[10.5px] leading-relaxed text-charcoal-muted">
              SUBURB+ operations · Ishaka–Bushenyi
            </p>
          </div>
        </aside>

        {/* Main column */}
        <div className="min-w-0 flex-1">
          {/* Mobile header */}
          <div className="sticky top-0 z-40 border-b border-border bg-white/95 backdrop-blur-xl lg:hidden">
            <div className="flex h-14 items-center justify-between gap-3 px-4">
              <BrandMark />
              <div className="flex items-center gap-2">
                <span className="max-w-[120px] truncate rounded-full bg-sage px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-brand">
                  {roleLabel}
                </span>
                <Link
                  href="/"
                  aria-label="Back to marketplace"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white text-charcoal-secondary transition-colors hover:border-brand/25 hover:text-brand"
                >
                  <Home className="h-4 w-4" />
                </Link>
              </div>
            </div>
            <nav aria-label="Dashboard" className="grid grid-cols-4 gap-2 px-3 pb-3">
              {DASHBOARD_NAV.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'flex min-w-0 flex-col items-center gap-1 rounded-xl border px-1 py-2 text-[11px] font-semibold leading-none transition-colors',
                      active
                        ? 'border-brand bg-brand text-white'
                        : 'border-border bg-white text-charcoal-secondary',
                    )}
                  >
                    <Icon className={cn('h-4 w-4', active ? 'text-amber' : 'text-charcoal-muted')} />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="px-4 pb-14 pt-6 sm:px-6 lg:px-9 lg:pt-9">
            <header className="mb-6 flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
              <div className="min-w-0">
                <p className="text-micro uppercase text-brand-secondary">{eyebrow}</p>
                <h1 className="mt-1.5 text-h1 text-charcoal">{title}</h1>
                {subtitle && <p className="mt-1.5 max-w-2xl text-body text-charcoal-secondary">{subtitle}</p>}
              </div>
              {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
            </header>

            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
