'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useLocation } from '@/context/LocationContext';
import { orderService } from '@/services/order-service';
import type { PaymentMethod } from '@/types/order';
import { Currency } from '@/components/common/Currency';
import { PageHeader } from '@/components/ui/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { SmartImage } from '@/components/ui/SmartImage';
import { useToast } from '@/components/ui/Toast';
import {
  ShieldCheck,
  MapPin,
  User,
  Smartphone,
  Banknote,
  ShoppingBag,
  AlertCircle,
  Store,
  ArrowLeft,
  Clock,
} from 'lucide-react';

const PAYMENT_METHODS: { id: PaymentMethod; label: string; hint: string; icon: React.ElementType; badge?: string }[] = [
  { id: 'mtn_momo', label: 'MTN Mobile Money', hint: '*165# instant prompt', icon: Smartphone, badge: 'MoMo' },
  { id: 'airtel_money', label: 'Airtel Money', hint: '*185# instant prompt', icon: Smartphone, badge: 'Airtel' },
  { id: 'cash_on_delivery', label: 'Cash on delivery', hint: 'Pay the rider on arrival', icon: Banknote },
  { id: 'cash_pickup', label: 'Self pickup at the kitchen', hint: 'No delivery fee', icon: Store },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotalUGX, deliveryFeeUGX, serviceFeeUGX, totalUGX, merchantName, merchantId, clearCart } = useCart();
  const { user } = useAuth();
  const { selectedLocation, allLocations } = useLocation();
  const { toast } = useToast();

  const [customerName, setCustomerName] = useState(user.name || 'Brenda Kemigisha');
  const [customerPhone, setCustomerPhone] = useState(user.phone || '+256 772 341 892');
  const [deliveryAddress, setDeliveryAddress] = useState(user.location || 'KIU Hostels, Block C Room 14, Ishaka');
  const [neighbourhood, setNeighbourhood] = useState(selectedLocation.name);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('mtn_momo');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (items.length === 0) {
    return (
      <div className="page-container">
        <div className="mx-auto max-w-lg py-16">
          <div className="rounded-card-lg border border-border bg-white p-8 text-center shadow-card">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-sage-light text-brand">
              <ShoppingBag className="h-7 w-7" />
            </span>
            <h1 className="mt-4 text-h2 text-charcoal">Your cart is empty</h1>
            <p className="mt-1.5 text-label leading-relaxed text-charcoal-secondary">
              Add something from a local kitchen before heading to checkout.
            </p>
            <Button href="/restaurants" size="lg" fullWidth className="mt-5">
              Explore restaurants
            </Button>
            <Link href="/" className="mt-3 inline-block text-label font-semibold text-charcoal-secondary hover:text-brand">
              Back to home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const placeOrder = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage('');

    if (!customerName.trim()) {
      setErrorMessage('Please provide the recipient name.');
      return;
    }
    if (!customerPhone.trim() || customerPhone.replace(/\D/g, '').length < 9) {
      setErrorMessage('Enter a valid Ugandan phone number, e.g. +256 772 123 456.');
      return;
    }
    if (!deliveryAddress.trim()) {
      setErrorMessage('Add a landmark, hostel or door number for the rider.');
      return;
    }

    setIsSubmitting(true);
    try {
      const order = await orderService.createOrder({
        customerId: user.id || 'user_cust_01',
        customerName,
        customerPhone,
        merchantId: merchantId || 'rest_01',
        merchantName: merchantName || 'SUBURB+ local merchant',
        items,
        subtotalUGX,
        deliveryFeeUGX,
        serviceFeeUGX,
        totalUGX,
        deliveryAddress,
        deliveryNeighborhood: neighbourhood,
        specialInstructions,
        paymentMethod,
      });

      clearCart();
      toast('Order placed', 'Your kitchen has received the ticket.');
      router.push(`/checkout/success?orderId=${order.id}`);
    } catch {
      setErrorMessage('We could not place the demo order. Please try again.');
      setIsSubmitting(false);
    }
  };

  const payableDelivery = paymentMethod === 'cash_pickup' ? 0 : deliveryFeeUGX;
  const payableTotal = paymentMethod === 'cash_pickup' ? subtotalUGX + serviceFeeUGX : totalUGX;

  return (
    <div className="page-container">
      <div className="pt-6">
        <Link
          href="/restaurants"
          className="inline-flex items-center gap-1.5 text-label font-semibold text-charcoal-secondary transition-colors hover:text-brand"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to shopping
        </Link>
      </div>

      <PageHeader
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Cart', href: '/restaurants' }, { label: 'Checkout' }]}
        eyebrow={merchantName ? `Ordering from ${merchantName}` : 'Checkout'}
        title="Delivery & payment"
        description="Confirm where the rider should meet you and how you would like to pay. This is a simulated checkout — no money is taken."
        meta={
          <>
            <Badge tone="success" dot>
              Secure demo checkout
            </Badge>
            <span className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-charcoal-secondary">
              <Clock className="h-3.5 w-3.5 text-brand" />
              Delivering to {neighbourhood}
            </span>
          </>
        }
      />

      {errorMessage && (
        <div
          role="alert"
          className="mb-5 flex items-start gap-2 rounded-card border border-status-error/25 bg-status-errorSoft p-3.5 text-[12.5px] text-status-error"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={placeOrder} className="grid gap-5 lg:grid-cols-12 lg:gap-6">
        <div className="space-y-4 lg:col-span-7">
          {/* Recipient */}
          <section className="rounded-card border border-border bg-white p-4 shadow-card sm:p-5">
            <h2 className="flex items-center gap-2 text-card text-charcoal">
              <User className="h-4 w-4 text-brand" />
              Recipient & contact
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="checkout-name" className="mb-1.5 block text-label font-bold text-charcoal">
                  Full name
                </label>
                <input
                  id="checkout-name"
                  type="text"
                  value={customerName}
                  onChange={(event) => setCustomerName(event.target.value)}
                  required
                  autoComplete="name"
                  className="field"
                  placeholder="e.g. Brenda Kemigisha"
                />
              </div>
              <div>
                <label htmlFor="checkout-phone" className="mb-1.5 block text-label font-bold text-charcoal">
                  Phone (MTN / Airtel)
                </label>
                <input
                  id="checkout-phone"
                  type="tel"
                  value={customerPhone}
                  onChange={(event) => setCustomerPhone(event.target.value)}
                  required
                  autoComplete="tel"
                  className="field"
                  placeholder="+256 772 123 456"
                />
              </div>
            </div>
          </section>

          {/* Delivery */}
          <section className="rounded-card border border-border bg-white p-4 shadow-card sm:p-5">
            <h2 className="flex items-center gap-2 text-card text-charcoal">
              <MapPin className="h-4 w-4 text-brand" />
              Delivery location
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="checkout-neighbourhood" className="mb-1.5 block text-label font-bold text-charcoal">
                  Neighbourhood
                </label>
                <select
                  id="checkout-neighbourhood"
                  value={neighbourhood}
                  onChange={(event) => setNeighbourhood(event.target.value)}
                  className="field font-semibold"
                >
                  {allLocations.map((location) => (
                    <option key={location.id} value={location.name}>
                      {location.name} — {location.landmark}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="checkout-address" className="mb-1.5 block text-label font-bold text-charcoal">
                  Landmark / hostel / door
                </label>
                <input
                  id="checkout-address"
                  type="text"
                  value={deliveryAddress}
                  onChange={(event) => setDeliveryAddress(event.target.value)}
                  required
                  className="field"
                  placeholder="Room 4B, St. Michael Hostel, KIU Campus"
                />
              </div>
            </div>

            <div className="mt-3">
              <label htmlFor="checkout-notes" className="mb-1.5 block text-label font-bold text-charcoal">
                Kitchen or rider notes <span className="font-medium text-charcoal-muted">(optional)</span>
              </label>
              <input
                id="checkout-notes"
                type="text"
                value={specialInstructions}
                onChange={(event) => setSpecialInstructions(event.target.value)}
                className="field"
                placeholder="Extra pepper, call at the security gate…"
              />
            </div>
          </section>

          {/* Payment */}
          <section className="rounded-card border border-border bg-white p-4 shadow-card sm:p-5">
            <h2 className="flex items-center gap-2 text-card text-charcoal">
              <Smartphone className="h-4 w-4 text-brand" />
              Payment method
            </h2>
            <fieldset className="mt-4">
              <legend className="sr-only">Choose a payment method</legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {PAYMENT_METHODS.map((method) => {
                  const Icon = method.icon;
                  const active = paymentMethod === method.id;
                  return (
                    <label
                      key={method.id}
                      htmlFor={`payment-${method.id}`}
                      className={
                        'flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-all duration-200 ' +
                        (active
                          ? 'border-brand bg-sage-soft ring-1 ring-brand/20'
                          : 'border-border bg-white hover:border-brand/25 hover:bg-ivory-soft')
                      }
                    >
                      <input
                        id={`payment-${method.id}`}
                        type="radio"
                        name="payment-method"
                        value={method.id}
                        checked={active}
                        onChange={() => setPaymentMethod(method.id)}
                        className="sr-only"
                      />
                      <span
                        className={
                          'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[10px] font-extrabold ' +
                          (active ? 'bg-brand text-amber' : 'bg-ivory text-brand')
                        }
                      >
                        {method.badge ? method.badge : <Icon className="h-4 w-4" />}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-[12.5px] font-bold text-charcoal">{method.label}</span>
                        <span className="mt-0.5 block text-[10.5px] text-charcoal-secondary">{method.hint}</span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          </section>
        </div>

        {/* Summary */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-24">
            <section className="rounded-card border border-border bg-white p-4 shadow-card sm:p-5">
              <div className="flex items-center justify-between gap-2 border-b border-border pb-3">
                <h2 className="text-card text-charcoal">Order summary</h2>
                <Badge tone="neutral">{items.length} item{items.length === 1 ? '' : 's'}</Badge>
              </div>

              <ul className="mt-3 max-h-[264px] space-y-2.5 overflow-y-auto pr-1">
                {items.map((item) => (
                  <li key={item.id} className="flex items-center gap-3">
                    {item.image ? (
                      <SmartImage
                        src={item.image}
                        alt={item.name}
                        ratio="aspect-square"
                        className="w-11 shrink-0 rounded-lg border border-border bg-ivory"
                        imgClassName="object-contain p-1"
                      />
                    ) : (
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-sage-light text-brand">
                        <ShoppingBag className="h-4 w-4" />
                      </span>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[12.5px] font-semibold text-charcoal">{item.name}</p>
                      <p className="numeric mt-0.5 text-[10.5px] text-charcoal-muted">
                        {item.quantity} × <Currency amount={item.priceUGX} showPrefix={false} />
                      </p>
                    </div>
                    <Currency amount={item.itemTotalUGX} className="shrink-0 text-[12px] font-bold text-charcoal" />
                  </li>
                ))}
              </ul>

              <dl className="mt-4 space-y-2 border-t border-border pt-3 text-[12px]">
                <div className="flex justify-between">
                  <dt className="text-charcoal-secondary">Subtotal</dt>
                  <dd>
                    <Currency amount={subtotalUGX} className="font-semibold text-charcoal" />
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-charcoal-secondary">Delivery · {neighbourhood}</dt>
                  <dd className="font-semibold text-charcoal">
                    {payableDelivery === 0 ? 'Free' : <Currency amount={payableDelivery} />}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-charcoal-secondary">Platform service fee</dt>
                  <dd>
                    <Currency amount={serviceFeeUGX} className="font-semibold text-charcoal" />
                  </dd>
                </div>
                <div className="flex items-center justify-between border-t border-border pt-2.5">
                  <dt className="text-label font-bold text-charcoal">Total</dt>
                  <dd>
                    <Currency amount={payableTotal} className="text-[18px] font-extrabold text-brand" />
                  </dd>
                </div>
              </dl>

              <Button type="submit" fullWidth size="lg" loading={isSubmitting} className="mt-4">
                Place order
              </Button>

              <p className="mt-2.5 flex items-center justify-center gap-1.5 text-center text-[10.5px] text-charcoal-muted">
                <ShieldCheck className="h-3.5 w-3.5 text-brand" />
                Simulated transaction · no real payment
              </p>
            </section>

            <div className="mt-3 flex items-start gap-2 rounded-card border border-border bg-sage-soft px-4 py-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
              <p className="text-[11px] leading-relaxed text-charcoal-secondary">
                Riders meet you at the landmark you provide. If the gate is locked, they will call the number above.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
