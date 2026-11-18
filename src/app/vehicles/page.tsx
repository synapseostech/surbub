'use client';

import React, { useMemo, useState } from 'react';
import { MOCK_VEHICLE_HIRE_LISTINGS } from '@/data/mock/mobility';
import { vehicleHireService } from '@/services/vehicle-hire-service';
import type { VehicleCategory, VehicleHireListing } from '@/types/mobility';
import { Currency } from '@/components/common/Currency';
import { PageHeader } from '@/components/ui/PageHeader';
import { Chip } from '@/components/ui/Chip';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { SmartImage } from '@/components/ui/SmartImage';
import { useToast } from '@/components/ui/Toast';
import {
  Users,
  Fuel,
  Gauge,
  MapPin,
  CheckCircle2,
  MessageSquare,
  ShieldCheck,
  Send,
  Car,
  UserCheck,
  CalendarDays,
} from 'lucide-react';

const CATEGORIES: { id: 'all' | VehicleCategory; label: string }[] = [
  { id: 'all', label: 'All vehicles' },
  { id: 'saloon_car', label: 'Saloon cars' },
  { id: 'suv_4x4', label: '4x4 safari SUVs' },
  { id: 'minivan_van', label: '7–9 seat vans' },
  { id: 'pickup_truck', label: 'Double-cab pickups' },
];

