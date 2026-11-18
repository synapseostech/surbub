'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { Currency } from '@/components/common/Currency';
import { StatusBadge } from '@/components/common/StatusBadge';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { StatCard } from '@/components/dashboard/StatCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { useToast } from '@/components/ui/Toast';
import {
  ShieldCheck,
  Store,
  Users,
  Bike,
  TrendingUp,
  ShoppingBag,
  CheckCircle2,
  XCircle,
  Search,
  MapPin,
  Activity,
  Pill,
  ArrowRight,
  Clock,
} from 'lucide-react';

interface PendingBusiness {
  id: string;
  name: string;
  category: string;
  location: string;
  owner: string;
  phone: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

const INITIAL_QUEUE: PendingBusiness[] = [
  {
    id: 'biz_pend_01',
    name: 'Rwentuha Organic Honey & Dairy Hub',
    category: 'Groceries & farm produce',
    location: 'Rwentuha Trading Centre, Bushenyi',
    owner: 'Justine Asiimwe',
    phone: '+256 779 812 300',
    submittedAt: '2026-11-18 10:15',
    status: 'pending',
  },
  {
    id: 'biz_pend_02',
    name: 'Kizinda Highway Tyre & Motorcycle Garage',
    category: 'Auto services & spares',
    location: 'Kizinda Trading Centre',
    owner: 'Gideon Mugisha',
    phone: '+256 702 331 990',
    submittedAt: '2026-11-17 16:40',
    status: 'pending',
  },
  {
    id: 'biz_pend_03',
    name: 'Nyakabirizi Tea Growers Café',
    category: 'Café & bakery',
    location: 'Nyakabirizi Trading Centre',
    owner: 'Milly Kembabazi',
    phone: '+256 774 220 118',
    submittedAt: '2026-11-16 09:05',
    status: 'approved',
  },
];

const ACTIVITY = [
  { title: 'Ankole Spice Kitchen — goat muchomo', meta: 'Order ord_sub_8921 · KIU Campus · 12:10', amount: 34500, type: 'order' },
  { title: 'Sparkle Laundry — 4kg wash & fold', meta: 'Booking lb_1001 · Bassajjabalaba · 11:30', amount: 23000, type: 'laundry' },
  { title: 'Boda trip — KIU Gate to Roundabout', meta: 'Rider Ronald Katushabe · 09:15', amount: 1310, type: 'ride' },
  { title: 'Valley Health Pharmacy — ORS enquiry', meta: 'Inquiry pharm_inq_204 · Hospital Road · 08:52', amount: 0, type: 'pharmacy' },
];

export default function AdminDashboardPage() {
  const { toast } = useToast();
  const [queue, setQueue] = useState<PendingBusiness[]>(INITIAL_QUEUE);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const pendingCount = queue.filter((business) => business.status === 'pending').length;

  const filteredQueue = useMemo(() => {
    const search = query.toLowerCase().trim();
    return queue.filter((business) => {
      const matchesFilter = filter === 'all' || business.status === filter;
      const matchesSearch =
        !search ||
        business.name.toLowerCase().includes(search) ||
        business.owner.toLowerCase().includes(search) ||
        business.location.toLowerCase().includes(search);
      return matchesFilter && matchesSearch;
    });
  }, [queue, filter, query]);

  const updateStatus = (id: string, status: PendingBusiness['status']) => {
    setQueue((previous) => previous.map((business) => (business.id === id ? { ...business, status } : business)));
    const business = queue.find((item) => item.id === id);
    toast(
      status === 'approved' ? 'Partner approved' : 'Application declined',
      business ? business.name : 'Listing updated',
      status === 'approved' ? 'success' : 'info',
    );
  };

  return (
    <DashboardShell
      eyebrow="Platform operations"
      title="Administration console"
      subtitle="Oversee merchants, riders and marketplace health across Greater Ishaka–Bushenyi."
      roleLabel="Admin"
      actions={
        <>
          <Button href="/" variant="outline" size="sm">
            Customer view
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
          <Badge tone="dark" dot>
            Super admin
          </Badge>
        </>
      }
    >
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-3">
        <StatCard
          label="Gross merchandise value"
          value={<Currency amount={14850000} showPrefix />}
          trend={{ value: '+18.6% MoM', direction: 'up' }}
          icon={<TrendingUp />}
          tone="dark"
        />
        <StatCard label="Active customers" value="1,248" hint="Students, medics & families" icon={<Users />} />
        <StatCard label="Registered businesses" value="28" hint="Restaurants, chemists & laundry" icon={<Store />} />
        <StatCard label="Active riders" value="42" hint="Across 6 verified stages" icon={<Bike />} />
        <StatCard label="Orders today" value="186" hint="Food, laundry & pharmacy" icon={<ShoppingBag />} />
        <StatCard
          label="Pending approvals"
          value={pendingCount}
          hint="Awaiting document checks"
          icon={<Clock />}
          tone="accent"
        />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-12">
        {/* Approval queue */}
        <section className="xl:col-span-8">
          <div className="overflow-hidden rounded-card border border-border bg-white shadow-card">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-4 sm:px-5">
              <div>
                <h2 className="text-card text-charcoal">Merchant onboarding queue</h2>
                <p className="mt-0.5 text-[11.5px] text-charcoal-secondary">
                  Verify documents before a catalogue goes live.
                </p>
              </div>
              <Badge tone={pendingCount > 0 ? 'warning' : 'success'}>{pendingCount} pending</Badge>
            </div>

            <div className="flex flex-col gap-3 border-b border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <div className="relative w-full sm:max-w-xs">
                <label htmlFor="partner-search" className="sr-only">
                  Search applications
                </label>
                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-charcoal-muted" />
                <input
                  id="partner-search"
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search business, owner or location…"
                  className="field h-9 pl-9 text-[12px]"
                />
              </div>
              <div className="flex gap-1.5">
                {(['all', 'pending', 'approved', 'rejected'] as const).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setFilter(option)}
                    aria-pressed={filter === option}
                    className={
                      'h-8 rounded-lg px-2.5 text-[11.5px] font-semibold capitalize transition-colors ' +
                      (filter === option
                        ? 'bg-brand text-white'
                        : 'bg-ivory text-charcoal-secondary hover:bg-sage-light')
                    }
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {filteredQueue.length === 0 ? (
              <div className="p-5">
                <EmptyState
                  icon={<ShieldCheck className="h-6 w-6" />}
                  title="Nothing in this view"
                  description="No applications match the current search and status filter."
                  compact
                />
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {filteredQueue.map((business) => (
                  <li key={business.id} className="px-4 py-4 sm:px-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-[13px] font-bold text-charcoal">{business.name}</h3>
                          <Badge tone="neutral">{business.category}</Badge>
                          <StatusBadge status={business.status} />
                        </div>
                        <p className="mt-1 text-[11.5px] text-charcoal-secondary">
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-brand" />
                            {business.location}
                          </span>
                          {' · '}
                          {business.owner} ({business.phone})
                        </p>
                        <p className="mt-0.5 text-[10.5px] text-charcoal-muted">
                          Submitted {business.submittedAt} · permit & tax documents attached
                        </p>
                      </div>

                      {business.status === 'pending' ? (
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" onClick={() => updateStatus(business.id, 'rejected')}>
                            <XCircle className="h-3.5 w-3.5" />
                            Decline
                          </Button>
                          <Button size="sm" onClick={() => updateStatus(business.id, 'approved')}>
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Approve
                          </Button>
                        </div>
                      ) : (
                        <Badge tone={business.status === 'approved' ? 'success' : 'error'}>
                          {business.status === 'approved' ? 'Live on marketplace' : 'Application closed'}
                        </Badge>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* Side panels */}
        <div className="space-y-5 xl:col-span-4">
          <section className="rounded-card border border-border bg-white p-4 shadow-card">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-card text-charcoal">
                <Activity className="h-4 w-4 text-brand" />
                Platform health
              </h2>
              <Badge tone="success" dot>
                Healthy
              </Badge>
            </div>
            <ul className="mt-3 space-y-2.5 text-[12px]">
              {[
                { label: 'Order success rate', value: '98.2%', tone: 'success' as const },
                { label: 'Average delivery time', value: '27 min', tone: 'neutral' as const },
                { label: 'Rider acceptance', value: '93.1%', tone: 'neutral' as const },
                { label: 'Open support tickets', value: '4', tone: 'warning' as const },
              ].map((row) => (
                <li key={row.label} className="flex items-center justify-between">
                  <span className="text-charcoal-secondary">{row.label}</span>
                  <span className="numeric font-bold text-charcoal">{row.value}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-card border border-border bg-white p-4 shadow-card">
            <h2 className="flex items-center gap-2 text-card text-charcoal">
              <Pill className="h-4 w-4 text-brand" />
              Pharmacy data readiness
            </h2>
            <div className="mt-3 flex items-start gap-2 rounded-xl border border-status-success/25 bg-status-successSoft p-3">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-status-success" />
              <p className="text-[11.5px] leading-relaxed text-charcoal-secondary">
                <span className="font-bold text-charcoal">Connector ready.</span> Published prices are stored per
                chemist; live stock remains a counter-verified process.
              </p>
            </div>
            <ul className="mt-3 space-y-2 text-[11.5px] text-charcoal-secondary">
              {['Valley Health Pharmacy', 'Ishaka Central Chemist', 'KIU Teaching Hospital Junction', 'Bushenyi Central Pharmacy'].map(
                (name) => (
                  <li key={name} className="flex items-center justify-between gap-2">
                    <span className="truncate">{name}</span>
                    <span className="shrink-0 text-[10px] font-semibold text-status-success">Contract ready</span>
                  </li>
                ),
              )}
            </ul>
            <Link
              href="/pharmacy"
              className="mt-3 inline-flex items-center gap-1 text-label font-bold text-brand transition-colors hover:text-brand-secondary"
            >
              Open pharmacy marketplace
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </section>
        </div>
      </div>

      {/* Activity */}
      <section className="mt-5 overflow-hidden rounded-card border border-border bg-white shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-4 sm:px-5">
          <div>
            <h2 className="text-card text-charcoal">Recent marketplace activity</h2>
            <p className="mt-0.5 text-[11.5px] text-charcoal-secondary">Live sample of orders, bookings and inquiries</p>
          </div>
          <Badge tone="neutral">Last 4 hours</Badge>
        </div>
        <ul className="divide-y divide-border">
          {ACTIVITY.map((item) => (
            <li key={item.title} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3.5 sm:px-5">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sage-light text-brand">
                  {item.type === 'ride' ? <Bike className="h-4 w-4" /> : item.type === 'pharmacy' ? <Pill className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[12.5px] font-semibold text-charcoal">{item.title}</p>
                  <p className="mt-0.5 truncate text-[10.5px] text-charcoal-muted">{item.meta}</p>
                </div>
              </div>
              {item.amount > 0 ? (
                <Currency amount={item.amount} className="text-[12px] font-bold text-charcoal" />
              ) : (
                <Badge tone="neutral">Inquiry</Badge>
              )}
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-4 flex items-center gap-1.5 text-[11px] text-charcoal-muted">
        <ShieldCheck className="h-3.5 w-3.5" />
        Demonstration console · approvals and figures are local to this browser.
      </p>
    </DashboardShell>
  );
}
