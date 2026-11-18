'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { orderService } from '@/services/order-service';
import type { Order, OrderStatus } from '@/types/order';
import { Currency } from '@/components/common/Currency';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import {
  CheckCircle2,
  Clock,
  Bike,
  Phone,
  ChefHat,
  ShoppingBag,
  PackageCheck,
  Play,
  MapPin,
  Receipt,
} from 'lucide-react';

const STEPS: { status: OrderStatus; label: string; description: string; icon: React.ElementType }[] = [
  { status: 'placed', label: 'Order placed', description: 'Ticket received by SUBURB+', icon: Receipt },
  { status: 'confirmed_by_merchant', label: 'Kitchen confirmed', description: 'Your ticket is on the pass', icon: ChefHat },
  { status: 'preparing', label: 'Being prepared', description: 'Cooking fresh to order', icon: Clock },
  { status: 'out_for_delivery', label: 'Rider on the way', description: 'Ronald Katushabe is en route', icon: Bike },
  { status: 'delivered', label: 'Delivered', description: 'Handed over at your address', icon: PackageCheck },
];

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || 'ord_sub_8921';
  const { toast } = useToast();

  const [order, setOrder] = useState<Order | null>(null);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    orderService.getOrderById(orderId).then((result) => {
      if (result) {
        setOrder(result);
        const index = STEPS.findIndex((step) => step.status === result.status);
        if (index !== -1) setStepIndex(index);
      }
    });
  }, [orderId]);

  const advance = async () => {
    if (stepIndex >= STEPS.length - 1) return;
    const nextIndex = stepIndex + 1;
    const nextStep = STEPS[nextIndex];
    setStepIndex(nextIndex);
    if (order) {
      const updated = await orderService.updateOrderStatus(order.id, nextStep.status, nextStep.description);
      if (updated) setOrder(updated);
    }
    toast(nextStep.label, nextStep.description);
  };

  return (
    <div className="page-container">
      <div className="mx-auto max-w-3xl py-10 sm:py-14">
        <div className="overflow-hidden rounded-card-lg border border-border bg-white shadow-card">
          {/* Confirmation header */}
          <div className="pattern-sage border-b border-border bg-sage-soft px-6 py-9 text-center">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand text-amber shadow-card">
              <CheckCircle2 className="h-8 w-8" />
            </span>
            <Badge tone="success" className="mt-4">
              Order confirmed
            </Badge>
            <h1 className="mt-3 text-h1 text-charcoal">Thank you — the kitchen has your ticket</h1>
            <p className="mt-1.5 text-label text-charcoal-secondary">
              Reference <span className="numeric font-bold text-charcoal">{orderId}</span>
              {order && (
                <>
                  {' '}
                  · <Currency amount={order.totalUGX} className="font-bold text-charcoal" />
                </>
              )}
            </p>
          </div>

          <div className="p-5 sm:p-7">
            {/* Simulation notice */}
            <div className="flex flex-col gap-3 rounded-xl border border-amber/30 bg-amber-wash p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-label font-bold text-[#8A5A12]">Preview the fulfilment flow</p>
                <p className="mt-0.5 text-[11.5px] leading-relaxed text-[#8A5A12]/80">
                  Advance the order to see how kitchen and rider updates appear to the customer.
                </p>
              </div>
              {stepIndex < STEPS.length - 1 ? (
                <Button variant="amber" size="sm" onClick={advance} className="shrink-0">
                  <Play className="h-3.5 w-3.5" />
                  Advance stage {stepIndex + 1}/{STEPS.length}
                </Button>
              ) : (
                <Badge tone="success" className="shrink-0">
                  Fully delivered
                </Badge>
              )}
            </div>

            {/* Timeline */}
            <div className="mt-6">
              <h2 className="text-card text-charcoal">Live order progress</h2>
              <ol className="mt-4 space-y-1">
                {STEPS.map((step, index) => {
                  const Icon = step.icon;
                  const passed = index <= stepIndex;
                  const current = index === stepIndex;
                  return (
                    <li key={step.status} className="relative flex gap-3 pb-4 last:pb-0">
                      {index < STEPS.length - 1 && (
                        <span
                          aria-hidden="true"
                          className={
                            'absolute left-[15px] top-8 h-[calc(100%-24px)] w-px ' +
                            (index < stepIndex ? 'bg-brand/40' : 'bg-border')
                          }
                        />
                      )}
                      <span
                        className={
                          'relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ' +
                          (passed
                            ? 'border-brand bg-brand text-amber'
                            : 'border-border bg-white text-charcoal-muted')
                        }
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 pt-0.5">
                        <p className={'text-label font-bold ' + (current ? 'text-brand' : passed ? 'text-charcoal' : 'text-charcoal-muted')}>
                          {step.label}
                          {current && (
                            <span className="ml-2 rounded-full bg-sage px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-[0.08em] text-brand">
                              Now
                            </span>
                          )}
                        </p>
                        <p className="mt-0.5 text-[11.5px] text-charcoal-secondary">{step.description}</p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>

            {/* Rider */}
            {stepIndex >= 3 && (
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-ivory-soft p-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-amber">
                    <Bike className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-label font-bold text-charcoal">Ronald Katushabe is delivering your order</p>
                    <p className="mt-0.5 text-[11px] text-charcoal-secondary">
                      Bajaj Boxer (UFL 429K) · KIU Main Gate stage
                    </p>
                  </div>
                </div>
                <Button href="tel:+256774901234" variant="outline" size="sm">
                  <Phone className="h-3.5 w-3.5 text-brand" />
                  Call rider
                </Button>
              </div>
            )}

            {/* Delivery details */}
            {order && (
              <div className="mt-4 flex items-start gap-2 rounded-xl border border-border px-4 py-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                <p className="text-[11.5px] leading-relaxed text-charcoal-secondary">
                  Delivering to <span className="font-semibold text-charcoal">{order.deliveryAddress}</span> ·{' '}
                  {order.deliveryNeighborhood} · {order.customerPhone}
                </p>
              </div>
            )}

            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <Button href="/account?tab=orders" variant="outline" fullWidth>
                View in my orders
              </Button>
              <Button href="/restaurants" fullWidth>
                <ShoppingBag className="h-4 w-4" />
                Order more
              </Button>
            </div>

            <p className="mt-3 text-center text-[10.5px] text-charcoal-muted">
              This is a demonstration order. No payment was processed and no rider was dispatched.
            </p>
          </div>
        </div>

        <p className="mt-5 text-center text-label text-charcoal-secondary">
          Back to{' '}
          <Link href="/" className="font-semibold text-brand hover:underline">
            SUBURB+ home
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="page-container py-12">
          <div className="mx-auto h-[520px] max-w-3xl rounded-card-lg bg-white skeleton" />
        </div>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  );
}