export default function VehicleHirePage() {
  const { toast } = useToast();

  const [selectedCategory, setSelectedCategory] = useState<'all' | VehicleCategory>('all');
  const [activeVehicle, setActiveVehicle] = useState<VehicleHireListing | null>(null);
  const [inquiryName, setInquiryName] = useState('Brenda Kemigisha');
  const [inquiryPhone, setInquiryPhone] = useState('+256 772 341 892');
  const [startDate, setStartDate] = useState('2026-11-20');
  const [days, setDays] = useState(3);
  const [region, setRegion] = useState('Greater Bushenyi & Queen Elizabeth National Park');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const vehicles = useMemo(
    () =>
      selectedCategory === 'all'
        ? MOCK_VEHICLE_HIRE_LISTINGS
        : MOCK_VEHICLE_HIRE_LISTINGS.filter((vehicle) => vehicle.category === selectedCategory),
    [selectedCategory],
  );

  const openInquiry = (vehicle: VehicleHireListing) => {
    setActiveVehicle(vehicle);
    setSent(false);
  };

  const submitInquiry = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!activeVehicle) return;
    setSending(true);
    await vehicleHireService.createInquiry({
      vehicleId: activeVehicle.id,
      customerName: inquiryName,
      customerPhone: inquiryPhone,
      startDate,
      durationDays: days,
      estimatedCostUGX: days * activeVehicle.dailyRateUGX,
      destinationRegion: region,
    });
    setSending(false);
    setSent(true);
    toast('Rental inquiry sent', `${activeVehicle.hostName} will confirm availability by phone.`);
  };

  return (
    <div className="page-container">
      <PageHeader
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Vehicle hire' }]}
        eyebrow="Western Uganda, unlocked"
        title="Vehicle hire in Ishaka–Bushenyi"
        description="Self-drive saloons, chauffeured 4x4 safari vehicles, family vans and double-cab pickups — with clear daily rates and local hosts."
        meta={
          <>
            <Badge tone="success" dot>
              {MOCK_VEHICLE_HIRE_LISTINGS.length} vehicles
            </Badge>
            <Badge tone="neutral">Self-drive & chauffeured</Badge>
            <span className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-charcoal-secondary">
              <ShieldCheck className="h-3.5 w-3.5 text-brand" />
              Hosts verified in person
            </span>
          </>
        }
      />

      <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map((category) => (
          <Chip
            key={category.id}
            active={selectedCategory === category.id}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.label}
          </Chip>
        ))}
      </div>

      <p className="mt-4 text-label text-charcoal-secondary">
        <span className="numeric font-bold text-charcoal">{vehicles.length}</span>{' '}
        {vehicles.length === 1 ? 'vehicle' : 'vehicles'} available · rates shown per day, driver included where noted
      </p>

      <div className="mt-4 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {vehicles.map((vehicle) => {
          const whatsappLink = vehicleHireService.generateWhatsAppLink(vehicle, 'Brenda Kemigisha', 3);
          return (
            <article
              key={vehicle.id}
              className="group flex flex-col overflow-hidden rounded-card border border-border bg-white shadow-card transition-all duration-300 ease-out-premium hover:-translate-y-1 hover:border-brand/20 hover:shadow-lift"
            >
              <div className="relative">
                <SmartImage
                  src={vehicle.images[0]}
                  alt={vehicle.title}
                  ratio="aspect-[16/10]"
                  imgClassName="transition-transform duration-500 group-hover:scale-[1.03]"
                  fallbackLabel={vehicle.title}
                />
                <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
                  <Badge tone={vehicle.availability === 'Available Now' ? 'success' : vehicle.availability === 'Booked Today' ? 'error' : 'warning'}>
                    {vehicle.availability}
                  </Badge>
                  {vehicle.withDriverOnly && (
                    <Badge tone="dark">
                      <UserCheck className="h-3 w-3 text-amber" />
                      Driver included
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex flex-1 flex-col p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-card leading-snug text-charcoal">{vehicle.title}</h3>
                    <p className="mt-0.5 text-[11px] text-charcoal-secondary">
                      {vehicle.model} · {vehicle.year}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <Currency amount={vehicle.dailyRateUGX} className="text-[15px] font-extrabold text-brand" />
                    <span className="block text-[10px] font-medium text-charcoal-muted">per day</span>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-3 gap-1.5 rounded-xl bg-ivory-soft px-2.5 py-2 text-[10.5px] font-semibold text-charcoal-secondary">
                  <span className="inline-flex items-center gap-1">
                    <Users className="h-3 w-3 text-brand" />
                    {vehicle.seats} seats
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Gauge className="h-3 w-3 text-brand" />
                    {vehicle.transmission}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Fuel className="h-3 w-3 text-brand" />
                    {vehicle.fuelType}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {vehicle.features.slice(0, 3).map((feature) => (
                    <span key={feature} className="rounded-md bg-ivory px-2 py-1 text-[10px] font-semibold text-charcoal-secondary">
                      {feature}
                    </span>
                  ))}
                </div>

                <div className="mt-3 flex items-start gap-1.5 text-[10.5px] leading-snug text-charcoal-muted">
                  <MapPin className="mt-0.5 h-3 w-3 shrink-0 text-brand" />
                  <span>
                    <span className="font-semibold text-charcoal-secondary">{vehicle.location}</span> · {vehicle.hostName}
                  </span>
                </div>

                <div className="mt-auto flex items-center gap-2 border-t border-border pt-3.5">
                  <Button size="sm" onClick={() => openInquiry(vehicle)} className="flex-1">
                    <CalendarDays className="h-3.5 w-3.5" />
                    Inquire
                  </Button>
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-9 items-center justify-center gap-1.5 rounded-[10px] border border-border bg-white px-3 text-label font-semibold text-charcoal transition-colors hover:border-brand/35 hover:bg-ivory-soft"
                  >
                    <MessageSquare className="h-3.5 w-3.5 text-brand" />
                    WhatsApp
                  </a>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-8 flex flex-col items-start gap-3 rounded-card border border-border bg-sage-soft p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand text-amber">
            <Car className="h-5 w-5" />
          </span>
          <div>
            <p className="text-label font-bold text-charcoal">Need a vehicle for a bigger group or longer trip?</p>
            <p className="mt-0.5 text-[12px] leading-relaxed text-charcoal-secondary">
              Tell us the route and dates and we will match you with a local host in Bushenyi.
            </p>
          </div>
        </div>
        <Button href="/rides" variant="outline" size="sm">
          Talk to the mobility desk
        </Button>
      </div>

      {/* Inquiry modal */}
      <Modal
        open={Boolean(activeVehicle)}
        onClose={() => setActiveVehicle(null)}
        title={activeVehicle ? `Inquire about ${activeVehicle.title}` : 'Vehicle inquiry'}
        description={activeVehicle ? `${activeVehicle.hostName} · ${activeVehicle.location}` : undefined}
        footer={
          !sent && (
            <div className="flex items-center justify-between gap-3">
              <p className="text-[11px] text-charcoal-secondary">No payment is taken in this demo.</p>
              <Button type="submit" form="vehicle-inquiry-form" size="sm" loading={sending}>
                <Send className="h-3.5 w-3.5" />
                Send inquiry
              </Button>
            </div>
          )
        }
      >
        {sent ? (
          <div className="flex flex-col items-center py-6 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-status-successSoft text-status-success">
              <CheckCircle2 className="h-6 w-6" />
            </span>
            <h4 className="mt-3 text-card text-charcoal">Inquiry received</h4>
            <p className="mt-1 max-w-sm text-label leading-relaxed text-charcoal-secondary">
              {activeVehicle?.hostName} will confirm availability and the final rate for {days} day{days > 1 ? 's' : ''}.
            </p>
          </div>
        ) : (
          <form id="vehicle-inquiry-form" onSubmit={submitInquiry} className="space-y-4">
            {activeVehicle && (
              <div className="flex items-center gap-3 rounded-xl border border-border bg-ivory-soft p-3">
                <SmartImage
                  src={activeVehicle.images[0]}
                  alt={activeVehicle.title}
                  ratio="aspect-[4/3]"
                  className="w-20 shrink-0 rounded-lg"
                />
                <div className="min-w-0">
                  <p className="truncate text-label font-bold text-charcoal">{activeVehicle.title}</p>
                  <p className="mt-0.5 text-[11px] text-charcoal-secondary">
                    {activeVehicle.seats} seats · {activeVehicle.transmission} · {activeVehicle.fuelType}
                  </p>
                  <p className="mt-1 text-[11px] font-semibold text-brand">
                    <Currency amount={activeVehicle.dailyRateUGX} /> per day
                  </p>
                </div>
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="vehicle-name" className="mb-1.5 block text-label font-bold text-charcoal">
                  Full name
                </label>
                <input
                  id="vehicle-name"
                  type="text"
                  value={inquiryName}
                  onChange={(event) => setInquiryName(event.target.value)}
                  required
                  className="field"
                />
              </div>
              <div>
                <label htmlFor="vehicle-phone" className="mb-1.5 block text-label font-bold text-charcoal">
                  Phone number
                </label>
                <input
                  id="vehicle-phone"
                  type="tel"
                  value={inquiryPhone}
                  onChange={(event) => setInquiryPhone(event.target.value)}
                  required
                  className="field"
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="vehicle-date" className="mb-1.5 block text-label font-bold text-charcoal">
                  Pick-up date
                </label>
                <input
                  id="vehicle-date"
                  type="date"
                  value={startDate}
                  onChange={(event) => setStartDate(event.target.value)}
                  required
                  className="field font-semibold"
                />
              </div>
              <div>
                <label htmlFor="vehicle-days" className="mb-1.5 block text-label font-bold text-charcoal">
                  Duration (days)
                </label>
                <input
                  id="vehicle-days"
                  type="number"
                  min={1}
                  max={30}
                  value={days}
                  onChange={(event) => setDays(Math.min(30, Math.max(1, Number(event.target.value) || 1)))}
                  required
                  className="field font-semibold"
                />
              </div>
            </div>

            <div>
              <label htmlFor="vehicle-region" className="mb-1.5 block text-label font-bold text-charcoal">
                Planned route / destination
              </label>
              <input
                id="vehicle-region"
                type="text"
                value={region}
                onChange={(event) => setRegion(event.target.value)}
                required
                className="field"
              />
            </div>

            <div className="flex items-center justify-between rounded-xl border border-border bg-ivory-soft px-3.5 py-3">
              <span className="text-label font-semibold text-charcoal-secondary">
                Estimated total · {days} day{days > 1 ? 's' : ''}
              </span>
              <Currency
                amount={activeVehicle ? days * activeVehicle.dailyRateUGX : 0}
                className="text-[16px] font-extrabold text-brand"
              />
            </div>

            <p className="text-[11px] leading-relaxed text-charcoal-secondary">
              Fuel, driver allowance and cross-district fees are agreed directly with the host. SUBURB+ does not take
              payment for vehicle hire in this preview.
            </p>
          </form>
        )}
      </Modal>
    </div>
  );
}
