'use client';

import React from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { ShieldCheck, Award, Heart, Sparkles, Utensils, Users } from 'lucide-react';

export default function AboutPage() {
  const { language, t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-brand-orange-600 font-bold text-xs uppercase tracking-wider">
          {t('brandTagline')}
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight">
          {t('ourStory')}
        </h1>
        <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
          {language === 'ta'
            ? '1985 முதல் மதுரையின் நெஞ்சில் நிலைத்து நிற்கும் பாரம்பரிய சுவை மற்றும் உபசரிப்பு.'
            : 'Preserving authentic South Indian culinary traditions with uncompromised quality since 1985.'}
        </p>
      </div>

      {/* History Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-maroon-900">
            {language === 'ta'
              ? 'சுத்தமான நெய் & பாரம்பரிய மசாலாக்களின் சங்கமம்'
              : 'Heritage Cooked with Passion & Pure Desi Ghee'}
          </h2>
          <p className="text-gray-700 text-sm leading-relaxed">
            {language === 'ta'
              ? 'அமுதா சுரபி உணவகம் மதுரை மாநகரின் மையப்பகுதியில் ஒரு சிறிய உணவகமாகத் தொடங்கி, இன்று ஆயிரக்கணக்கான உணவுப் பிரியர்களின் இதயங்களில் இடம் பிடித்துள்ளது. எங்களது ஒவ்வொரு உணவும் எங்கள் பாட்டியின் கைமணத்துடனும், தினமும் அரைக்கப்படும் புதிய நறுமண மசாலாக்களுடனும் சமைக்கப்படுகிறது.'
              : 'Amutha Surabi Restaurant started as a humble eatery in the heart of Madurai and has grown into a beloved culinary landmark. Every dosa is crafted with pure ghee, and every biryani is cooked with freshly pounded Karaikudi spices on traditional firewood flames.'}
          </p>

          <div className="pt-4 grid grid-cols-2 gap-4">
            <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100">
              <h4 className="font-extrabold text-brand-orange-600 text-xl">35+ Years</h4>
              <p className="text-xs text-gray-600 mt-0.5">Culinary Legacy</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100">
              <h4 className="font-extrabold text-brand-orange-600 text-xl">100% Pure</h4>
              <p className="text-xs text-gray-600 mt-0.5">Desi Cow Ghee</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 relative h-96 rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-300">
          <Image
            src="https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=1000&auto=format&fit=crop&q=80"
            alt="Amutha Surabi Heritage Feast"
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-brand-maroon-900 to-brand-maroon-800 text-white p-8 rounded-3xl space-y-3 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-brand-maroon-900 flex items-center justify-center font-bold">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-black">{t('mission')}</h3>
          <p className="text-amber-100/80 text-sm leading-relaxed">
            To serve unadulterated, wholesome, and delicious South Indian food prepared with utmost hygiene, traditional techniques, and genuine hospitality to every guest.
          </p>
        </div>

        <div className="bg-gradient-to-br from-brand-orange-600 to-amber-600 text-white p-8 rounded-3xl space-y-3 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-white text-brand-orange-600 flex items-center justify-center font-bold">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-black">{t('vision')}</h3>
          <p className="text-white/90 text-sm leading-relaxed">
            To be global ambassadors of authentic Chettinad & Madurai cuisine, making traditional South Indian flavors accessible while upholding high standards of quality.
          </p>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-black text-gray-900">{t('whyChooseUs')}</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: t('freshIngredients'),
              desc: 'We never compromise on purity. No artificial colors or preservatives.',
              icon: ShieldCheck,
            },
            {
              title: t('hygienicKitchen'),
              desc: 'State of the art stainless steel kitchen with daily sanitization protocols.',
              icon: Utensils,
            },
            {
              title: t('quickService'),
              desc: 'Friendly traditional welcome and quick table service with a smile.',
              icon: Users,
            },
            {
              title: t('authenticTaste'),
              desc: 'Recipes passed down through generations of master Chettinad chefs.',
              icon: Heart,
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-3 hover:shadow-lg transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-brand-orange-600 flex items-center justify-center">
                <item.icon className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-gray-900 text-base">{item.title}</h4>
              <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
