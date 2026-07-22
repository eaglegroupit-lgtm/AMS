import type { Metadata } from 'next';
import './globals.css';
import ClientLayout from '@/components/layout/ClientLayout';

export const metadata: Metadata = {
  title: 'Amutha Surabi Restaurant | Authentic South Indian Cuisine in Madurai',
  description:
    'Experience authentic South Indian traditional dishes, Chettinad biryani, crisp ghee roast dosa, filter coffee, and Madurai Jigarthanda at Amutha Surabi Restaurant.',
  keywords: [
    'South Indian Restaurant',
    'Madurai Food',
    'Chettinad Biryani',
    'Ghee Roast Dosa',
    'Amutha Surabi',
    'Filter Coffee',
    'Jigarthanda',
    'Vegetarian Thali',
    'அமுதா சுரபி',
  ],
  openGraph: {
    title: 'Amutha Surabi Restaurant - South Indian Culinary Heritage',
    description: 'Authentic South Indian dining experience with English & Tamil support.',
    type: 'website',
    locale: 'en_IN',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="font-sans antialiased bg-orange-50/20 text-gray-900">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
