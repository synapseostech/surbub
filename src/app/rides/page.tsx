'use client';

import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { MOCK_DRIVERS, MOCK_RIDE_OPTIONS, POPULAR_LOCATIONS } from '@/data/mock/mobility';
import { rideService } from '@/services/ride-service';
import type { RideRequest, RideType } from '@/types/mobility';
import { Currency } from '@/components/common/Currency';
import { StatusBadge } from '@/components/common/StatusBadge';
import { PageHeader } from '@/components/ui/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useToast } from '@/components/ui/Toast';
import {
  Bike,
  Package,
  Users,
  Car,
  Navigation,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  Star,
  CheckCircle2,
  History,
  ArrowUpDown,
} from 'lucide-react';

const RIDE_ICONS: Record<RideType, React.ElementType> = {
  boda: Bike,
  delivery_boda: Package,
  matatu_shared: Users,
  special_hire: Car,
};

function RidesContent() {
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [pickup, setPickup] = useState(searchParams.get('pickup') || POPULAR_LOCATIONS[0]);
  const [destination, setDestination] = useState(searchParams.get('destination') || POPULAR_LOCATIONS[2]);
  const [rideType, setRideType] = useState<RideType>((searchParams.get('type') as RideType) || 'boda');
  const [ridesList, setRidesList] = useState<RideRequest[]>([]);

  const [simulationOpen, setSimulationOpen] = useState(false);
  const [currentRide, setCurrentRide] = useState<RideRequest | null>(null);
  const [stage, setStage] = useState<'assigning' | 'arriving' | 'in_transit' | 'completed'>('assigning');
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    rideService.getAllRides().then(setRidesList);
  }, []);

  const estimate = useMemo(
    () => rideService.calculateEstimate(pickup, destination, rideType),
    [pickup, destination, rideType],
  );

  const swap = () => {
    setPickup(destination);
    setDestination(pickup);
  };

  const requestRide = async () => {
    setRequesting(true);
    setSimulationOpen(true);
    setStage('assigning');
    const ride = await rideService.requestRide({
      customerId: 'user_cust_01',
      customerName: 'Brenda Kemigisha',
      customerPhone: '+256 772 341 892',
      rideType,
      pickup,
      destination,
    });
    setCurrentRide(ride);
    setRequesting(false);
    window.setTimeout(() => setStage('arriving'), 1800);
  };

  const advance = () => {
    if (stage === 'arriving') {
      setStage('in_transit');
    } else if (stage === 'in_transit') {
      setStage('completed');
      rideService.getAllRides().then(setRidesList);
      toast('Trip completed', 'Your simulated fare has been logged in ride history.');
    }
  };

  const selectedOption = MOCK_RIDE_OPTIONS.find((option) => option.type === rideType)!;

  return (
    <div className="page-container">
      <PageHeader
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Rides' }]}
        eyebrow="Mobility, fare first"
        title="Where are you going today?"
        description="Choose your pickup stage and destination to see the fare before you ride. Boda, parcel, matatu or private hire across Greater Ishaka–Bushenyi."
        meta={
          <>
            <Badge tone="success" dot>
              Vetted stage riders
            </Badge>
            <span className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-charcoal-secondary">
              <ShieldCheck className="h-3.5 w-3.5 text-brand" />
              Transparent simulated fares · no live GPS
            </span>
          </>
        }
      />

      <div className="grid gap-5 lg:grid-cols-12">
        {/* Estimator */}
        <section aria-label="Ride fare estimator" className="lg:col-span-7">
          <div className="rounded-card-lg border border-border bg-white p-4 shadow-card sm:p-6">
            <div className="flex items-center justify-between gap-3 border-b border-border pb-4">
              <h2 className="flex items-center gap-2 text-card text-charcoal">
                <Navigation className="h-4 w-4 text-brand" />
                Plan your trip
              </h2>
              <Badge tone="neutral">Greater Bushenyi network</Badge>
            </div>

            {/* Locations */}
            <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
              <div>
                <label htmlFor="ride-pickup" className="mb-1.5 flex items-center gap-1.5 text-label font-bold text-charcoal">
                  <span className="h-2 w-2 rounded-full bg-brand" aria-hidden="true" />
                  Pickup stage
                </label>
                <select
                  id="ride-pickup"
                  value={pickup}
                  onChange={(event) => setPickup(event.target.value)}
                  className="field h-11 font-semibold"
                >
                  {POPULAR_LOCATIONS.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={swap}
                aria-label="Swap pickup and destination"
                className="mb-0.5 hidden h-11 w-11 items-center justify-center rounded-xl border border-border bg-ivory text-brand transition-colors hover:bg-sage-light sm:flex"
              >
                <ArrowUpDown className="h-4 w-4" />
              </button>

              <div>
                <label htmlFor="ride-destination" className="mb-1.5 flex items-center gap-1.5 text-label font-bold text-charcoal">
                  <span className="h-2 w-2 rounded-sm bg-amber" aria-hidden="true" />
                  Destination
                </label>
                <select
                  id="ride-destination"
                  value={destination}
                  onChange={(event) => setDestination(event.target.value)}
                  className="field h-11 font-semibold"
                >
                  {POPULAR_LOCATIONS.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Ride types */}
            <fieldset className="mt-5">
              <legend className="mb-2 text-label font-bold text-charcoal">Choose a ride</legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {MOCK_RIDE_OPTIONS.map((option) => {
                  const Icon = RIDE_ICONS[option.type];
                  const active = option.type === rideType;
                  return (
                    <button
                      key={option.type}
                      type="button"
                      onClick={() => setRideType(option.type)}
                      aria-pressed={active}
                      className={
                        'flex items-start gap-3 rounded-xl border p-3 text-left transition-all duration-200 ' +
                        (active
                          ? 'border-brand bg-sage-soft ring-1 ring-brand/15'
                          : 'border-border bg-white hover:border-brand/25 hover:bg-ivory-soft')
                      }
                    >
                      <span
                        className={
                          'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ' +
                          (active ? 'bg-brand text-amber' : 'bg-ivory text-brand')
                        }
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center justify-between gap-2">
                          <span className="truncate text-[12.5px] font-bold text-charcoal">{option.title}</span>
                          <span className="numeric shrink-0 text-[10px] font-bold text-brand">
                            {option.etaMinutes} min
                          </span>
                        </span>
                        <span className="mt-0.5 line-clamp-1 block text-[10.5px] text-charcoal-secondary">
                          {option.capacity}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            {/* Estimate */}
            <div className="mt-5 rounded-xl bg-ivory-soft p-4">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-charcoal-muted">Distance</p>
                  <p className="numeric mt-1 text-[15px] font-extrabold text-charcoal">{estimate.distanceKm} km</p>
                </div>
                <div className="border-x border-border">
                  <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-charcoal-muted">Journey</p>
                  <p className="numeric mt-1 text-[15px] font-extrabold text-charcoal">~{estimate.durationMinutes} min</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-charcoal-muted">Ride</p>
                  <p className="mt-1 line-clamp-2 text-[11.5px] font-extrabold leading-tight text-charcoal sm:text-[13px]">{selectedOption.title}</p>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                <div>
                  <p className="text-[10.5px] text-charcoal-secondary">
                    UGX {estimate.baseFareUGX.toLocaleString('en-US')} base +{' '}
                    <Currency amount={estimate.distanceFareUGX} showPrefix={false} /> distance
                  </p>
                  <p className="mt-0.5 text-[10px] text-charcoal-muted">Simulated fare estimate, not a live quote.</p>
                </div>
                <Currency amount={estimate.totalFareUGX} className="text-[21px] font-extrabold text-brand" />
              </div>
            </div>

            <Button onClick={requestRide} loading={requesting} fullWidth size="lg" className="mt-4">
              Request a {selectedOption.title.toLowerCase()}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </section>

        {/* Context panel */}
        <aside className="space-y-5 lg:col-span-5">
          <div className="texture-forest relative overflow-hidden rounded-card-lg bg-brand p-5 text-white">
            <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-amber">
              Fare model
            </span>
            <h2 className="max-w-[15ch] text-[24px] font-extrabold leading-[1.1] tracking-[-0.03em]">
              The whole town, a fare away.
            </h2>
            <p className="mt-2 max-w-[34ch] text-[12.5px] leading-relaxed text-white/65">
              Boda 500 + 450/km. Parcel 800 + 500/km. Special hire 5,000 + 2,000/km. No surge, no surprises.
            </p>

            <ul className="mt-4 space-y-2 text-[12px] text-white/80">
              {[
                'Helmet and parcel straps on every bike',
                'Riders assigned from a known local stage',
                'Cash or Mobile Money at the end of the trip',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-5 flex items-center gap-3 rounded-xl border border-white/10 bg-brand-deep/40 p-3">
              <img
                src={MOCK_DRIVERS[0].photoUrl}
                alt={MOCK_DRIVERS[0].name}
                className="h-11 w-11 rounded-full border border-white/20 object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[12.5px] font-bold">{MOCK_DRIVERS[0].name}</p>
                <p className="truncate text-[10.5px] text-white/55">{MOCK_DRIVERS[0].plateNumber}</p>
              </div>
              <span className="inline-flex items-center gap-1 text-[11.5px] font-bold text-amber">
                <Star className="h-3 w-3 fill-amber" />
                {MOCK_DRIVERS[0].rating}
              </span>
            </div>
          </div>

          <div className="rounded-card border border-border bg-white p-4 shadow-card">
            <h3 className="flex items-center gap-2 text-label font-bold text-charcoal">
              <MapPin className="h-4 w-4 text-brand" />
              Frequent Ishaka stages
            </h3>
            <ul className="mt-2 divide-y divide-border text-[12px]">
              {POPULAR_LOCATIONS.slice(0, 5).map((location) => (
                <li key={location} className="flex items-center justify-between gap-3 py-2">
                  <button
                    type="button"
                    onClick={() => setDestination(location)}
                    className="truncate text-left text-charcoal-secondary transition-colors hover:text-brand"
                  >
                    {location}
                  </button>
                  <span className="shrink-0 text-[10px] font-semibold text-status-success">Stage ready</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      {/* Ride log */}
      <section className="mt-11">
        <SectionHeading
          eyebrow="Your trips"
          title="Ride history"
          description="Trips you request in this demo are saved on this device so you can reopen them during a walkthrough."
          action={{ label: 'Hire a vehicle instead', href: '/vehicles' }}
        />

        {ridesList.length === 0 ? (
          <div className="rounded-card border border-dashed border-border bg-ivory-soft px-6 py-12 text-center">
            <History className="mx-auto h-6 w-6 text-brand/50" />
            <h3 className="mt-3 text-card text-charcoal">No trips yet</h3>
            <p className="mt-1 text-label text-charcoal-secondary">Request your first ride above to see it logged here.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-card border border-border bg-white shadow-card">
            <div className="hidden grid-cols-[1.4fr_1fr_0.7fr_0.7fr] gap-4 border-b border-border bg-ivory-soft px-5 py-3 text-[10px] font-bold uppercase tracking-[0.1em] text-charcoal-muted sm:grid">
              <span>Trip</span>
              <span>Route</span>
              <span>Status</span>
              <span className="text-right">Fare</span>
            </div>
            <ul className="divide-y divide-border">
              {ridesList.map((ride) => (
                <li
                  key={ride.id}
                  className="grid gap-2 px-4 py-3.5 sm:grid-cols-[1.4fr_1fr_0.7fr_0.7fr] sm:items-center sm:gap-4 sm:px-5"
                >
                  <div className="min-w-0">
                    <p className="numeric text-[12px] font-bold text-charcoal">{ride.id}</p>
                    <p className="mt-0.5 flex items-center gap-1.5 text-[10.5px] text-charcoal-muted">
                      <Clock className="h-3 w-3" />
                      {ride.createdAt}
                    </p>
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-[12px] font-semibold text-charcoal">
                      {ride.pickup} <span className="text-charcoal-muted">→</span> {ride.destination}
                    </p>
                    <p className="mt-0.5 text-[10.5px] text-charcoal-muted">
                      {ride.rideType.replace(/_/g, ' ')} · {ride.distanceKm} km
                      {ride.assignedDriver ? ` · ${ride.assignedDriver.name}` : ''}
                    </p>
                  </div>
                  <div>
                    <StatusBadge status={ride.status} />
                  </div>
                  <div className="sm:text-right">
                    <Currency amount={ride.fareUGX} className="text-[13px] font-extrabold text-brand" />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* Simulation modal */}
      <Modal
        open={simulationOpen}
        onClose={() => setSimulationOpen(false)}
        title="Ride dispatch simulation"
        description={`${pickup} → ${destination}`}
        footer={
          stage === 'completed' ? (
            <Button fullWidth onClick={() => setSimulationOpen(false)}>
              Close and return
            </Button>
          ) : (
            <Button fullWidth variant="amber" onClick={advance}>
              <Navigation className="h-4 w-4" />
              {stage === 'assigning' ? 'Assign rider' : stage === 'arriving' ? 'Start trip' : 'Complete trip'}
            </Button>
          )
        }
      >
        <div className="text-center">
          <span
            className={
              'mx-auto flex h-14 w-14 items-center justify-center rounded-full ' +
              (stage === 'completed'
                ? 'bg-status-successSoft text-status-success'
                : stage === 'in_transit'
                  ? 'bg-sage text-brand'
                  : 'bg-amber-wash text-[#8A5A12]')
            }
          >
            {stage === 'completed' ? (
              <CheckCircle2 className="h-7 w-7" />
            ) : stage === 'in_transit' ? (
              <Navigation className="h-7 w-7" />
            ) : (
              <Bike className="h-7 w-7" />
            )}
          </span>

          <p className="mt-3 text-card text-charcoal">
            {stage === 'assigning' && 'Contacting nearby stage riders…'}
            {stage === 'arriving' && `${MOCK_DRIVERS[0].name} is on the way`}
            {stage === 'in_transit' && 'Trip in progress'}
            {stage === 'completed' && 'You have arrived'}
          </p>
          <p className="mt-1 text-label text-charcoal-secondary">
            {stage === 'assigning' && `Searching within 2 km of ${pickup}.`}
            {stage === 'arriving' && 'Arriving in about 3 minutes with a spare helmet.'}
            {stage === 'in_transit' && `En route to ${destination}.`}
            {stage === 'completed' && `Fare settled at ${destination}.`}
          </p>

          <div className="mt-4 flex items-center gap-3 rounded-xl border border-border bg-ivory-soft p-3 text-left">
            <img
              src={MOCK_DRIVERS[0].photoUrl}
              alt={MOCK_DRIVERS[0].name}
              className="h-11 w-11 rounded-full object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12.5px] font-bold text-charcoal">{MOCK_DRIVERS[0].name}</p>
              <p className="truncate text-[10.5px] text-charcoal-muted">{MOCK_DRIVERS[0].plateNumber}</p>
            </div>
            <div className="text-right">
              <Currency amount={estimate.totalFareUGX} className="text-[13px] font-extrabold text-brand" />
              <span className="block text-[10px] text-charcoal-muted">Cash / MoMo</span>
            </div>
          </div>

          <p className="mt-3 text-[10.5px] leading-relaxed text-charcoal-muted">
            This is a client-side demonstration. No rider is actually dispatched and no payment is taken.
          </p>
        </div>
      </Modal>
    </div>
  );
}

export default function RidesPage() {
  return (
    <Suspense
      fallback={
        <div className="page-container py-10">
          <div className="h-8 w-64 rounded-lg bg-sage-soft skeleton" />
          <div className="mt-6 grid gap-5 lg:grid-cols-12">
            <div className="h-[480px] rounded-card-lg bg-white skeleton lg:col-span-7" />
            <div className="h-[320px] rounded-card-lg bg-white skeleton lg:col-span-5" />
          </div>
        </div>
      }
    >
      <RidesContent />
    </Suspense>
  );
}
