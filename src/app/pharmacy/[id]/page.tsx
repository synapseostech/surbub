'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { MOCK_PHARMACIES, MOCK_PHARMACY_PRODUCTS, MOCK_PRICE_COMPARISONS } from '@/data/mock/pharmacies';
import { pharmacyService } from '@/services/pharmacy-service';
import { Currency } from '@/components/common/Currency';
import { DemoDisclaimer } from '@/components/common/DemoDisclaimer';
import { PageHeader } from '@/components/ui/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { SmartImage } from '@/components/ui/SmartImage';
import { useToast } from '@/components/ui/Toast';
import {
  ArrowLeft,
  MapPin,
  Clock,
  Phone,
  ShieldCheck,
  FileText,
  MessageSquare,
  Send,
  CheckCircle2,
  Star,
  MessageCircle,
} from 'lucide-react';

const availabilityLabel = (label: string) => {
  if (label === 'In Stock') return 'Reported available';
  if (label === 'Limited Stock') return 'Limited — call first';
  return 'Call to confirm';
};

export default function PharmacyDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const pharmacy = MOCK_PHARMACIES.find((item) => item.id === id) || MOCK_PHARMACIES[0];
  const { toast } = useToast();

  const [inquiryText, setInquiryText] = useState('');
  const [sending, setSending] = useState(false);
  const [inquirySent, setInquirySent] = useState(false);

  const sendInquiry = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!inquiryText.trim()) return;
    setSending(true);
    await pharmacyService.sendInquiry({
      pharmacyId: pharmacy.id,
      customerName: 'Brenda Kemigisha',
      customerPhone: '+256 772 341 892',
      message: inquiryText,
      type: 'stock_check',
    });
    setSending(false);
    setInquirySent(true);
    setInquiryText('');
    toast('Message sent to the pharmacist', `${pharmacy.name} will reply by phone.`);
  };

  return (
    <div className="page-container">
      <div className="pt-6">
        <Link
          href="/pharmacy"
          className="inline-flex items-center gap-1.5 text-label font-semibold text-charcoal-secondary transition-colors hover:text-brand"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All chemists
        </Link>
      </div>

      <PageHeader
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Pharmacy', href: '/pharmacy' }, { label: pharmacy.name }]}
        eyebrow={pharmacy.location.neighborhood}
        title={pharmacy.name}
        description={pharmacy.tagline}
        meta={
          <>
            <Badge tone="success" dot>
              NDA licensed
            </Badge>
            <span className="inline-flex items-center gap-1.5 text-[11.5px] font-bold text-charcoal">
              <Star className="h-3.5 w-3.5 fill-amber text-amber" />
              {pharmacy.rating.toFixed(1)}
              <span className="font-medium text-charcoal-secondary">({pharmacy.reviewCount} reviews)</span>
            </span>
            <span className="text-[11.5px] font-semibold text-charcoal-secondary">{pharmacy.location.address}</span>
          </>
        }
        actions={
          <>
            <Button href={`tel:${pharmacy.phone}`} variant="outline" size="md">
              <Phone className="h-4 w-4 text-brand" />
              Call chemist
            </Button>
            <Button href="#pharmacist-desk" size="md">
              <MessageSquare className="h-4 w-4" />
              Ask a question
            </Button>
          </>
        }
      />

      <DemoDisclaimer type="pharmacy" className="mb-6" />

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Catalogue */}
        <div className="lg:col-span-8">
          <div className="overflow-hidden rounded-card border border-border bg-white shadow-card">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
              <div>
                <h2 className="text-card text-charcoal">Published health & wellness catalogue</h2>
                <p className="mt-0.5 text-[11.5px] text-charcoal-secondary">
                  Prices shown are the chemist&apos;s published prices. Availability is reported, not live.
                </p>
              </div>
              <Badge tone="neutral">{MOCK_PHARMACY_PRODUCTS.length} items</Badge>
            </div>

            <ul className="divide-y divide-border">
              {MOCK_PHARMACY_PRODUCTS.map((product) => {
                const listings = MOCK_PRICE_COMPARISONS[product.id] || [];
                const listing = listings.find((item) => item.pharmacyId === pharmacy.id);
                const price = listing?.priceUGX ?? product.standardPriceUGX;
                const available = listing?.availabilityLabel ?? 'Call to Confirm';

                return (
                  <li key={product.id} className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-ivory-soft sm:px-5">
                    <SmartImage
                      src={product.image}
                      alt={product.name}
                      ratio="aspect-square"
                      className="w-14 shrink-0 rounded-xl border border-border bg-ivory"
                      imgClassName="object-contain p-1.5 mix-blend-multiply"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <p className="truncate text-label font-bold text-charcoal">{product.name}</p>
                        {product.requiresPrescription && <Badge tone="warning">Rx</Badge>}
                      </div>
                      <p className="mt-0.5 truncate text-[11px] text-charcoal-muted">{product.dosageForm}</p>
                      {product.requiresPrescription ? (
                        <p className="mt-1 text-[10.5px] font-semibold text-[#8A5A12]">Prescription · call to confirm</p>
                      ) : (
                        <p className="mt-1 text-[10.5px] font-semibold text-status-success">{availabilityLabel(available)}</p>
                      )}
                    </div>
                    <div className="shrink-0 text-right">
                      <Currency amount={price} className="text-[13.5px] font-extrabold text-brand" />
                      {product.requiresPrescription && (
                        <span className="mt-0.5 block text-[10px] font-medium text-charcoal-muted">In person only</span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {[
              { icon: ShieldCheck, label: 'Licence', value: pharmacy.licenseNumber },
              { icon: FileText, label: 'Supervising pharmacist', value: pharmacy.pharmacistInCharge },
              { icon: Clock, label: 'Opening hours', value: `${pharmacy.hours.open} – ${pharmacy.hours.close}` },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="rounded-card border border-border bg-white p-4">
                  <Icon className="h-4 w-4 text-brand" />
                  <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.1em] text-charcoal-muted">
                    {item.label}
                  </p>
                  <p className="mt-0.5 text-[12px] font-semibold leading-snug text-charcoal">{item.value}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Identity + desk */}
        <aside id="pharmacist-desk" className="space-y-5 lg:col-span-4">
          <div className="overflow-hidden rounded-card border border-border bg-white shadow-card">
            <SmartImage src={pharmacy.bannerImage} alt={pharmacy.name} ratio="aspect-[16/10]" fallbackLabel={pharmacy.name} />
            <div className="space-y-3 p-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-brand-secondary">Chemist identity</p>
                <h2 className="mt-1 text-card text-charcoal">{pharmacy.name}</h2>
              </div>
              <p className="text-[12px] leading-relaxed text-charcoal-secondary">{pharmacy.description}</p>

              <dl className="space-y-2 border-t border-border pt-3 text-[12px]">
                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" />
                  <span className="text-charcoal-secondary">{pharmacy.location.address}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" />
                  <span className="text-charcoal-secondary">
                    {pharmacy.hours.open} – {pharmacy.hours.close} · {pharmacy.hours.days.join(', ')}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Phone className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" />
                  <a href={`tel:${pharmacy.phone}`} className="font-semibold text-charcoal hover:text-brand">
                    {pharmacy.phone}
                  </a>
                </div>
                <div className="flex items-start gap-2">
                  <MessageCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" />
                  <span className="text-charcoal-secondary">WhatsApp {pharmacy.whatsapp}</span>
                </div>
              </dl>
            </div>
          </div>

          <div className="rounded-card border border-border bg-sage-soft p-4">
            <h3 className="flex items-center gap-2 text-label font-bold text-charcoal">
              <MessageSquare className="h-4 w-4 text-brand" />
              Pharmacist desk
            </h3>
            <p className="mt-1.5 text-[12px] leading-relaxed text-charcoal-secondary">
              Ask about batches, dosage or suitability before you travel. {pharmacy.pharmacistInCharge} reviews
              messages during opening hours.
            </p>

            {inquirySent ? (
              <div className="mt-3 flex items-start gap-2 rounded-xl border border-status-success/25 bg-white p-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-status-success" />
                <p className="text-[11.5px] leading-relaxed text-charcoal-secondary">
                  <span className="font-bold text-charcoal">Message sent.</span> The pharmacist will call you back on
                  the number saved to your account.
                </p>
              </div>
            ) : (
              <form onSubmit={sendInquiry} className="mt-3 space-y-2.5">
                <label htmlFor="pharmacy-question" className="sr-only">
                  Your question for the pharmacist
                </label>
                <textarea
                  id="pharmacy-question"
                  rows={3}
                  value={inquiryText}
                  onChange={(event) => setInquiryText(event.target.value)}
                  required
                  placeholder="e.g. Do you have the 500mg pack today, and what is the price?"
                  className="field resize-none text-[12.5px]"
                />
                <Button type="submit" size="sm" fullWidth loading={sending}>
                  <Send className="h-3.5 w-3.5" />
                  Send to pharmacist
                </Button>
              </form>
            )}

            <p className="mt-3 text-[10.5px] leading-relaxed text-charcoal-muted">
              Emergency line:{' '}
              <a href={`tel:${pharmacy.emergencyHotline}`} className="font-bold text-brand">
                {pharmacy.emergencyHotline}
              </a>
            </p>
          </div>

          <div className="rounded-card border border-dashed border-border bg-white px-4 py-3.5">
            <p className="text-[11.5px] leading-relaxed text-charcoal-secondary">
              <span className="font-bold text-charcoal">No online dispensing.</span> Prescription medicines require a
              valid prescription presented at the counter.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
