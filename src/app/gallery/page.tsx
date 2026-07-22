'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { Camera, Image as ImageIcon } from 'lucide-react';

export default function GalleryPage() {
  const { language, t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<'all' | 'food' | 'restaurant' | 'kitchen' | 'events'>('all');

  const galleryItems = [
    {
      id: '1',
      category: 'food',
      title: 'Special Ghee Roast Dosa',
      titleTa: 'ஸ்பெஷல் நெய் ரோஸ்ட் தோசை',
      url: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: '2',
      category: 'food',
      title: 'South Indian Grand Feast',
      titleTa: 'தென்னிந்திய சாப்பாடு',
      url: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: '3',
      category: 'food',
      title: 'Chettinad Chicken Biryani',
      titleTa: 'செட்டிநாடு சிக்கன் பிரியாணி',
      url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: '4',
      category: 'restaurant',
      title: 'Traditional Dining Ambiance',
      titleTa: 'பாரம்பரிய உணவக சூழல்',
      url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: '5',
      category: 'kitchen',
      title: 'Hygienic Modern Kitchen',
      titleTa: 'சுத்தமான நவீன சமையலறை',
      url: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: '6',
      category: 'events',
      title: 'Festival Catering Event',
      titleTa: 'விழா கேட்டரிங் நிகழ்வு',
      url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: '7',
      category: 'food',
      title: 'Kumbakonam Degree Coffee',
      titleTa: 'கும்பகோணம் டிகிரி காபி',
      url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: '8',
      category: 'food',
      title: 'Madurai Jigarthanda',
      titleTa: 'மதுரை ஜிகர்தண்டா',
      url: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&auto=format&fit=crop&q=80',
    },
  ];

  const filteredItems = galleryItems.filter(
    (item) => activeCategory === 'all' || item.category === activeCategory
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight">
          {t('photoGallery')}
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Take a visual journey through our kitchen, ambiance, dishes, and catering events.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex justify-center items-center space-x-2 overflow-x-auto pb-2">
        {[
          { key: 'all', label: t('all') },
          { key: 'food', label: t('food') },
          { key: 'restaurant', label: t('restaurant') },
          { key: 'kitchen', label: t('kitchen') },
          { key: 'events', label: t('events') },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveCategory(tab.key as any)}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeCategory === tab.key
                ? 'bg-brand-orange-600 text-white shadow-md'
                : 'bg-white border border-gray-200 text-gray-700 hover:border-brand-orange-400'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Image Masonry Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="group relative h-72 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100"
          >
            <Image
              src={item.url}
              alt={item.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                {item.category}
              </span>
              <h3 className="text-white font-bold text-base">
                {language === 'ta' ? item.titleTa : item.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
