'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { Search, Filter, ShoppingBag, Flame, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  nameTa: string;
  slug: string;
}

interface FoodItem {
  id: string;
  name: string;
  nameTa: string;
  description: string;
  descriptionTa: string;
  price: number;
  discount: number;
  isVeg: boolean;
  spicyLevel: number;
  prepTimeMinutes: number;
  isAvailable: boolean;
  isTodaySpecial: boolean;
  category: Category;
  images: { url: string }[];
}

export default function MenuPage() {
  const { language, t } = useLanguage();
  const { addToCart } = useCart();

  const [categories, setCategories] = useState<Category[]>([]);
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dietFilter, setDietFilter] = useState<'all' | 'veg' | 'non-veg'>('all');

  useEffect(() => {
    async function loadData() {
      try {
        const [catRes, foodRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/foods'),
        ]);

        if (catRes.ok) setCategories(await catRes.json());
        if (foodRes.ok) setFoods(await foodRes.json());
      } catch (e) {
        console.error('Failed to load menu data', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredFoods = foods.filter((food) => {
    // Category filter
    if (selectedCategory !== 'all' && food.category.slug !== selectedCategory) {
      return false;
    }
    // Diet filter
    if (dietFilter === 'veg' && !food.isVeg) return false;
    if (dietFilter === 'non-veg' && food.isVeg) return false;

    // Search query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchEn = food.name.toLowerCase().includes(q) || food.description.toLowerCase().includes(q);
      const matchTa = food.nameTa.includes(q) || food.descriptionTa.includes(q);
      if (!matchEn && !matchTa) return false;
    }

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight">
          {t('navMenu')}
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          {language === 'ta'
            ? 'சுத்தமான நெய் மற்றும் பாரம்பரிய நறுமண மசாலாக்களுடன் தயார் செய்யப்படும் அறுசுவை உணவுகள்.'
            : 'Explore our full menu of crisp dosas, rich biryanis, aromatic curries, and refreshing filter coffee.'}
        </p>
      </div>

      {/* Search & Diet Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-orange-500 text-sm"
          />
        </div>

        {/* Diet Buttons (All, Veg, Non-Veg) */}
        <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setDietFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              dietFilter === 'all'
                ? 'bg-gray-900 text-white shadow'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {t('allDishes')}
          </button>
          <button
            onClick={() => setDietFilter('veg')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              dietFilter === 'veg'
                ? 'bg-emerald-600 text-white shadow'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>{t('vegOnly')}</span>
          </button>
          <button
            onClick={() => setDietFilter('non-veg')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              dietFilter === 'non-veg'
                ? 'bg-red-600 text-white shadow'
                : 'bg-red-50 text-red-700 hover:bg-red-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-400" />
            <span>{t('nonVegOnly')}</span>
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
            selectedCategory === 'all'
              ? 'bg-brand-orange-600 text-white shadow-md'
              : 'bg-white border border-gray-200 text-gray-700 hover:border-brand-orange-400'
          }`}
        >
          {t('all')}
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.slug)}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat.slug
                ? 'bg-brand-orange-600 text-white shadow-md'
                : 'bg-white border border-gray-200 text-gray-700 hover:border-brand-orange-400'
            }`}
          >
            {language === 'ta' ? cat.nameTa : cat.name}
          </button>
        ))}
      </div>

      {/* Menu Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="bg-white rounded-2xl h-80 animate-pulse bg-gray-100" />
          ))}
        </div>
      ) : filteredFoods.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-gray-200">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-800">No dishes found</h3>
          <p className="text-xs text-gray-500 mt-1">Try clearing filters or searching another keyword.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredFoods.map((food) => (
            <div
              key={food.id}
              className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-52 w-full overflow-hidden bg-gray-100">
                  <Image
                    src={
                      food.images?.[0]?.url ||
                      'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=800&auto=format&fit=crop&q=80'
                    }
                    alt={food.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {food.isTodaySpecial && (
                    <div className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow">
                      Today Special
                    </div>
                  )}
                  <div
                    className={`absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-bold border ${
                      food.isVeg
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                        : 'bg-red-50 text-red-700 border-red-300'
                    }`}
                  >
                    {food.isVeg ? 'VEG' : 'NON-VEG'}
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <div className="flex items-start justify-between">
                    <h3 className="font-extrabold text-lg text-gray-900 group-hover:text-brand-orange-600 transition-colors">
                      {language === 'ta' ? food.nameTa : food.name}
                    </h3>
                  </div>

                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                    {language === 'ta' ? food.descriptionTa : food.description}
                  </p>

                  <div className="pt-2 flex items-center space-x-4 text-[11px] text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Flame className="w-3.5 h-3.5 text-orange-500" />
                      <span>
                        Spice: {'🌶️'.repeat(food.spicyLevel)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      <span>{food.prepTimeMinutes} mins</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 flex items-center justify-between border-t border-gray-50 mt-2">
                <div>
                  <span className="text-xl font-black text-brand-orange-600">₹{food.price}</span>
                  {food.discount > 0 && (
                    <span className="text-xs text-gray-400 line-through ml-2">
                      ₹{food.price + food.discount}
                    </span>
                  )}
                </div>

                {food.isAvailable ? (
                  <button
                    onClick={() =>
                      addToCart({
                        id: food.id,
                        name: food.name,
                        nameTa: food.nameTa,
                        price: food.price,
                        isVeg: food.isVeg,
                        imageUrl: food.images?.[0]?.url,
                      })
                    }
                    className="bg-brand-orange-600 hover:bg-brand-orange-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors shadow-sm active:scale-95"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>{t('addToCart')}</span>
                  </button>
                ) : (
                  <span className="text-xs font-bold text-red-500 bg-red-50 px-3 py-1 rounded-lg">
                    Unavailable
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
