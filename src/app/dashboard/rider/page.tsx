'use client';

import React, { useState } from 'react';
import { INITIAL_MOCK_RIDES, MOCK_DRIVERS } from '@/data/mock/mobility';
import { Currency } from '@/components/common/Currency';
import { StatusBadge } from '@/components/common/StatusBadge';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { StatCard } from '@/components/dashboard/StatCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { useToast } from '@/components/ui/Toast';
import {
  Bike,
  Power,
  MapPin,
  TrendingUp,
  Clock,
  Navigation,
  CheckCircle2,
  Phone,
  ShieldCheck,
  Star,
  Wallet,
  Package,
  X,
} from 'lucide-react';

export default function RiderDashboardPage() {
  const driver = MOCK_DRIVERS[0];
  const { toast } = useToast();

  const [isOnline, setIsOnline] = useState(true);
  const [requests, setRequests] = useState([
    {
      id: 'req_live_401',
      type: 'boda',
      pickup: 'KIU Main Gate Stage',
      dropoff: 'Ishaka Roundabout / Stanbic Bank',
      distanceKm: 1.8,
      fareUGX: 1310,
      customer: 'Brenda Kemigisha',
      phone: '+256 772 341 892',
      etaMinutes: 2,
    },
    {
      id: 'req_live_402',
      type: 'delivery_boda',
      pickup: 'Ankole Spice Kitchen & Grill',
      dropoff: 'Block B, KIU Girls Hostel',
      distanceKm: 2.4,
      fareUGX: 2000,
      customer: 'Nicholas Otim',
      phone: '+256 701 443 219',
      etaMinutes: 5,
    },
  ]);

  const [tripsToday, setTripsToday] = useState(12);
  const [earningsToday, setEarningsToday] = useState(48500);

  const accept = (request: (typeof requests)[number]) => {
    setRequests((previous) => previous.filter((item) => item.id !== request.id));
    setTripsToday((count) => count + 1);
    setEarningsToday((total) => total + request.fareUGX);
    toast('Job accepted', `${request.pickup} → ${request.dropoff}. Customer notified.`);
  };

  const decline = (id: string) => {
    setRequests((previous) => previous.filter((item) => item.id !== id));
    toast('Request declined', 'The dispatch desk will offer it to another rider.', 'info');
  };

  return (
    <DashboardShell
      eyebrow="Rider console"
      title={driver.name}
      subtitle={`${driver.plateNumber} · KIU Main Gate stage. Accept jobs, track earnings and keep your stage standing.`}
      roleLabel="Rider"
      actions={
        <button
          type="button"
          onClick={() => setIsOnline((value) => !value)}
          aria-pressed={isOnline}
          className={
            'inline-flex h-10 items-center gap-2 rounded-xl px-4 text-label font-bold transition-colors ' +
            (isOnline
              ? 'bg-brand text-white hover:bg-brand-hover'
              : 'bg-charcoal text-white hover:bg-charcoal/85')
          }
        >
          <Power className="h-4 w-4 text-amber" />
          {isOnline ? 'Online · accepting' : 'Offline · paused'}
        </button>
      }
    >
      {/* Profile strip */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-card border border-border bg-white p-4 shadow-card">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative shrink-0">
            <img src={driver.photoUrl} alt={driver.name} className="h-12 w-12 rounded-xl object-cover" />
            <span
              className={
                'absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white ' +
                (isOnline ? 'bg-status-success' : 'bg-charcoal-muted')
              }
            />
          </div>
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 text-label font-bold text-charcoal">
              {driver.name}
              <Badge tone="success">
                <ShieldCheck className="h-3 w-3" />
                Verified
              </Badge>
            </p>
            <p className="mt-0.5 truncate text-[11px] text-charcoal-secondary">
              {driver.totalTrips.toLocaleString('en-US')} lifetime trips · stage standing{' '}
              <span className="inline-flex items-center gap-0.5 font-semibold text-charcoal">
                <Star className="h-3 w-3 fill-amber text-amber" />
                {driver.rating}
              </span>
            </p>
          </div>
        </div>
        <p className="text-[11px] font-semibold text-charcoal-secondary">
          {isOnline ? (
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-status-success" />
              Radar active across Ishaka–Bushenyi
            </span>
          ) : (
            'You will not receive requests while offline.'
          )}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard
          label="Today's earnings"
          value={<Currency amount={earningsToday} showPrefix />}
          hint={`${tripsToday} trips completed`}
          trend={{ value: '+12%', direction: 'up' }}
          icon={<Wallet />}
          tone="dark"
        />
        <StatCard label="Weekly payout" value={<Currency amount={284000} showPrefix />} hint="MoMo auto-settled Monday" icon={<TrendingUp />} />
        <StatCard label="Acceptance rate" value="96.4%" hint="Top-tier stage standing" icon={<CheckCircle2 />} />
        <StatCard label="Active hours" value="5.8h" hint="Morning & lunch rush" icon={<Clock />} />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-12">
        {/* Requests */}
        <section className="xl:col-span-8">
          <div className="overflow-hidden rounded-card border border-border bg-white shadow-card">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-4 sm:px-5">
              <div>
                <h2 className="text-card text-charcoal">Incoming requests</h2>
                <p className="mt-0.5 text-[11.5px] text-charcoal-secondary">
                  {isOnline ? `${requests.length} waiting near your stage` : 'Go online to start receiving jobs'}
                </p>
              </div>
              <Badge tone={isOnline ? 'success' : 'neutral'} dot>
                {isOnline ? 'Receiving' : 'Paused'}
              </Badge>
            </div>

            {!isOnline ? (
              <div className="p-5">
                <EmptyState
                  icon={<Power className="h-6 w-6" />}
                  title="You are offline"
                  description="Switch your status to online to receive passenger and parcel requests from your stage."
                  compact
                />
              </div>
            ) : requests.length === 0 ? (
              <div className="p-5">
                <EmptyState
                  icon={<CheckCircle2 className="h-6 w-6" />}
                  title="All requests handled"
                  description="Standing by at KIU Main Gate stage for the next dispatch."
                  compact
                />
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {requests.map((request) => (
                  <li key={request.id} className="px-4 py-4 sm:px-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="numeric text-[11px] font-bold text-charcoal-muted">{request.id}</span>
                          <Badge tone={request.type === 'delivery_boda' ? 'amber' : 'sage'}>
                            {request.type === 'delivery_boda' ? (
                              <Package className="h-3 w-3" />
                            ) : (
                              <Bike className="h-3 w-3" />
                            )}
                            {request.type.replace(/_/g, ' ')}
                          </Badge>
                          <span className="text-[10.5px] text-charcoal-muted">ETA ~{request.etaMinutes} min</span>
                        </div>
                        <p className="mt-1.5 text-label font-bold text-charcoal">
                          {request.pickup} <span className="text-charcoal-muted">→</span> {request.dropoff}
                        </p>
                        <p className="mt-0.5 text-[11px] text-charcoal-secondary">
                          {request.customer} · {request.phone} · {request.distanceKm} km
                        </p>
                      </div>
                      <Currency amount={request.fareUGX} className="text-[17px] font-extrabold text-brand" />
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      <Button size="sm" onClick={() => accept(request)} className="flex-1 sm:flex-none">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Accept job
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => decline(request.id)}>
                        <X className="h-3.5 w-3.5" />
                        Decline
                      </Button>
                      <a
                        href={`tel:${request.phone.replace(/\s/g, '')}`}
                        aria-label={`Call ${request.customer}`}
                        className="ml-auto inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-border text-brand transition-colors hover:bg-ivory-soft"
                      >
                        <Phone className="h-4 w-4" />
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* Performance */}
        <div className="space-y-5 xl:col-span-4">
          <section className="rounded-card border border-border bg-white p-4 shadow-card">
            <h2 className="text-card text-charcoal">Stage performance</h2>
            <ul className="mt-3 space-y-3 text-[12px]">
              {[
                { label: 'Acceptance rate', value: 96, suffix: '%' },
                { label: 'On-time arrival', value: 98, suffix: '%' },
                { label: 'Customer rating', value: 98, suffix: '%' },
              ].map((row) => (
                <li key={row.label}>
                  <div className="flex items-center justify-between">
                    <span className="text-charcoal-secondary">{row.label}</span>
                    <span className="numeric font-bold text-charcoal">{row.value}%</span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-sage-light">
                    <div className="h-full rounded-full bg-brand" style={{ width: `${row.value}%` }} />
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-4 rounded-xl bg-ivory-soft p-3 text-[11px] leading-relaxed text-charcoal-secondary">
              Keep acceptance above 90% to stay in the priority dispatch pool for KIU and hospital trips.
            </p>
          </section>

          <section className="texture-forest rounded-card bg-brand p-4 text-white">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-amber">
              <Navigation className="h-3 w-3" />
              Next payout
            </span>
            <p className="mt-3 text-[11px] text-white/60">Monday · MTN MoMo</p>
            <Currency amount={284000} className="text-[24px] font-extrabold text-white" />
            <p className="mt-2 text-[11px] leading-relaxed text-white/60">
              Includes 6% stage commission and parcel bonuses.
            </p>
          </section>
        </div>
      </div>

      {/* Completed rides */}
      <section className="mt-5 overflow-hidden rounded-card border border-border bg-white shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-4 sm:px-5">
          <div>
            <h2 className="text-card text-charcoal">Recent completed trips</h2>
            <p className="mt-0.5 text-[11.5px] text-charcoal-secondary">Last trips dispatched through SUBURB+</p>
          </div>
          <Badge tone="neutral">{INITIAL_MOCK_RIDES.length} trips</Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left">
            <thead>
              <tr className="border-b border-border bg-ivory-soft text-[10px] font-bold uppercase tracking-[0.1em] text-charcoal-muted">
                <th scope="col" className="px-5 py-2.5">Trip</th>
                <th scope="col" className="px-3 py-2.5">Route</th>
                <th scope="col" className="px-3 py-2.5">Status</th>
                <th scope="col" className="px-5 py-2.5 text-right">Fare</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {INITIAL_MOCK_RIDES.map((ride) => (
                <tr key={ride.id} className="text-[12px]">
                  <td className="px-5 py-3">
                    <p className="numeric font-bold text-charcoal">{ride.id}</p>
                    <p className="mt-0.5 text-[10.5px] text-charcoal-muted">{ride.createdAt}</p>
                  </td>
                  <td className="px-3 py-3">
                    <p className="max-w-[240px] truncate font-semibold text-charcoal">
                      {ride.pickup} → {ride.destination}
                    </p>
                    <p className="mt-0.5 text-[10.5px] text-charcoal-muted">{ride.distanceKm} km</p>
                  </td>
                  <td className="px-3 py-3">
                    <StatusBadge status={ride.status} />
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Currency amount={ride.fareUGX} className="font-bold text-charcoal" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="flex items-center gap-1.5 border-t border-border px-5 py-3 text-[11px] text-charcoal-muted">
          <MapPin className="h-3.5 w-3.5" />
          Trips shown are demonstration records stored on this device.
        </p>
      </section>
    </DashboardShell>
  );
}
