'use client';

import React, { Suspense, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  MOCK_PHARMACIES,
  MOCK_PHARMACY_PRODUCTS,
  MOCK_PRICE_COMPARISONS,
} from '@/data/mock/pharmacies';
import type { PharmacyProduct } from '@/types/pharmacy';
import { pharmacyService } from '@/services/pharmacy-service';
import { ProductCard } from '@/components/cards/ProductCard';
import { PageHeader } from '@/components/ui/PageHeader';
import { Chip } from '@/components/ui/Chip';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import { SmartImage } from '@/components/ui/SmartImage';
import { useToast } from '@/components/ui/Toast';
import { Currency } from '@/components/common/Currency';
import { DemoDisclaimer } from '@/components/common/DemoDisclaimer';
import {
  Search,
  Pill,
  ShieldCheck,
  MapPin,
  Clock,
  Phone,
  ArrowRight,
  FileText,
  MessageSquare,
  Send,
  CheckCircle2,
  Store,
} from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'All essentials' },
  { id: 'otc_wellness', label: 'Pain & fever' },
  { id: 'vitamins_supplements', label: 'Vitamins & zinc' },
  { id: 'first_aid', label: 'First aid' },
  { id: 'medical_supplies', label: 'Devices' },
];

const availabilityLabel = (label: string) => {
  if (label === 'In Stock') return 'Reported available';
  if (label === 'Limited Stock') return 'Limited — call first';
  return 'Call to confirm';
};

