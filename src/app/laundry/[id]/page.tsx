'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { MOCK_LAUNDRY_PROVIDERS } from '@/data/mock/laundry';
import { laundryService } from '@/services/laundry-service';
import { Currency } from '@/components/common/Currency';
import { PageHeader } from '@/components/ui/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { SmartImage } from '@/components/ui/SmartImage';
import { useToast } from '@/components/ui/Toast';
import {
  ArrowLeft,
  Shirt,
  Truck,
  Clock,
  MapPin,
  Phone,
  CheckCircle2,
  Plus,
  Minus,
  Star,
  ShieldCheck,
  Calendar,
} from 'lucide-react';

export default function LaundryBookingPage() {
  const params = useParams();
  const id = params?.id as string;
  const provider = MOCK_LAUNDRY_PROVIDERS.find((item) => item.id === id) || MOCK_LAUNDRY_PROVIDERS[0];
  const { toast } = useToast();

  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [customerName, setCustomerName] = useState('Brenda Kemigisha');
  const [customerPhone, setCustomerPhone] = useState('+256 772 341 892');
  const [pickupAddress, setPickupAddress] = useState('Room 14, Block C, KIU Girls Hostel, Ishaka');
  const [pickupDate, setPickupDate] = useState('2026-11-19');
  const [pickupTimeSlot, setPickupTimeSlot] = useState('10:00 AM - 12:00 PM');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBookingId, setConfirmedBookingId] = useState<string | null>(null);

  const changeQuantity = (serviceId: string, delta: number) => {
    setQuantities((previous) => ({
      ...previous,
      [serviceId]: Math.max(0, (previous[serviceId] || 0) + delta),
    }));
  };

  const selectedItems = provider.services
    .filter((service) => (quantities[service.id] || 0) > 0)
    .map((service) => {
      const quantity = quantities[service.id];
      return {
        serviceItemId: service.id,
        name: service.name,
        quantity,
        estimatedPriceUGX: quantity * service.pricePerUnitUGX,
      };
    });

  const servicesSubtotal = selectedItems.reduce((sum, item) => sum + item.estimatedPriceUGX, 0);
  const freePickupThreshold = provider.offersFreePickupAbove || 35000;
  const pickupFee = servicesSubtotal >= freePickupThreshold || servicesSubtotal === 0 ? 0 : provider.pickupFeeUGX;
  const estimatedTotal = servicesSubtotal + pickupFee;

  const submitBooking = async (event: React.FormEvent) => {
    event.preventDefault();
    if (selectedItems.length === 0) {
      toast('Add at least one service', 'Choose the garments or kilos you would like collected.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const booking = await laundryService.createBooking({
        customerId: 'user_cust_01',
        customerName,
        customerPhone,
        providerId: provider.id,
        providerName: provider.name,
        items: selectedItems,
        pickupAddress,
        pickupDate,
        pickupTimeSlot,
        specialInstructions,
        estimatedTotalUGX: estimatedTotal,
      });
      setConfirmedBookingId(booking.id);
      toast('Pickup scheduled', `${provider.name} will collect on ${pickupDate}.`);
    } catch {
      toast('Booking failed', 'Please check your details and try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (confirmedBookingId) {
    return (
      <div className="page-container">
        <div className="mx-auto max-w-xl py-12">
          <div className="overflow-hidden rounded-card-lg border border-border bg-white shadow-card">
            <div className="pattern-sage flex flex-col items-center border-b border-border bg-sage-soft px-6 py-9 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand text-amber">
                <CheckCircle2 className="h-7 w-7" />
              </span>
              <Badge tone="success" className="mt-4">
                Pickup scheduled
              </Badge>
              <h1 className="mt-3 text-h2 text-charcoal">Your laundry is booked</h1>
              <p className="mt-1.5 text-label text-charcoal-secondary">
                Booking reference <span className="numeric font-bold text-charcoal">{confirmedBookingId}</span>
              </p>
            </div>

            <div className="space-y-3 p-5">
              {[
                { label: 'Provider', value: provider.name },
                { label: 'Pickup window', value: `${pickupDate} · ${pickupTimeSlot}` },
                { label: 'Pickup address', value: pickupAddress },
                { label: 'Items', value: selectedItems.map((item) => `${item.quantity}× ${item.name}`).join(', ') },
              ].map((row) => (
                <div key={row.label} className="flex items-start justify-between gap-4 text-[12.5px]">
                  <span className="shrink-0 text-charcoal-secondary">{row.label}</span>
                  <span className="text-right font-semibold text-charcoal">{row.value}</span>
                </div>
              ))}
              <div className="flex items-center justify-between border-t border-border pt-3">
                <span className="text-label font-semibold text-charcoal-secondary">Estimated total</span>
                <Currency amount={estimatedTotal} className="text-[17px] font-extrabold text-brand" />
              </div>
              <p className="rounded-xl bg-ivory-soft p-3 text-[11.5px] leading-relaxed text-charcoal-secondary">
                Pay on delivery by cash or Mobile Money. Final weight is verified at intake and shared with you
                before washing.
              </p>
              <div className="flex flex-col gap-2 pt-1 sm:flex-row">
                <Button href="/account?tab=laundry" variant="outline" fullWidth>
                  Track in my bookings
                </Button>
                <Button href="/laundry" fullWidth>
                  Back to laundry
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="pt-6">
        <Link
          href="/laundry"
          className="inline-flex items-center gap-1.5 text-label font-semibold text-charcoal-secondary transition-colors hover:text-brand"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All providers
        </Link>
      </div>

      <PageHeader
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Laundry', href: '/laundry' }, { label: provider.name }]}
        eyebrow={provider.location.neighborhood}
        title={provider.name}
        description={provider.tagline}
        meta={
          <>
            <Badge tone="success" dot>
              Verified provider
            </Badge>
            <span className="inline-flex items-center gap-1.5 text-[11.5px] font-bold text-charcoal">
              <Star className="h-3.5 w-3.5 fill-amber text-amber" />
              {provider.rating.toFixed(1)}
              <span className="font-medium text-charcoal-secondary">({provider.reviewCount} reviews)</span>
            </span>
            <span className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-charcoal-secondary">
              <Clock className="h-3.5 w-3.5 text-brand" />
              {provider.turnaroundHoursStandard}h standard
            </span>
            <span className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-charcoal-secondary">
              <MapPin className="h-3.5 w-3.5 text-brand" />
              {provider.location.address}
            </span>
          </>
        }
        actions={
          <Button href={`tel:${provider.phone}`} variant="outline" size="md">
            <Phone className="h-4 w-4 text-brand" />
            Call provider
          </Button>
        }
      />

      <form onSubmit={submitBooking} className="grid gap-6 lg:grid-cols-12">
        {/* Services */}
        <div className="lg:col-span-7">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-micro uppercase text-brand-secondary">Step one</p>
              <h2 className="mt-1 text-h2 text-charcoal">Choose your services</h2>
            </div>
            <Badge tone="neutral">{provider.services.length} packages</Badge>
          </div>

          <div className="mt-4 space-y-3">
            {provider.services.map((service) => {
              const quantity = quantities[service.id] || 0;
              return (
                <article
                  key={service.id}
                  className={
                    'flex gap-3 rounded-card border bg-white p-3.5 shadow-card transition-all duration-200 sm:items-center sm:p-4 ' +
                    (quantity > 0 ? 'border-brand/40 ring-1 ring-brand/10' : 'border-border hover:border-brand/20')
                  }
                >
                  {service.image ? (
                    <SmartImage
                      src={service.image}
                      alt={service.name}
                      ratio="aspect-square"
                      className="hidden w-20 shrink-0 rounded-xl border border-border sm:block"
                    />
                  ) : (
                    <span className="hidden h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-sage-light text-brand sm:flex">
                      <Shirt className="h-6 w-6" />
                    </span>
                  )}

                  <div className="min-w-0 flex-1">
                    <h3 className="text-[13.5px] font-bold leading-snug text-charcoal">{service.name}</h3>
                    <p className="mt-1 line-clamp-2 text-[11.5px] leading-relaxed text-charcoal-secondary">
                      {service.description}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="inline-flex items-baseline gap-1">
                        <Currency amount={service.pricePerUnitUGX} className="text-[13px] font-extrabold text-brand" />
                        <span className="text-[10.5px] text-charcoal-muted">/ {service.unit}</span>
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-charcoal-muted">
                        <Clock className="h-3 w-3" />
                        {service.turnaroundTime}
                      </span>
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-col items-end gap-1.5">
                    <div className="inline-flex items-center gap-1 rounded-xl border border-border bg-ivory p-1">
                      <button
                        type="button"
                        onClick={() => changeQuantity(service.id, -1)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-charcoal shadow-sm transition-colors hover:bg-sage-light"
                        aria-label={`Reduce ${service.name}`}
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="numeric w-6 text-center text-[12px] font-bold text-charcoal">{quantity}</span>
                      <button
                        type="button"
                        onClick={() => changeQuantity(service.id, 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-charcoal shadow-sm transition-colors hover:bg-sage-light"
                        aria-label={`Add ${service.name}`}
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    {quantity > 0 && (
                      <span className="numeric text-[10.5px] font-bold text-brand">
                        <Currency amount={quantity * service.pricePerUnitUGX} />
                      </span>
                    )}
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-4 flex items-start gap-2 rounded-card border border-border bg-sage-soft p-4">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
            <p className="text-[11.5px] leading-relaxed text-charcoal-secondary">
              Free pickup above <Currency amount={freePickupThreshold} className="font-bold text-charcoal" />. Prices are
              estimates until your bag is weighed at collection.
            </p>
          </div>
        </div>

        {/* Pickup details */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-24">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-micro uppercase text-brand-secondary">Step two</p>
                <h2 className="mt-1 text-h2 text-charcoal">Pickup details</h2>
              </div>
              <Truck className="h-5 w-5 text-brand" />
            </div>

            <div className="mt-4 space-y-3.5 rounded-card border border-border bg-white p-4 shadow-card sm:p-5">
              <div>
                <label htmlFor="laundry-name" className="mb-1.5 block text-label font-bold text-charcoal">
                  Full name
                </label>
                <input
                  id="laundry-name"
                  type="text"
                  value={customerName}
                  onChange={(event) => setCustomerName(event.target.value)}
                  required
                  className="field"
                />
              </div>

              <div>
                <label htmlFor="laundry-phone" className="mb-1.5 block text-label font-bold text-charcoal">
                  Phone number
                </label>
                <input
                  id="laundry-phone"
                  type="tel"
                  value={customerPhone}
                  onChange={(event) => setCustomerPhone(event.target.value)}
                  required
                  className="field"
                />
              </div>

              <div>
                <label htmlFor="laundry-address" className="mb-1.5 block text-label font-bold text-charcoal">
                  Pickup address / hostel & room
                </label>
                <input
                  id="laundry-address"
                  type="text"
                  value={pickupAddress}
                  onChange={(event) => setPickupAddress(event.target.value)}
                  required
                  className="field"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="laundry-date" className="mb-1.5 block text-label font-bold text-charcoal">
                    Pickup date
                  </label>
                  <input
                    id="laundry-date"
                    type="date"
                    value={pickupDate}
                    onChange={(event) => setPickupDate(event.target.value)}
                    required
                    className="field font-semibold"
                  />
                </div>
                <div>
                  <label htmlFor="laundry-slot" className="mb-1.5 block text-label font-bold text-charcoal">
                    Time window
                  </label>
                  <select
                    id="laundry-slot"
                    value={pickupTimeSlot}
                    onChange={(event) => setPickupTimeSlot(event.target.value)}
                    className="field font-semibold"
                  >
                    <option value="08:00 AM - 10:00 AM">08:00 – 10:00</option>
                    <option value="10:00 AM - 12:00 PM">10:00 – 12:00</option>
                    <option value="02:00 PM - 04:00 PM">14:00 – 16:00</option>
                    <option value="04:00 PM - 06:00 PM">16:00 – 18:00</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="laundry-notes" className="mb-1.5 block text-label font-bold text-charcoal">
                  Care instructions <span className="font-medium text-charcoal-muted">(optional)</span>
                </label>
                <input
                  id="laundry-notes"
                  type="text"
                  value={specialInstructions}
                  onChange={(event) => setSpecialInstructions(event.target.value)}
                  placeholder="e.g. wash whites separately, no bleach"
                  className="field"
                />
              </div>

              <div className="space-y-2 border-t border-border pt-3.5 text-[12px] text-charcoal-secondary">
                <div className="flex justify-between">
                  <span>Selected services</span>
                  <Currency amount={servicesSubtotal} className="font-semibold text-charcoal" />
                </div>
                <div className="flex justify-between">
                  <span>Doorstep pickup</span>
                  <span className="font-semibold text-charcoal">
                    {pickupFee === 0 ? 'Free' : <Currency amount={pickupFee} />}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-border pt-2.5">
                  <span className="text-label font-bold text-charcoal">Estimated total</span>
                  <Currency amount={estimatedTotal} className="text-[17px] font-extrabold text-brand" />
                </div>
              </div>

              <Button type="submit" fullWidth size="lg" loading={isSubmitting} disabled={selectedItems.length === 0}>
                <Calendar className="h-4 w-4" />
                Confirm pickup
              </Button>
              <p className="text-center text-[10.5px] leading-relaxed text-charcoal-muted">
                Cash or Mobile Money on delivery · weights verified at intake
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
