'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { DemoRole } from '@/types/auth';
import {
  ChevronDown,
  User,
  ShoppingBag,
  Bike,
  Heart,
  LayoutDashboard,
  Check,
  Sparkles,
  ShieldCheck,
  Store,
  Shirt,
  Pill,
} from 'lucide-react';
import { cn } from '@/lib/cn';

const roleIcon: Record<DemoRole, React.ElementType> = {
  customer: User,
  restaurant_owner: Store,
  pharmacy_owner: Pill,
  laundry_owner: Shirt,
  rider: Bike,
  admin: ShieldCheck,
};

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

export const AccountMenu: React.FC = () => {
  const { user, role, switchRole, availableRoles } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const dashboardHref =
    role === 'customer'
      ? '/account'
      : role === 'rider'
        ? '/dashboard/rider'
        : role === 'admin'
          ? '/dashboard/admin'
          : '/dashboard/business';

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center gap-2 rounded-xl border border-border bg-white py-1.5 pl-1.5 pr-2.5 text-left transition-colors hover:border-brand/30 hover:bg-ivory-soft"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-sage text-[12px] font-extrabold text-brand">
          {initials(user.name)}
        </span>
        <span className="hidden sm:block">
          <span className="block max-w-[92px] truncate text-[12px] font-bold leading-tight text-charcoal">
            {user.name.split(' ')[0]}
          </span>
          <span className="block text-[10px] capitalize leading-tight text-charcoal-secondary">
            {role === 'customer' ? 'Account' : role.replace(/_/g, ' ')}
          </span>
        </span>
        <ChevronDown className={cn('h-3.5 w-3.5 text-charcoal-muted transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+10px)] z-50 w-[320px] overflow-hidden rounded-card-lg border border-border bg-white shadow-float animate-scale-in"
        >
          <div className="flex items-center gap-3 border-b border-border bg-ivory-soft px-4 py-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand text-[14px] font-extrabold text-white">
              {initials(user.name)}
            </span>
            <div className="min-w-0">
              <p className="truncate text-[13px] font-bold text-charcoal">{user.name}</p>
              <p className="truncate text-[11px] text-charcoal-secondary">
                {user.phone} · {user.location || 'Ishaka'}
              </p>
            </div>
          </div>

          <div className="p-1.5">
            <MenuLink href="/account" icon={User} label="My account" onClick={() => setOpen(false)} />
            <MenuLink href="/account?tab=orders" icon={ShoppingBag} label="Orders & tracking" onClick={() => setOpen(false)} />
            <MenuLink href="/account?tab=rides" icon={Bike} label="Rides & trips" onClick={() => setOpen(false)} />
            <MenuLink href="/account?tab=saved" icon={Heart} label="Saved places" onClick={() => setOpen(false)} />
            {role !== 'customer' && (
              <MenuLink href={dashboardHref} icon={LayoutDashboard} label="Go to dashboard" onClick={() => setOpen(false)} />
            )}
          </div>

          <div className="border-t border-border p-2">
            <p className="flex items-center gap-1.5 px-2.5 pb-1.5 pt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-charcoal-muted">
              <Sparkles className="h-3 w-3 text-amber" />
              Preview as
            </p>
            <div className="max-h-[224px] overflow-y-auto pr-0.5">
              {availableRoles.map((item) => {
                const Icon = roleIcon[item.role];
                const active = item.role === role;
                return (
                  <button
                    key={item.role}
                    role="menuitem"
                    onClick={() => {
                      switchRole(item.role);
                      setOpen(false);
                    }}
                    className={cn(
                      'flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors',
                      active ? 'bg-sage-light' : 'hover:bg-ivory',
                    )}
                  >
                    <Icon className={cn('h-3.5 w-3.5 shrink-0', active ? 'text-brand' : 'text-charcoal-muted')} />
                    <span className="min-w-0 flex-1">
                      <span className={cn('block truncate text-[12px] font-semibold', active ? 'text-brand' : 'text-charcoal')}>
                        {item.label}
                      </span>
                    </span>
                    {active && <Check className="h-3.5 w-3.5 shrink-0 text-brand" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MenuLink: React.FC<{
  href: string;
  icon: React.ElementType;
  label: string;
  onClick: () => void;
}> = ({ href, icon: Icon, label, onClick }) => (
  <Link
    href={href}
    role="menuitem"
    onClick={onClick}
    className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[12.5px] font-semibold text-charcoal transition-colors hover:bg-ivory"
  >
    <Icon className="h-4 w-4 text-charcoal-secondary" />
    {label}
  </Link>
);
