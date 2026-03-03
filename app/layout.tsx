import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'What Could I Offer? — by BetterWorld',
  description:
    'You have more to give than you think. Discover creative, high-value auction offerings unique to you — in seconds.',
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
