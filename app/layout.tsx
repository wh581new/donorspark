import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DonorSpark by BetterWorld — AI Auction Item Advisor',
  description:
    'Discover creative, high-value auction items you never knew you could offer. Powered by AI, built by BetterWorld.',
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
