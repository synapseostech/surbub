'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { MOCK_MENU_ITEMS } from '@/data/mock/restaurants';
import { MOCK_PHARMACY_PRODUCTS } from '@/data/mock/pharmacies';
import { MOCK_LAUNDRY_SERVICES } from '@/data/mock/laundry';
import { orderService } from '@/services/order-service';
import type { Order, OrderStatus } from '@/types/order';
import { Currency } from '@/components/common/Currency';
import { StatusBadge } from '@/components/common/StatusBadge';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { StatCard } from '@/components/dashboard/StatCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { EmptyState } from '@/components/ui/EmptyState';
import { useToast } from '@/components/ui/Toast';
import {
  UtensilsCrossed,
  Pill,
  Shirt,
  TrendingUp,
  ShoppingBag,
  Wallet,
  Star,
  Search,
  Check,
  Clock,
  Bike,
  ChefHat,
  ArrowRight,
  PackageCheck,
} from 'lucide-react';

type BusinessType = 'restaurant' | 'pharmacy' | 'laundry';

const WEEK = [
  { day: 'Mon', value: 268000 },
  { day: 'Tue', value: 312000 },
  { day: 'Wed', value: 289000 },
  { day: 'Thu', value: 354000 },
  { day: 'Fri', value: 438000 },
  { day: 'Sat', value: 512000 },
  { day: 'Sun', value: 397000 },
];

