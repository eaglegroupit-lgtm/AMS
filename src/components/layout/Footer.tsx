'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Phone, Mail, MapPin, Clock, Heart, MessageSquare } from 'lucide-react';

export default function Footer() {
  const { language, t } = useLanguage();

  return (
    <footer className="bg-gradient-to-b from-brand-maroon-900 via-brand-maroon-900 to-black text-amber-100/90 pt-16 pb-8 border-t-4 border-amber-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand & About */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-amber-400 flex items-center justify-center text-brand-maroon-900 font-bold text-xl ring-2 ring-amber-300">
                அ
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                {t('brandName')}
              </span>
            </div>
            <p className="text-sm text-amber-100/70 leading-relaxed">
              {language === 'ta'
                ? 'அமிர்தகரமான சுவையில் சுத்தமான நெய் மற்றும் பாரம்பரிய மசாலாக்களுடன் தயார் செய்யப்படும் அறுசுவை உணவுகள்.'
                : 'Delicious South Indian traditional dishes crafted with pure desi ghee, freshly ground spices, and timeless recipes.'}
            </p>
            <div className="pt-2">
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-full text-xs font-bold transition-all shadow-md"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Order</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 border-b border-amber-500/30 pb-2">
              {language === 'ta' ? 'விரைவு இணைப்புகள்' : 'Quick Links'}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-amber-400 transition-colors">
                  {t('navHome')}
                </Link>
              </li>
              <li>
                <Link href="/menu" className="hover:text-amber-400 transition-colors">
                  {t('navMenu')}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-amber-400 transition-colors">
                  {t('navAbout')}
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-amber-400 transition-colors">
                  {t('navGallery')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-amber-400 transition-colors">
                  {t('navContact')}
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-amber-400 transition-colors text-amber-300">
                  {t('loginAdmin')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 border-b border-amber-500/30 pb-2">
              {t('openingHoursLabel')}
            </h4>
            <div className="space-y-3 text-sm text-amber-100/80">
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">
                    {language === 'ta' ? 'காலை சிற்றுண்டி:' : 'Breakfast:'}
                  </p>
                  <p className="text-xs">7:00 AM - 11:30 AM</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">
                    {language === 'ta' ? 'மதிய சாப்பாடு:' : 'Lunch:'}
                  </p>
                  <p className="text-xs">12:00 PM - 4:00 PM</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">
                    {language === 'ta' ? 'இரவு சிற்றுண்டி:' : 'Dinner:'}
                  </p>
                  <p className="text-xs">6:30 PM - 11:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 border-b border-amber-500/30 pb-2">
              {t('contactUs')}
            </h4>
            <ul className="space-y-3 text-sm text-amber-100/80">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <span className="text-xs">
                  {language === 'ta'
                    ? '123 கோவில் ரிங் ரோடு, மதுரை, தமிழ்நாடு 625001'
                    : '123 Temple Ring Road, Madurai, Tamil Nadu 625001'}
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>info@amuthasurabi.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-amber-900/60 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-amber-200/60">
          <p>
            © {new Date().getFullYear()} {t('brandName')} Restaurant. All rights reserved.
          </p>
          <p className="flex items-center space-x-1 mt-2 sm:mt-0">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-current inline" />
            <span>for South Indian Food Lovers</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
