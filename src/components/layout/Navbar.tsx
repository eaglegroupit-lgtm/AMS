'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, Phone, Globe, Menu as MenuIcon, X, Shield } from 'lucide-react';

interface NavbarProps {
  onOpenCart: () => void;
}

export default function Navbar({ onOpenCart }: NavbarProps) {
  const { language, setLanguage, t } = useLanguage();
  const { itemCount } = useCart();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: t('navHome') },
    { href: '/menu', label: t('navMenu') },
    { href: '/about', label: t('navAbout') },
    { href: '/gallery', label: t('navGallery') },
    { href: '/contact', label: t('navContact') },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-orange-100 shadow-sm transition-all">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-brand-maroon-900 via-brand-maroon-700 to-brand-maroon-900 text-amber-100 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3 text-xs">
            <span className="bg-amber-400 text-brand-maroon-900 px-2 py-0.5 rounded font-bold text-[10px] uppercase tracking-wider">
              Authentic Taste
            </span>
            <span className="hidden sm:inline">
              {language === 'ta'
                ? 'அசலான மதுரை & செட்டிநாடு பாரம்பரிய உணவுவகை!'
                : 'Authentic Madurai & Chettinad Heritage Recipes!'}
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <a
              href="tel:+919876543210"
              className="flex items-center space-x-1 hover:text-amber-300 transition-colors"
            >
              <Phone className="w-3 h-3 text-amber-400" />
              <span>+91 98765 43210</span>
            </a>
            <Link
              href="/admin/login"
              className="flex items-center space-x-1 hover:text-amber-300 transition-colors text-amber-200"
            >
              <Shield className="w-3 h-3" />
              <span>{t('navAdmin')}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-brand-orange-600 to-amber-400 flex items-center justify-center text-white font-bold text-xl shadow-md ring-2 ring-amber-300 group-hover:scale-105 transition-transform">
            அ
          </div>
          <div>
            <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-brand-orange-600 via-red-700 to-brand-maroon-800 bg-clip-text text-transparent block">
              {t('brandName')}
            </span>
            <span className="text-[10px] tracking-wider text-amber-800 font-medium uppercase -mt-1 block">
              {t('brandTagline')}
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-semibold transition-all relative py-1 ${
                  isActive
                    ? 'text-brand-orange-600 font-bold'
                    : 'text-gray-700 hover:text-brand-orange-600'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-orange-600 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Controls (Language + Cart) */}
        <div className="flex items-center space-x-4">
          {/* Language Switcher */}
          <div className="flex items-center bg-orange-50 p-1 rounded-full border border-orange-200">
            <Globe className="w-4 h-4 text-brand-orange-600 ml-2 mr-1" />
            <button
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
                language === 'en'
                  ? 'bg-brand-orange-600 text-white shadow'
                  : 'text-gray-600 hover:text-brand-orange-600'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('ta')}
              className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
                language === 'ta'
                  ? 'bg-brand-orange-600 text-white shadow'
                  : 'text-gray-600 hover:text-brand-orange-600'
              }`}
            >
              தமிழ்
            </button>
          </div>

          {/* Cart Drawer Trigger */}
          <button
            onClick={onOpenCart}
            className="relative p-2.5 bg-brand-orange-50 hover:bg-brand-orange-100 rounded-full text-brand-orange-700 transition-colors"
            aria-label="Open cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-maroon-700 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-bounce shadow">
                {itemCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 rounded-lg hover:bg-gray-100"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 pt-2 pb-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-semibold ${
                pathname === link.href
                  ? 'bg-orange-50 text-brand-orange-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