export default function BusinessDashboardPage() {
  const { toast } = useToast();

  const [businessType, setBusinessType] = useState<BusinessType>('restaurant');
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'delivered'>('all');
  const [query, setQuery] = useState('');

  useEffect(() => {
    orderService.getAllOrders().then(setOrders);
  }, []);

  const advanceOrder = async (orderId: string, nextStatus: OrderStatus) => {
    const updated = await orderService.updateOrderStatus(orderId, nextStatus);
    if (updated) {
      setOrders((previous) => previous.map((order) => (order.id === orderId ? updated : order)));
      toast('Ticket updated', `Order ${orderId} is now ${nextStatus.replace(/_/g, ' ')}.`);
    }
  };

  const stats = useMemo(() => {
    if (businessType === 'pharmacy') {
      return {
        name: 'Valley Health Pharmacy',
        category: 'Community chemist · NDA licensed',
        location: 'Hospital Road, Ishaka',
        revenueUGX: 1820000,
        ordersCount: 84,
        avgTicketUGX: 21660,
        rating: 4.9,
        itemsCount: MOCK_PHARMACY_PRODUCTS.length,
        itemLabel: 'Products',
        change: '+9.4%',
      };
    }
    if (businessType === 'laundry') {
      return {
        name: 'Sparkle Bushenyi Laundry & Pressing',
        category: 'Garment care & pressing',
        location: 'Bassajjabalaba, Bushenyi',
        revenueUGX: 1390000,
        ordersCount: 62,
        avgTicketUGX: 22400,
        rating: 4.8,
        itemsCount: MOCK_LAUNDRY_SERVICES['laundry_01']?.length || 5,
        itemLabel: 'Packages',
        change: '+6.1%',
      };
    }
    return {
      name: 'Ankole Spice Kitchen & Grill',
      category: 'Restaurant & charcoal grill',
      location: 'Ishaka Roundabout',
      revenueUGX: 2450000,
      ordersCount: 118,
      avgTicketUGX: 20760,
      rating: 4.8,
      itemsCount: MOCK_MENU_ITEMS['rest_01']?.length || 5,
      itemLabel: 'Menu items',
      change: '+14.2%',
    };
  }, [businessType]);

  const filteredOrders = useMemo(() => {
    const search = query.toLowerCase().trim();
    return orders.filter((order) => {
      const matchesStatus =
        statusFilter === 'all'
          ? true
          : statusFilter === 'delivered'
            ? order.status === 'delivered'
            : order.status !== 'delivered' && order.status !== 'cancelled';
      const matchesQuery =
        !search ||
        order.id.toLowerCase().includes(search) ||
        order.customerName.toLowerCase().includes(search) ||
        order.merchantName.toLowerCase().includes(search);
      return matchesStatus && matchesQuery;
    });
  }, [orders, statusFilter, query]);

  const weekTotal = WEEK.reduce((sum, day) => sum + day.value, 0);
  const peak = Math.max(...WEEK.map((day) => day.value));

  const nextAction = (order: Order) => {
    switch (order.status) {
      case 'placed':
        return { label: 'Accept ticket', status: 'confirmed_by_merchant' as OrderStatus, icon: Check };
      case 'confirmed_by_merchant':
        return { label: 'Start preparing', status: 'preparing' as OrderStatus, icon: ChefHat };
      case 'preparing':
        return { label: 'Hand to rider', status: 'out_for_delivery' as OrderStatus, icon: Bike };
      case 'out_for_delivery':
        return { label: 'Mark delivered', status: 'delivered' as OrderStatus, icon: PackageCheck };
      default:
        return null;
    }
  };

  return (
    <DashboardShell
      eyebrow="Merchant workspace"
      title={stats.name}
      subtitle={`${stats.category} · ${stats.location}. Manage your live queue, catalogue and this week's trade.`}
      roleLabel="Business"
      actions={
        <>
          <Button href="/" variant="outline" size="sm">
            View storefront
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
          <Badge tone="neutral" dot>
            Demo ledger
          </Badge>
        </>
      }
    >
      {/* Business switcher */}
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <span className="mr-1 text-[10.5px] font-bold uppercase tracking-[0.12em] text-charcoal-muted">Preview as</span>
        {[
          { id: 'restaurant' as BusinessType, label: 'Restaurant', icon: UtensilsCrossed },
          { id: 'pharmacy' as BusinessType, label: 'Pharmacy', icon: Pill },
          { id: 'laundry' as BusinessType, label: 'Laundry', icon: Shirt },
        ].map((option) => {
          const Icon = option.icon;
          return (
            <Chip
              key={option.id}
              active={businessType === option.id}
              onClick={() => setBusinessType(option.id)}
              icon={<Icon />}
            >
              {option.label}
            </Chip>
          );
        })}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard
          label="Gross sales · 7 days"
          value={<Currency amount={stats.revenueUGX} showPrefix />}
          trend={{ value: stats.change, direction: 'up' }}
          hint="vs last week"
          icon={<Wallet />}
        />
        <StatCard label="Orders fulfilled" value={stats.ordersCount} hint="through SUBURB+" icon={<ShoppingBag />} />
        <StatCard label="Average basket" value={<Currency amount={stats.avgTicketUGX} showPrefix />} hint="per order" icon={<TrendingUp />} />
        <StatCard
          label="Customer rating"
          value={stats.rating.toFixed(1)}
          hint="from 140+ local reviews"
          icon={<Star />}
          tone="dark"
        />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-12">
        {/* Order queue */}
        <section className="min-w-0 xl:col-span-8">
          <div className="overflow-hidden rounded-card border border-border bg-white shadow-card">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-4 sm:px-5">
              <div>
                <h2 className="text-card text-charcoal">Live order queue</h2>
                <p className="mt-0.5 text-[11.5px] text-charcoal-secondary">
                  {filteredOrders.length} of {orders.length} sample tickets shown
                </p>
              </div>
              <Badge tone="success" dot>
                Kitchen open
              </Badge>
            </div>

            <div className="flex flex-col gap-3 border-b border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <div className="relative w-full sm:max-w-xs">
                <label htmlFor="order-search" className="sr-only">
                  Search orders
                </label>
                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-charcoal-muted" />
                <input
                  id="order-search"
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search order or customer…"
                  className="field h-9 pl-9 text-[12px]"
                />
              </div>
              <div className="flex gap-1.5">
                {[
                  { id: 'all' as const, label: 'All' },
                  { id: 'active' as const, label: 'Active' },
                  { id: 'delivered' as const, label: 'Delivered' },
                ].map((filter) => (
                  <button
                    key={filter.id}
                    type="button"
                    onClick={() => setStatusFilter(filter.id)}
                    aria-pressed={statusFilter === filter.id}
                    className={
                      'h-8 rounded-lg px-2.5 text-[11.5px] font-semibold transition-colors ' +
                      (statusFilter === filter.id
                        ? 'bg-brand text-white'
                        : 'bg-ivory text-charcoal-secondary hover:bg-sage-light')
                    }
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="p-5">
                <EmptyState
                  icon={<ShoppingBag className="h-6 w-6" />}
                  title="No tickets in this view"
                  description="Adjust the search or status filter to see other orders."
                  compact
                />
              </div>
            ) : (
              <>
                {/* Desktop table */}
                <div className="hidden overflow-x-auto lg:block">
                  <table className="w-full min-w-[620px] text-left">
                    <thead>
                      <tr className="border-b border-border bg-ivory-soft text-[10px] font-bold uppercase tracking-[0.1em] text-charcoal-muted">
                        <th scope="col" className="px-5 py-2.5">Order</th>
                        <th scope="col" className="px-3 py-2.5">Customer</th>
                        <th scope="col" className="px-3 py-2.5">Items</th>
                        <th scope="col" className="px-3 py-2.5 text-right">Total</th>
                        <th scope="col" className="px-3 py-2.5">Status</th>
                        <th scope="col" className="px-5 py-2.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredOrders.map((order) => {
                        const action = nextAction(order);
                        return (
                          <tr key={order.id} className="text-[12px] transition-colors hover:bg-ivory-soft">
                            <td className="px-5 py-3">
                              <p className="numeric font-bold text-charcoal">{order.id}</p>
                              <p className="mt-0.5 text-[10.5px] text-charcoal-muted">{order.createdAt}</p>
                            </td>
                            <td className="px-3 py-3">
                              <p className="font-semibold text-charcoal">{order.customerName}</p>
                              <p className="mt-0.5 text-[10.5px] text-charcoal-muted">{order.deliveryNeighborhood}</p>
                            </td>
                            <td className="px-3 py-3 text-charcoal-secondary">
                              {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                              <p className="mt-0.5 max-w-[180px] truncate text-[10.5px] text-charcoal-muted">
                                {order.items.map((item) => item.name).join(', ')}
                              </p>
                            </td>
                            <td className="px-3 py-3 text-right">
                              <Currency amount={order.totalUGX} className="font-bold text-charcoal" />
                            </td>
                            <td className="px-3 py-3">
                              <StatusBadge status={order.status} />
                            </td>
                            <td className="px-5 py-3 text-right">
                              {action ? (
                                <button
                                  type="button"
                                  onClick={() => advanceOrder(order.id, action.status)}
                                  className="inline-flex h-8 items-center gap-1 whitespace-nowrap rounded-lg bg-brand px-2.5 text-[11px] font-bold text-white transition-colors hover:bg-brand-hover"
                                >
                                  <action.icon className="h-3 w-3" />
                                  {action.label}
                                </button>
                              ) : (
                                <span className="inline-flex items-center gap-1 whitespace-nowrap text-[11px] font-semibold text-status-success">
                                  <Check className="h-3.5 w-3.5" />
                                  Complete
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile cards */}
                <ul className="divide-y divide-border lg:hidden">
                  {filteredOrders.map((order) => {
                    const action = nextAction(order);
                    return (
                      <li key={order.id} className="px-4 py-3.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="numeric text-[11px] font-bold text-charcoal-muted">{order.id}</span>
                          <StatusBadge status={order.status} />
                        </div>
                        <p className="mt-1 text-label font-bold text-charcoal">{order.customerName}</p>
                        <p className="mt-0.5 text-[11px] text-charcoal-secondary">
                          {order.items.map((item) => `${item.quantity}× ${item.name}`).join(', ')}
                        </p>
                        <div className="mt-2 flex items-center justify-between">
                          <Currency amount={order.totalUGX} className="text-[13px] font-extrabold text-charcoal" />
                          {action && (
                            <Button size="sm" onClick={() => advanceOrder(order.id, action.status)}>
                              {action.label}
                            </Button>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </>
            )}
          </div>
        </section>

        {/* Right column */}
        <div className="min-w-0 space-y-5 xl:col-span-4">
          <section className="rounded-card border border-border bg-white p-4 shadow-card">
            <div className="flex items-center justify-between">
              <h2 className="text-card text-charcoal">This week</h2>
              <Badge tone="neutral">UGX</Badge>
            </div>
            <p className="numeric mt-2 text-[26px] font-extrabold leading-none tracking-[-0.03em] text-charcoal">
              <Currency amount={weekTotal} showPrefix={false} />
            </p>
            <p className="mt-1 text-[11px] text-charcoal-secondary">Gross sales across all channels</p>

            <div className="mt-4 flex h-28 items-end gap-1.5" role="img" aria-label="Weekly sales bar chart">
              {WEEK.map((day) => (
                <div key={day.day} className="flex flex-1 flex-col items-center gap-1.5">
                  <div
                    className="w-full rounded-t-md bg-brand/80 transition-colors hover:bg-brand"
                    style={{ height: `${Math.max(12, (day.value / peak) * 88)}px` }}
                    title={`${day.day}: UGX ${day.value.toLocaleString('en-US')}`}
                  />
                  <span className="text-[9.5px] font-semibold text-charcoal-muted">{day.day}</span>
                </div>
              ))}
            </div>
            <p className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-status-success">
              <TrendingUp className="h-3 w-3" />
              Saturday is your strongest day
            </p>
          </section>

          <section className="rounded-card border border-border bg-white p-4 shadow-card">
            <h2 className="text-card text-charcoal">Best sellers</h2>
            <ul className="mt-3 space-y-2.5">
              {[
                { name: 'Goat muchomo platter', count: 42, total: 630000 },
                { name: 'Chicken rolex special', count: 38, total: 266000 },
                { name: 'Ankole katogo', count: 29, total: 174000 },
              ].map((item, index) => (
                <li key={item.name} className="flex items-center gap-3">
                  <span className="numeric flex h-6 w-6 items-center justify-center rounded-md bg-ivory text-[10px] font-bold text-charcoal-secondary">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12px] font-semibold text-charcoal">{item.name}</p>
                    <p className="text-[10.5px] text-charcoal-muted">{item.count} sold</p>
                  </div>
                  <Currency amount={item.total} className="text-[11.5px] font-bold text-charcoal" />
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      {/* Catalogue */}
      <section className="mt-5 overflow-hidden rounded-card border border-border bg-white shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-4 sm:px-5">
          <div>
            <h2 className="text-card text-charcoal">{stats.itemLabel}</h2>
            <p className="mt-0.5 text-[11.5px] text-charcoal-secondary">
              {stats.itemsCount} live listings · prices in UGX
            </p>
          </div>
          <Button variant="outline" size="sm">
            Manage catalogue
          </Button>
        </div>

        <div className="divide-y divide-border">
          {businessType === 'restaurant' &&
            (MOCK_MENU_ITEMS['rest_01'] || []).map((item) => (
              <div key={item.id} className="flex items-center gap-3 px-4 py-3 sm:px-5">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12.5px] font-semibold text-charcoal">{item.name}</p>
                  <p className="mt-0.5 text-[10.5px] capitalize text-charcoal-muted">
                    {item.category.replace(/_/g, ' ')} · ~{item.preparationTimeMinutes} min prep
                  </p>
                </div>
                <Badge tone="success">{item.isAvailable ? 'Available' : 'Paused'}</Badge>
                <Currency amount={item.price} className="w-24 shrink-0 text-right text-[12px] font-bold text-charcoal" />
              </div>
            ))}

          {businessType === 'pharmacy' &&
            MOCK_PHARMACY_PRODUCTS.map((product) => (
              <div key={product.id} className="flex items-center gap-3 px-4 py-3 sm:px-5">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12.5px] font-semibold text-charcoal">{product.name}</p>
                  <p className="mt-0.5 truncate text-[10.5px] text-charcoal-muted">{product.dosageForm}</p>
                </div>
                {product.requiresPrescription ? <Badge tone="warning">Rx only</Badge> : <Badge tone="success">OTC</Badge>}
                <Currency amount={product.standardPriceUGX} className="w-24 shrink-0 text-right text-[12px] font-bold text-charcoal" />
              </div>
            ))}

          {businessType === 'laundry' &&
            (MOCK_LAUNDRY_SERVICES['laundry_01'] || []).map((service) => (
              <div key={service.id} className="flex items-center gap-3 px-4 py-3 sm:px-5">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12.5px] font-semibold text-charcoal">{service.name}</p>
                  <p className="mt-0.5 text-[10.5px] text-charcoal-muted">
                    {service.turnaroundTime} turnaround · per {service.unit}
                  </p>
                </div>
                <Badge tone="neutral">{service.category.replace(/_/g, ' ')}</Badge>
                <Currency amount={service.pricePerUnitUGX} className="w-24 shrink-0 text-right text-[12px] font-bold text-charcoal" />
              </div>
            ))}
        </div>
      </section>

      <p className="mt-4 flex items-center gap-1.5 text-[11px] text-charcoal-muted">
        <Clock className="h-3.5 w-3.5" />
        Demonstration ledger · figures and orders are simulated for the Ishaka–Bushenyi preview.
      </p>
    </DashboardShell>
  );
}
