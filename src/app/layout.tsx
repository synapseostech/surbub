import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { LocationProvider } from '@/context/LocationContext';
import { CartProvider } from '@/context/CartContext';
import { ToastProvider } from '@/components/ui/Toast';
import { SiteChrome } from '@/components/layout/SiteChrome';

export const metadata: Metadata = {
  title: {
    default: 'SUBURB+ — Your neighbourhood. Everything you need.',
    template: '%s · SUBURB+',
  },
  description:
    'SUBURB+ is the premium neighbourhood marketplace for Ishaka–Bushenyi: local restaurants, pharmacy price comparison, doorstep laundry, boda rides and vehicle hire.',
  keywords: [
    'SUBURB+',
    'Ishaka',
    'Bushenyi',
    'Uganda',
    'food delivery',
    'boda rides',
    'pharmacy',
    'laundry',
    'vehicle hire',
  ],
  applicationName: 'SUBURB+',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#123D35',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" href="/fonts/manrope-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className="flex min-h-screen flex-col bg-ivory font-sans text-charcoal antialiased">
        <AuthProvider>
          <LocationProvider>
            <CartProvider>
              <ToastProvider>
                <SiteChrome>{children}</SiteChrome>
              </ToastProvider>
            </CartProvider>
          </LocationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
