import type { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
  title: 'TS Boilerplate',
  description: 'A production-minded Next.js, Neon, and Drizzle starter.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
