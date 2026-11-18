import React from 'react';
import { HeroSection } from '@/components/home/HeroSection';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { PromotionsSection } from '@/components/home/PromotionsSection';
import { PopularNearby } from '@/components/home/PopularNearby';
import { FeaturedRestaurantsSection } from '@/components/home/FeaturedRestaurantsSection';
import { PharmacyShowcase } from '@/components/home/PharmacyShowcase';
import { LaundrySection } from '@/components/home/LaundrySection';
import { MobilityWidget } from '@/components/home/MobilityWidget';
import { RecentlyAdded } from '@/components/home/RecentlyAdded';
import { TrustSection } from '@/components/home/TrustSection';

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <CategoryGrid />
      <PromotionsSection />
      <PopularNearby />
      <FeaturedRestaurantsSection />
      <PharmacyShowcase />
      <LaundrySection />
      <MobilityWidget />
      <RecentlyAdded />
      <TrustSection />
    </div>
  );
}
