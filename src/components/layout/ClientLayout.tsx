'use client';

import React, { useState } from 'react';
import { LanguageProvider } from '@/context/LanguageContext';
import { CartProvider } from '@/context/CartContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/layout/CartDrawer';
import FloatingWhatsApp from '@/components/ui/FloatingWhatsApp';
import { usePathname } from 'next/navigation';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const pathname = usePathname();
  const isAdminPath = pathname?.startsWith('/admin');

  return (
    <LanguageProvider>
      <CartProvider>
        {isAdminPath ? (
          // Admin routes don't render public Navbar & Footer
          <main className="min-h-screen bg-gray-50 text-gray-900">{children}</main>
        ) : (
          <div className="min-h-screen flex flex-col justify-between">
            <Navbar onOpenCart={() => setIsCartOpen(true)} />
            <main className="flex-1">{children}</main>
            <Footer />
            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
            <FloatingWhatsApp />
          </div>
        )}
      </CartProvider>
    </LanguageProvider>
  );
}
