'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { Currency } from '@/components/common/Currency';
import { Button } from '@/components/ui/Button';
import { SmartImage } from '@/components/ui/SmartImage';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isDrawerOpen,
    setIsDrawerOpen,
    updateQuantity,
    removeItem,
    subtotalUGX,
    deliveryFeeUGX,
    serviceFeeUGX,
    totalUGX,
    merchantName,
  } = useCart();

  useEffect(() => {
    if (!isDrawerOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsDrawerOpen(false);
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener('keydown', onKey);
    };
  }, [isDrawerOpen, setIsDrawerOpen]);

  if (!isDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] overflow-hidden" role="dialog" aria-modal="true" aria-label="Your cart">
      <button
        type="button"
        aria-label="Close cart"
        onClick={() => setIsDrawerOpen(false)}
        className="absolute inset-0 h-full w-full cursor-default bg-brand-deep/55 backdrop-blur-[3px] animate-fade-in"
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full">
        <div className="flex w-screen max-w-md flex-col border-l border-border bg-white shadow-float animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand text-amber">
                <ShoppingBag className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <h2 className="text-card text-charcoal">Your cart</h2>
                {merchantName ? (
                  <p className="truncate text-[11px] font-semibold text-brand-secondary">{merchantName}</p>
                ) : (
                  <p className="text-[11px] text-charcoal-muted">Local marketplace</p>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsDrawerOpen(false)}
              aria-label="Close cart"
              className="flex h-9 w-9 items-center justify-center rounded-xl text-charcoal-secondary transition-colors hover:bg-ivory hover:text-charcoal"
            >
              <X className="h-[18px] w-[18px]" />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto px-5 py-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center py-16 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sage-light text-brand">
                  <ShoppingBag className="h-6 w-6" />
                </span>
                <h3 className="mt-3 text-card text-charcoal">Your cart is empty</h3>
                <p className="mt-1 max-w-xs text-label leading-relaxed text-charcoal-secondary">
                  Explore local kitchens, cafés and grills around Ishaka–Bushenyi to start an order.
                </p>
                <Button href="/restaurants" size="sm" className="mt-4" onClick={() => setIsDrawerOpen(false)}>
                  Explore restaurants
                </Button>
              </div>
            ) : (
              <ul className="space-y-3">
                {items.map((item) => (
                  <li
                    key={item.id}
                    className="flex gap-3 rounded-card border border-border bg-white p-3 shadow-card"
                  >
                    {item.image ? (
                      <SmartImage
                        src={item.image}
                        alt={item.name}
                        ratio="aspect-square"
                        className="w-16 shrink-0 rounded-xl border border-border bg-ivory"
                        imgClassName="object-contain p-1.5"
                        fallbackLabel={item.name}
                      />
                    ) : (
                      <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-sage-light text-brand">
                        <ShoppingBag className="h-5 w-5" />
                      </span>
                    )}

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="line-clamp-2 text-[12.5px] font-bold leading-snug text-charcoal">{item.name}</p>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          aria-label={`Remove ${item.name} from cart`}
                          className="-mr-1 -mt-1 rounded-lg p-1 text-charcoal-muted transition-colors hover:bg-status-errorSoft hover:text-status-error"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="mt-0.5 text-[10.5px] text-charcoal-muted">
                        <Currency amount={item.priceUGX} /> each
                      </p>

                      <div className="mt-2 flex items-center justify-between gap-2">
                        <div className="inline-flex items-center gap-1 rounded-lg border border-border bg-ivory p-0.5">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="flex h-6 w-6 items-center justify-center rounded-md bg-white text-charcoal shadow-sm transition-colors hover:bg-sage-light"
                            aria-label={`Reduce ${item.name}`}
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="numeric w-5 text-center text-[11px] font-bold text-charcoal">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="flex h-6 w-6 items-center justify-center rounded-md bg-white text-charcoal shadow-sm transition-colors hover:bg-sage-light"
                            aria-label={`Add another ${item.name}`}
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <Currency amount={item.itemTotalUGX} className="text-[12.5px] font-extrabold text-brand" />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-border bg-ivory-soft px-5 py-4">
              <dl className="space-y-1.5 text-[12px]">
                <div className="flex justify-between">
                  <dt className="text-charcoal-secondary">Subtotal</dt>
                  <dd>
                    <Currency amount={subtotalUGX} className="font-semibold text-charcoal" />
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-charcoal-secondary">Estimated delivery</dt>
                  <dd>
                    <Currency amount={deliveryFeeUGX} className="font-semibold text-charcoal" />
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-charcoal-secondary">Platform fee</dt>
                  <dd>
                    <Currency amount={serviceFeeUGX} className="font-semibold text-charcoal" />
                  </dd>
                </div>
                <div className="flex items-center justify-between border-t border-border pt-2.5">
                  <dt className="text-label font-bold text-charcoal">Total</dt>
                  <dd>
                    <Currency amount={totalUGX} className="text-[17px] font-extrabold text-brand" />
                  </dd>
                </div>
              </dl>

              <Button
                href="/checkout"
                size="lg"
                fullWidth
                className="mt-3"
                onClick={() => setIsDrawerOpen(false)}
              >
                Proceed to checkout
                <ArrowRight className="h-4 w-4" />
              </Button>

              <p className="mt-2 text-center text-[10.5px] text-charcoal-muted">
                Mobile Money & cash supported · simulated checkout
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
