import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'What Could I Offer? — AI-Powered Auction Discovery by BetterWorld',
  description:
    'Help supporters discover creative, high-value auction items they never knew they could give. Set up your nonprofit fundraising page in 2 minutes — free forever.',
  keywords: [
    'nonprofit auction',
    'fundraising',
    'auction items',
    'charity auction',
    'AI fundraising',
    'donor engagement',
    'silent auction',
    'gala auction',
    'BetterWorld',
  ],
  authors: [{ name: 'BetterWorld', url: 'https://betterworld.org' }],
  creator: 'BetterWorld',
  metadataBase: new URL('https://whatcouldioffer.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://whatcouldioffer.com',
    siteName: 'What Could I Offer?',
    title: 'What Could I Offer? — Unlock the Hidden Generosity of Your Donors',
    description:
      'AI helps supporters discover creative auction items they never knew they could give. Set up your nonprofit fundraising page in 2 minutes — free forever.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'What Could I Offer? — AI-Powered Auction Discovery',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'What Could I Offer? — AI-Powered Auction Discovery',
    description:
      'Help supporters discover creative auction items they never knew they could give. Free for nonprofits.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
