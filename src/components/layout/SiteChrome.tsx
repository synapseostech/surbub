'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { MobileBottomNav } from './MobileBottomNav';
import { CartDrawer } from './CartDrawer';

export const SiteChrome: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith('/dashboard');

  if (isDashboard) return <>{children}</>;

  return (
    <>
      <Navbar />
      <main className="flex-1 pb-[64px] md:pb-0">{children}</main>
      <CartDrawer />
      <Footer />
      <MobileBottomNav />
    </>
  );
};