function PharmacyContent() {
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const queryParam = searchParams.get('search') || '';
  const [searchQuery, setSearchQuery] = useState(queryParam);

  useEffect(() => {
    setSearchQuery(queryParam);
  }, [queryParam]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTab, setActiveTab] = useState<'products' | 'pharmacies'>('products');

  const [activeProduct, setActiveProduct] = useState<PharmacyProduct | null>(null);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [inquiryPharmacyId, setInquiryPharmacyId] = useState(MOCK_PHARMACIES[0].id);
  const [customerName, setCustomerName] = useState('Brenda Kemigisha');
  const [customerPhone, setCustomerPhone] = useState('+256 772 341 892');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [inquirySent, setInquirySent] = useState(false);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return MOCK_PHARMACY_PRODUCTS.filter((product) => {
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        (product.genericName && product.genericName.toLowerCase().includes(query)) ||
        product.description.toLowerCase().includes(query);
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const listingsFor = (product: PharmacyProduct) => MOCK_PRICE_COMPARISONS[product.id] || [];
  const lowestPriceFor = (product: PharmacyProduct) => {
    const listings = listingsFor(product);
    if (listings.length === 0) return product.standardPriceUGX;
    return Math.min(...listings.map((listing) => listing.priceUGX));
  };

  const openProduct = (product: PharmacyProduct) => {
    setActiveProduct(product);
    setInquiryOpen(false);
    setInquirySent(false);
  };

  const openInquiry = (product: PharmacyProduct) => {
    setActiveProduct(product);
    setInquiryOpen(true);
    setInquirySent(false);
    setInquiryMessage(
      `Hello, I would like to confirm the price and availability of ${product.name}, and ask about dosage guidance.`,
    );
  };

  const sendInquiry = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!activeProduct) return;
    setSending(true);
    await pharmacyService.sendInquiry({
      pharmacyId: inquiryPharmacyId,
      productId: activeProduct.id,
      customerName,
      customerPhone,
      message: inquiryMessage,
      type: 'stock_check',
    });
    setSending(false);
    setInquirySent(true);
    toast('Inquiry sent to the pharmacist', 'They will confirm price and availability by phone.');
  };

  const activeListings = activeProduct ? listingsFor(activeProduct) : [];

  return (
    <div className="page-container">
      <PageHeader
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Pharmacy' }]}
        eyebrow="Health, close to home"
        title="Pharmacy prices across Ishaka–Bushenyi"
        description="Compare published prices from licensed community chemists, then call the pharmacist directly. No online dispensing, no invented stock promises."
        meta={
          <>
            <Badge tone="success" dot>
              {MOCK_PHARMACIES.length} licensed partners
            </Badge>
            <Badge tone="neutral">7 essential products</Badge>
          </>
        }
        actions={
          <Button href="/pharmacy/pharm_01" variant="outline" size="md">
            <Store className="h-4 w-4 text-brand" />
            Visit a chemist
          </Button>
        }
      />

      <DemoDisclaimer type="pharmacy" className="mb-6" />

      {/* View switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          role="tablist"
          aria-label="Pharmacy view"
          className="inline-flex rounded-xl border border-border bg-white p-1 shadow-card"
        >
          {[
            { id: 'products' as const, label: 'Compare prices' },
            { id: 'pharmacies' as const, label: `Chemists (${MOCK_PHARMACIES.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={
                'h-9 rounded-lg px-3.5 text-label transition-colors ' +
                (activeTab === tab.id ? 'bg-brand text-white shadow-card' : 'text-charcoal-secondary hover:text-brand')
              }
            >
              {tab.label}
            </button>
          ))}
        </div>
        <p className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-charcoal-secondary">
          <ShieldCheck className="h-3.5 w-3.5 text-brand" />
          Availability is reported by each chemist — please confirm before travelling.
        </p>
      </div>

      {activeTab === 'products' ? (
        <>
          <section aria-label="Search pharmacy products" className="mt-5 rounded-card border border-border bg-white p-4 shadow-card sm:p-5">
            <div className="relative">
              <label htmlFor="pharmacy-search" className="sr-only">
                Search medicine or health product
              </label>
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-muted" />
              <input
                id="pharmacy-search"
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search a medicine, supplement or device — paracetamol, ORS, thermometer…"
                className="field h-11 pl-10"
              />
            </div>
            <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-0.5">
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
          </section>

          <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
            <p className="text-label text-charcoal-secondary">
              <span className="numeric font-bold text-charcoal">{filteredProducts.length}</span>{' '}
              {filteredProducts.length === 1 ? 'product' : 'products'} with published prices
            </p>
            {(searchQuery || selectedCategory !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="text-label font-bold text-brand underline-offset-4 hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>

          {filteredProducts.length === 0 ? (
            <div className="mt-5">
              <EmptyState
                icon={<Pill className="h-6 w-6" />}
                title="No products match that search"
                description="Try a generic name such as paracetamol or a category like vitamins."
              />
            </div>
          ) : (
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product) => {
                const listings = listingsFor(product);
                return (
                  <ProductCard
                    key={product.id}
                    product={product}
                    lowestPriceUGX={lowestPriceFor(product)}
                    pharmacyName={listings.length > 1 ? undefined : listings[0]?.pharmacyName}
                    onClick={() => openProduct(product)}
                  />
                );
              })}
            </div>
          )}
        </>
      ) : (
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          {MOCK_PHARMACIES.map((pharmacy) => (
            <article
              key={pharmacy.id}
              className="flex flex-col overflow-hidden rounded-card border border-border bg-white shadow-card transition-all duration-300 hover:border-brand/20 hover:shadow-lift"
            >
              <div className="relative">
                <SmartImage
                  src={pharmacy.bannerImage}
                  alt={pharmacy.name}
                  ratio="aspect-[16/7]"
                  fallbackLabel={pharmacy.name}
                />
                <div className="absolute left-3 top-3">
                  <Badge tone="dark" dot>
                    NDA registered
                  </Badge>
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-deep/85 to-transparent p-3.5">
                  <h3 className="text-card text-white">{pharmacy.name}</h3>
                  <p className="mt-0.5 text-[11px] font-medium text-white/70">
                    {pharmacy.location.neighborhood} · {pharmacy.rating.toFixed(1)} rating ({pharmacy.reviewCount})
                  </p>
                </div>
              </div>

              <div className="flex flex-1 flex-col p-4">
                <p className="line-clamp-2 text-[12.5px] leading-relaxed text-charcoal-secondary">{pharmacy.description}</p>

                <dl className="mt-3.5 space-y-2 text-[12px]">
                  {[
                    { icon: MapPin, label: pharmacy.location.address },
                    { icon: Clock, label: `${pharmacy.hours.open} – ${pharmacy.hours.close} · ${pharmacy.hours.days.join(', ')}` },
                    { icon: FileText, label: `Licence ${pharmacy.licenseNumber}` },
                    { icon: ShieldCheck, label: pharmacy.pharmacistInCharge },
                  ].map((row) => {
                    const Icon = row.icon;
                    return (
                      <div key={row.label} className="flex items-start gap-2 text-charcoal-secondary">
                        <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" />
                        <span className="leading-snug">{row.label}</span>
                      </div>
                    );
                  })}
                </dl>

                <div className="mt-auto flex items-center justify-between gap-2 border-t border-border pt-3.5">
                  <a
                    href={`tel:${pharmacy.phone}`}
                    className="inline-flex items-center gap-1.5 text-label font-bold text-charcoal transition-colors hover:text-brand"
                  >
                    <Phone className="h-3.5 w-3.5 text-brand" />
                    {pharmacy.phone}
                  </a>
                  <Button href={`/pharmacy/${pharmacy.id}`} size="sm" variant="secondary">
                    View chemist
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Product comparison modal */}
      <Modal
        open={Boolean(activeProduct && !inquiryOpen)}
        onClose={() => setActiveProduct(null)}
        title={activeProduct?.name}
        description={activeProduct?.genericName}
        size="lg"
        footer={
          activeProduct && (
            <div className="flex flex-col-reverse items-stretch gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[11px] leading-relaxed text-charcoal-secondary">
                Comparing {activeListings.length} published listings · prices in UGX
              </p>
              <Button onClick={() => openInquiry(activeProduct)} size="sm">
                <MessageSquare className="h-3.5 w-3.5" />
                Ask the pharmacist
              </Button>
            </div>
          )
        }
      >
        {activeProduct && (
          <div className="space-y-5">
            <div className="flex gap-4">
              <SmartImage
                src={activeProduct.image}
                alt={activeProduct.name}
                ratio="aspect-square"
                className="w-24 shrink-0 rounded-xl border border-border bg-ivory"
                imgClassName="object-contain p-3 mix-blend-multiply"
              />
              <div>
                <div className="flex flex-wrap gap-1.5">
                  {activeProduct.requiresPrescription ? (
                    <Badge tone="warning">Prescription only</Badge>
                  ) : (
                    <Badge tone="success">Over the counter</Badge>
                  )}
                  <Badge tone="neutral">{activeProduct.dosageForm}</Badge>
                </div>
                <p className="mt-2 text-[12.5px] leading-relaxed text-charcoal-secondary">{activeProduct.description}</p>
              </div>
            </div>

            {activeProduct.requiresPrescription ? (
              <div className="rounded-xl border border-status-warning/30 bg-status-warningSoft p-3.5 text-[12px] leading-relaxed text-[#8A5A12]">
                <strong className="font-bold">Prescription required.</strong> This item is dispensed only in person
                after a licensed pharmacist verifies a valid prescription. SUBURB+ does not sell or deliver it online.
              </div>
            ) : (
              <div className="rounded-xl border border-border bg-ivory-soft p-3.5 text-[12px] leading-relaxed text-charcoal-secondary">
                <strong className="font-semibold text-charcoal">Usage guidance:</strong> {activeProduct.usageNote}
              </div>
            )}

            <div>
              <p className="mb-2 text-[10.5px] font-bold uppercase tracking-[0.12em] text-charcoal-muted">
                Published price by chemist
              </p>
              <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border">
                {activeListings.map((listing) => {
                  const lowest = Math.min(...activeListings.map((item) => item.priceUGX));
                  return (
                    <li key={listing.pharmacyId} className="flex items-center justify-between gap-3 bg-white px-3.5 py-3">
                      <div className="min-w-0">
                        <p className="truncate text-label font-bold text-charcoal">{listing.pharmacyName}</p>
                        <p className="mt-0.5 truncate text-[11px] text-charcoal-muted">{listing.pharmacyLocation}</p>
                      </div>
                      <div className="shrink-0 text-right">
                        <Currency amount={listing.priceUGX} className="text-[13.5px] font-extrabold text-charcoal" />
                        <span
                          className={
                            'mt-0.5 block text-[10px] font-semibold ' +
                            (listing.priceUGX === lowest ? 'text-status-success' : 'text-charcoal-muted')
                          }
                        >
                          {listing.priceUGX === lowest ? 'Lowest listed' : availabilityLabel(listing.availabilityLabel)}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        )}
      </Modal>

      {/* Inquiry modal */}
      <Modal
        open={Boolean(activeProduct && inquiryOpen)}
        onClose={() => {
          setInquiryOpen(false);
          setActiveProduct(null);
        }}
        title="Ask a licensed pharmacist"
        description={activeProduct ? `About ${activeProduct.name}` : undefined}
        footer={
          !inquirySent && (
            <div className="flex items-center justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setInquiryOpen(false);
                  setActiveProduct(null);
                }}
              >
                Cancel
              </Button>
              <Button size="sm" loading={sending} type="submit" form="pharmacy-inquiry-form">
                <Send className="h-3.5 w-3.5" />
                Send inquiry
              </Button>
            </div>
          )
        }
      >
        {inquirySent ? (
          <div className="flex flex-col items-center py-6 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-status-successSoft text-status-success">
              <CheckCircle2 className="h-6 w-6" />
            </span>
            <h4 className="mt-3 text-card text-charcoal">Inquiry delivered</h4>
            <p className="mt-1 max-w-sm text-label leading-relaxed text-charcoal-secondary">
              The pharmacist will confirm price and availability by phone. Prescription medicines still require
              in-person verification.
            </p>
          </div>
        ) : (
          <form id="pharmacy-inquiry-form" onSubmit={sendInquiry} className="space-y-4">
            <div>
              <label htmlFor="inquiry-pharmacy" className="mb-1.5 block text-label font-bold text-charcoal">
                Chemist to contact
              </label>
              <select
                id="inquiry-pharmacy"
                value={inquiryPharmacyId}
                onChange={(event) => setInquiryPharmacyId(event.target.value)}
                className="field font-semibold"
              >
                {MOCK_PHARMACIES.map((pharmacy) => (
                  <option key={pharmacy.id} value={pharmacy.id}>
                    {pharmacy.name} — {pharmacy.location.neighborhood}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="inquiry-name" className="mb-1.5 block text-label font-bold text-charcoal">
                  Your name
                </label>
                <input
                  id="inquiry-name"
                  type="text"
                  value={customerName}
                  onChange={(event) => setCustomerName(event.target.value)}
                  required
                  className="field"
                />
              </div>
              <div>
                <label htmlFor="inquiry-phone" className="mb-1.5 block text-label font-bold text-charcoal">
                  Phone (calls / WhatsApp)
                </label>
                <input
                  id="inquiry-phone"
                  type="tel"
                  value={customerPhone}
                  onChange={(event) => setCustomerPhone(event.target.value)}
                  required
                  className="field"
                />
              </div>
            </div>

            <div>
              <label htmlFor="inquiry-message" className="mb-1.5 block text-label font-bold text-charcoal">
                Your question
              </label>
              <textarea
                id="inquiry-message"
                rows={4}
                value={inquiryMessage}
                onChange={(event) => setInquiryMessage(event.target.value)}
                required
                className="field resize-none"
              />
            </div>

            <p className="rounded-xl border border-border bg-ivory-soft p-3 text-[11.5px] leading-relaxed text-charcoal-secondary">
              This inquiry is not an order or a prescription. Dispensing happens only at the pharmacy counter, in line
              with National Drug Authority rules.
            </p>
          </form>
        )}
      </Modal>
    </div>
  );
}

export default function PharmacyPage() {
  return (
    <Suspense
      fallback={
        <div className="page-container py-10">
          <div className="h-8 w-72 rounded-lg bg-sage-soft skeleton" />
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <div key={index} className="overflow-hidden rounded-card border border-border bg-white">
                <div className="aspect-[5/4] w-full skeleton rounded-none" />
                <div className="space-y-2 p-4">
                  <div className="h-3.5 w-2/3 rounded bg-sage-soft skeleton" />
                  <div className="h-3 w-1/2 rounded bg-sage-soft skeleton" />
                </div>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <PharmacyContent />
    </Suspense>
  );
}
