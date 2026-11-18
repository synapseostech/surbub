'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { orderService } from '@/services/order-service';
import { rideService } from '@/services/ride-service';
import { laundryService } from '@/services/laundry-service';
import { notificationService } from '@/services/notification-service';
import type { Order } from '@/types/order';
import type { RideRequest } from '@/types/mobility';
import type { LaundryBookingRequest } from '@/types/laundry';
import type { NotificationItem } from '@/types/notification';
import { Currency } from '@/components/common/Currency';
import { StatusBadge } from '@/components/common/StatusBadge';
import { PageHeader } from '@/components/ui/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { SmartImage } from '@/components/ui/SmartImage';
import { useToast } from '@/components/ui/Toast';
import {
  User,
  ShoppingBag,
  Bike,
  Shirt,
  MapPin,
  Bell,
  Settings,
  Clock,
  Phone,
  ChevronRight,
  Heart,
  UtensilsCrossed,
  Sparkles,
  Trash2,
} from 'lucide-react';

function CustomerAccountContent() {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [rides, setRides] = useState<RideRequest[]>([]);
  const [laundryBookings, setLaundryBookings] = useState<LaundryBookingRequest[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    orderService.getAllOrders().then(setOrders);
    rideService.getAllRides().then(setRides);
    laundryService.getAllBookings().then(setLaundryBookings);
    notificationService.getNotifications(user.id).then(setNotifications);
  }, [user.id]);

  const unread = notifications.filter((notification) => !notification.read).length;

  const navItems = [
    { id: 'orders', label: 'My orders', hint: 'Food & pharmacy', icon: ShoppingBag, count: orders.length },
    { id: 'rides', label: 'Ride history', hint: 'Boda & parcels', icon: Bike, count: rides.length },
    { id: 'laundry', label: 'Laundry care', hint: 'Pickups booked', icon: Shirt, count: laundryBookings.length },
    { id: 'notifications', label: 'Notifications', hint: 'Order updates', icon: Bell, count: unread },
    { id: 'profile', label: 'Profile & addresses', hint: 'Delivery details', icon: User },
    { id: 'settings', label: 'Account settings', hint: 'Demo preferences', icon: Settings },
  ];

  const resetDemo = () => {
    if (confirm('Clear all demo data from this browser?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="page-container">
      <PageHeader
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Account' }]}
        eyebrow="Your account"
        title={user.name}
        description={`${user.email} · ${user.phone}`}
        meta={
          <>
            <Badge tone="brand">Customer</Badge>
            <span className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-charcoal-secondary">
              <MapPin className="h-3.5 w-3.5 text-brand" />
              {user.location || 'KIU Hostels, Ishaka–Bushenyi'}
            </span>
          </>
        }
        actions={
          <>
            <Button href="/restaurants" size="md">
              <UtensilsCrossed className="h-4 w-4" />
              Order food
            </Button>
            <Button href="/rides" variant="outline" size="md">
              <Bike className="h-4 w-4 text-brand" />
              Request boda
            </Button>
          </>
        }
      />

      <div className="grid gap-5 lg:grid-cols-12 lg:gap-6">
        {/* Sidebar */}
        <aside className="lg:col-span-3">
          <div className="rounded-card border border-border bg-white p-4 shadow-card">
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <SmartImage
                src={user.avatarUrl || '/images/curated/portrait-woman.jpg'}
                alt={user.name}
                ratio="aspect-square"
                className="w-12 shrink-0 rounded-xl"
              />
              <div className="min-w-0">
                <p className="truncate text-label font-bold text-charcoal">{user.name}</p>
                <p className="truncate text-[11px] text-charcoal-muted">Member since 2024</p>
              </div>
            </div>

            <nav aria-label="Account sections" className="mt-2 space-y-0.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveTab(item.id)}
                    aria-current={active ? 'page' : undefined}
                    className={
                      'flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2.5 text-left transition-colors ' +
                      (active ? 'bg-brand text-white' : 'text-charcoal hover:bg-sage-light')
                    }
                  >
                    <Icon className={'h-4 w-4 shrink-0 ' + (active ? 'text-amber' : 'text-charcoal-muted')} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-label font-semibold">{item.label}</span>
                      <span className={'block truncate text-[10.5px] ' + (active ? 'text-white/55' : 'text-charcoal-muted')}>
                        {item.hint}
                      </span>
                    </span>
                    {item.count !== undefined && item.count > 0 && (
                      <span
                        className={
                          'numeric shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-bold ' +
                          (active ? 'bg-white/15 text-white' : 'bg-ivory text-charcoal-secondary')
                        }
                      >
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-card border border-border bg-sage-soft px-4 py-3">
            <Sparkles className="h-4 w-4 shrink-0 text-brand" />
            <p className="text-[11px] leading-relaxed text-charcoal-secondary">
              Signed in with a demo customer profile. Switch roles from the account menu to preview partner views.
            </p>
          </div>
        </aside>

        {/* Panel */}
        <div className="min-w-0 lg:col-span-9">
          {activeTab === 'orders' && (
            <section className="rounded-card border border-border bg-white shadow-card">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-5 py-4">
                <div>
                  <h2 className="text-card text-charcoal">Food & merchant orders</h2>
                  <p className="mt-0.5 text-[11.5px] text-charcoal-secondary">
                    {orders.length} order{orders.length === 1 ? '' : 's'} recorded on this device
                  </p>
                </div>
                <Button href="/restaurants" size="sm" variant="secondary">
                  Order again
                </Button>
              </div>

              {orders.length === 0 ? (
                <div className="p-5">
                  <EmptyState
                    icon={<ShoppingBag className="h-6 w-6" />}
                    title="No orders yet"
                    description="Your first muchomo, rolex or katogo will appear here once you place an order."
                    actionLabel="Browse restaurants"
                    actionHref="/restaurants"
                  />
                </div>
              ) : (
                <ul className="divide-y divide-border">
                  {orders.map((order) => (
                    <li key={order.id} className="px-5 py-4">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="numeric text-[11px] font-bold text-charcoal-muted">{order.id}</span>
                            <StatusBadge status={order.status} />
                          </div>
                          <p className="mt-1 text-label font-bold text-charcoal">{order.merchantName}</p>
                          <p className="mt-0.5 text-[11px] text-charcoal-muted">
                            {order.items.map((item) => `${item.quantity}× ${item.name}`).join(' · ')}
                          </p>
                        </div>
                        <div className="text-right">
                          <Currency amount={order.totalUGX} className="text-[14px] font-extrabold text-charcoal" />
                          <p className="mt-0.5 text-[10.5px] text-charcoal-muted">{order.createdAt}</p>
                        </div>
                      </div>

                      <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-border pt-2.5 text-[10.5px] text-charcoal-secondary">
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-brand" />
                          {order.deliveryAddress} · {order.deliveryNeighborhood}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3 w-3 text-brand" />
                          {order.paymentMethod.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}

          {activeTab === 'rides' && (
            <section className="rounded-card border border-border bg-white shadow-card">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-5 py-4">
                <div>
                  <h2 className="text-card text-charcoal">Boda & mobility trips</h2>
                  <p className="mt-0.5 text-[11.5px] text-charcoal-secondary">Simulated fares from your recent requests</p>
                </div>
                <Button href="/rides" size="sm" variant="secondary">
                  New ride
                </Button>
              </div>

              {rides.length === 0 ? (
                <div className="p-5">
                  <EmptyState
                    icon={<Bike className="h-6 w-6" />}
                    title="No trips yet"
                    description="Request a boda or parcel delivery and your fare history will appear here."
                    actionLabel="Book a ride"
                    actionHref="/rides"
                  />
                </div>
              ) : (
                <ul className="divide-y divide-border">
                  {rides.map((ride) => (
                    <li key={ride.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="numeric text-[11px] font-bold text-charcoal-muted">{ride.id}</span>
                          <StatusBadge status={ride.status} />
                          <span className="text-[10.5px] text-charcoal-muted">{ride.createdAt}</span>
                        </div>
                        <p className="mt-1 truncate text-label font-semibold text-charcoal">
                          {ride.pickup} <span className="text-charcoal-muted">→</span> {ride.destination}
                        </p>
                        <p className="mt-0.5 text-[10.5px] text-charcoal-muted">
                          {ride.rideType.replace(/_/g, ' ')} · {ride.distanceKm} km
                          {ride.assignedDriver ? ` · ${ride.assignedDriver.name}` : ''}
                        </p>
                      </div>
                      <Currency amount={ride.fareUGX} className="text-[13.5px] font-extrabold text-brand" />
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}

          {activeTab === 'laundry' && (
            <section className="rounded-card border border-border bg-white shadow-card">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-5 py-4">
                <div>
                  <h2 className="text-card text-charcoal">Laundry & pressing</h2>
                  <p className="mt-0.5 text-[11.5px] text-charcoal-secondary">Pickup windows you have scheduled</p>
                </div>
                <Button href="/laundry" size="sm" variant="secondary">
                  Book pickup
                </Button>
              </div>

              {laundryBookings.length === 0 ? (
                <div className="p-5">
                  <EmptyState
                    icon={<Shirt className="h-6 w-6" />}
                    title="No laundry booked"
                    description="Schedule a doorstep pickup and track it here from collection to delivery."
                    actionLabel="Browse laundry"
                    actionHref="/laundry"
                  />
                </div>
              ) : (
                <ul className="divide-y divide-border">
                  {laundryBookings.map((booking) => (
                    <li key={booking.id} className="px-5 py-4">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="numeric text-[11px] font-bold text-charcoal-muted">{booking.id}</span>
                            <StatusBadge status={booking.status} />
                          </div>
                          <p className="mt-1 text-label font-bold text-charcoal">{booking.providerName}</p>
                          <p className="mt-0.5 text-[11px] text-charcoal-secondary">
                            {booking.pickupDate} · {booking.pickupTimeSlot}
                          </p>
                        </div>
                        <Currency amount={booking.estimatedTotalUGX} className="text-[13.5px] font-extrabold text-brand" />
                      </div>
                      <p className="mt-2 border-t border-border pt-2 text-[10.5px] text-charcoal-muted">
                        {booking.items.map((item) => `${item.quantity}× ${item.name}`).join(' · ')} · {booking.pickupAddress}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}

          {activeTab === 'notifications' && (
            <section className="rounded-card border border-border bg-white shadow-card">
              <div className="flex items-center justify-between gap-2 border-b border-border px-5 py-4">
                <div>
                  <h2 className="text-card text-charcoal">Notifications</h2>
                  <p className="mt-0.5 text-[11.5px] text-charcoal-secondary">Order, ride and platform updates</p>
                </div>
                {unread > 0 && <Badge tone="amber">{unread} unread</Badge>}
              </div>

              {notifications.length === 0 ? (
                <div className="p-5">
                  <EmptyState
                    icon={<Bell className="h-6 w-6" />}
                    title="All clear"
                    description="Order and ride updates will show up here as they happen."
                  />
                </div>
              ) : (
                <ul className="divide-y divide-border">
                  {notifications.map((notification) => (
                    <li
                      key={notification.id}
                      className={'flex gap-3 px-5 py-3.5 ' + (notification.read ? 'bg-white' : 'bg-sage-soft/60')}
                    >
                      <span
                        className={
                          'mt-1 h-2 w-2 shrink-0 rounded-full ' +
                          (notification.read ? 'bg-border-strong' : 'bg-amber')
                        }
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="text-label font-bold text-charcoal">{notification.title}</p>
                          <span className="text-[10px] text-charcoal-muted">{notification.createdAt}</span>
                        </div>
                        <p className="mt-0.5 text-[11.5px] leading-relaxed text-charcoal-secondary">{notification.message}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}

          {activeTab === 'profile' && (
            <section className="space-y-5">
              <div className="rounded-card border border-border bg-white p-5 shadow-card">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
                  <div>
                    <h2 className="text-card text-charcoal">Saved delivery addresses</h2>
                    <p className="mt-0.5 text-[11.5px] text-charcoal-secondary">Used at checkout for food and laundry.</p>
                  </div>
                  <Button href="/checkout" size="sm" variant="outline">
                    Manage at checkout
                  </Button>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border-2 border-brand bg-sage-soft p-4">
                    <div className="flex items-center justify-between">
                      <Badge tone="sage">Default delivery</Badge>
                      <MapPin className="h-4 w-4 text-brand" />
                    </div>
                    <h3 className="mt-2 text-label font-bold text-charcoal">KIU Medical Hostels</h3>
                    <p className="mt-0.5 text-[12px] text-charcoal-secondary">Room 14, Block C, KIU Girls Hostel Strip</p>
                    <p className="mt-1 text-[11px] text-charcoal-muted">Ishaka Division, Bushenyi District</p>
                  </div>

                  <div className="rounded-xl border border-border bg-white p-4">
                    <div className="flex items-center justify-between">
                      <Badge tone="neutral">Work</Badge>
                      <MapPin className="h-4 w-4 text-charcoal-muted" />
                    </div>
                    <h3 className="mt-2 text-label font-bold text-charcoal">Ishaka Adventist Hospital</h3>
                    <p className="mt-0.5 text-[12px] text-charcoal-secondary">Nursing Station 2, Ward B</p>
                    <p className="mt-1 text-[11px] text-charcoal-muted">Hospital Road, Ishaka</p>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex items-start gap-3 rounded-card border border-border bg-white p-4">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sage-light text-brand">
                    <Phone className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-charcoal-muted">Phone</p>
                    <p className="mt-0.5 text-label font-bold text-charcoal">{user.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-card border border-border bg-white p-4">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sage-light text-brand">
                    <Heart className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-charcoal-muted">Saved places</p>
                    <p className="mt-0.5 text-label font-bold text-charcoal">3 favourite kitchens</p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeTab === 'settings' && (
            <section className="rounded-card border border-border bg-white p-5 shadow-card">
              <h2 className="text-card text-charcoal">Demo settings</h2>
              <p className="mt-2 text-[12.5px] leading-relaxed text-charcoal-secondary">
                You are exploring SUBURB+ as <span className="font-semibold text-charcoal">{user.name}</span>. Carts,
                orders, laundry bookings and simulated rides are stored in this browser only — nothing leaves your
                device.
              </p>

              <div className="mt-4 space-y-2 rounded-xl border border-border bg-ivory-soft p-3.5">
                <div className="flex items-center justify-between text-[12px]">
                  <span className="text-charcoal-secondary">Account role</span>
                  <Badge tone="neutral">{user.role.replace(/_/g, ' ')}</Badge>
                </div>
                <div className="flex items-center justify-between text-[12px]">
                  <span className="text-charcoal-secondary">Primary location</span>
                  <span className="font-semibold text-charcoal">{user.location || 'Ishaka–Bushenyi'}</span>
                </div>
                <div className="flex items-center justify-between text-[12px]">
                  <span className="text-charcoal-secondary">Notifications</span>
                  <span className="font-semibold text-status-success">Enabled in demo</span>
                </div>
              </div>

              <button
                type="button"
                onClick={resetDemo}
                className="mt-4 inline-flex h-10 items-center gap-2 rounded-xl border border-status-error/25 bg-status-errorSoft px-4 text-label font-bold text-status-error transition-colors hover:bg-status-error/10"
              >
                <Trash2 className="h-4 w-4" />
                Reset demo data
              </button>
            </section>
          )}
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-card border border-border bg-white px-5 py-4">
        <p className="text-label font-semibold text-charcoal">Need something else?</p>
        <div className="flex flex-wrap gap-2">
          {[
            { href: '/pharmacy', label: 'Pharmacy prices' },
            { href: '/laundry', label: 'Laundry pickup' },
            { href: '/vehicles', label: 'Vehicle hire' },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-[11.5px] font-semibold text-charcoal-secondary transition-colors hover:border-brand/30 hover:text-brand"
            >
              {link.label}
              <ChevronRight className="h-3 w-3" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CustomerAccountPage() {
  return (
    <Suspense
      fallback={
        <div className="page-container py-10">
          <div className="h-8 w-56 rounded-lg bg-sage-soft skeleton" />
          <div className="mt-6 grid gap-5 lg:grid-cols-12">
            <div className="h-72 rounded-card bg-white skeleton lg:col-span-3" />
            <div className="h-96 rounded-card bg-white skeleton lg:col-span-9" />
          </div>
        </div>
      }
    >
      <CustomerAccountContent />
    </Suspense>
  );
}
