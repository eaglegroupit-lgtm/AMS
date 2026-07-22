'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import {
  Utensils,
  Flame,
  Star,
  Clock,
  ChevronRight,
  ChevronLeft,
  ShoppingBag,
  Phone,
  MessageCircle,
  Award,
  Sparkles,
  MapPin,
  Quote,
  ThumbsUp,
} from 'lucide-react';

interface FoodItem {
  id: string;
  name: string;
  nameTa: string;
  description: string;
  descriptionTa: string;
  price: number;
  isVeg: boolean;
  spicyLevel: number;
  isFeatured: boolean;
  isTodaySpecial: boolean;
  category: { name: string; nameTa: string };
  images: { url: string }[];
}

export default function HomePage() {
  const { language, t } = useLanguage();
  const { addToCart } = useCart();
  const [todaysSpecials, setTodaysSpecials] = useState<FoodItem[]>([]);
  const [popularDishes, setPopularDishes] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDishes() {
      try {
        const res = await fetch('/api/foods');
        if (res.ok) {
          const data: FoodItem[] = await res.json();
          setTodaysSpecials(data.filter((item) => item.isTodaySpecial));
          setPopularDishes(data.filter((item) => item.isFeatured));
        }
      } catch (e) {
        console.error('Failed to fetch home foods', e);
      } finally {
        setLoading(false);
      }
    }
    fetchDishes();
  }, []);

  const categories = [
    {
      id: 'breakfast',
      name: 'Breakfast',
      nameTa: 'காலை உணவு',
      icon: '🥞',
      desc: 'Idli, Dosa, Vada & Pongal',
    },
    {
      id: 'lunch',
      name: 'Lunch',
      nameTa: 'மதிய உணவு',
      icon: '🍱',
      desc: 'Banana Leaf Meals & Biryani',
    },
    {
      id: 'dinner',
      name: 'Dinner',
      nameTa: 'இரவு உணவு',
      icon: '🫓',
      desc: 'Bun Parotta, Kothu & Uthappam',
    },
    {
      id: 'snacks',
      name: 'Snacks',
      nameTa: 'சிற்றுண்டி',
      icon: '🥟',
      desc: 'Bajji, Samosa & Cutlets',
    },
    {
      id: 'coffee',
      name: 'Beverages',
      nameTa: 'பானங்கள்',
      icon: '☕',
      desc: 'Degree Coffee & Jigarthanda',
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      id: 1,
      badge: language === 'ta' ? 'மதுரையின் பாரம்பரிய சுவை' : 'Madurai Traditional Culinary Excellence',
      titleEn: (
        <>
          Authentic <span className="text-amber-400">South Indian</span> Heritage & Feast!
        </>
      ),
      titleTa: (
        <>
          அசலான <span className="text-amber-400">தென்னிந்திய</span> சுவை மற்றும் பாரம்பரிய விருந்து!
        </>
      ),
      subtitle:
        language === 'ta'
          ? 'மணமணக்கும் நெய் ரோஸ்ட், மல்லிப்பூ இட்லி, காரசாரமான செட்டிநாடு பிரியாணி மற்றும் மதுரை ஜிகர்தண்டா சுவையுங்கள்.'
          : 'Savor crisp Ghee Roast Dosa, soft Malli Poo Idli, fiery Chettinad Biryani, and authentic Kumbakonam Degree Coffee.',
      image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=1000&auto=format&fit=crop&q=80',
      highlightTag: 'Today\'s Highlight',
      highlightItem: 'Ghee Roast & Jigarthanda',
    },
    {
      id: 2,
      badge: language === 'ta' ? 'ஞாயிறு செட்டிநாடு சிறப்பு' : 'Sunday Chettinad Special Feast',
      titleEn: (
        <>
          Fiery <span className="text-amber-400">Chettinad Biryani</span> & Mutton Chukka!
        </>
      ),
      titleTa: (
        <>
          காரசாரமான <span className="text-amber-400">செட்டிநாடு பிரியாணி</span> & மட்டன் சுக்கா!
        </>
      ),
      subtitle:
        language === 'ta'
          ? 'சீரக சம்பா அரிசியில் காரைக்குடி நறுமண மசாலாக்களுடன் சுடச்சுட சமைக்கப்பட்ட அசல் பிரியாணி விருந்து.'
          : 'Cooked with aromatic Seeraga Samba rice and freshly ground Karaikudi spices on traditional woodfire flames.',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=1000&auto=format&fit=crop&q=80',
      highlightTag: 'Weekend Special',
      highlightItem: 'Free Jigarthanda on Orders > ₹500',
    },
    {
      id: 3,
      badge: language === 'ta' ? 'சுத்தமான நெய் உணவு வகைகள்' : 'Pure Desi Ghee Breakfast',
      titleEn: (
        <>
          Golden <span className="text-amber-400">Crisp Dosa</span> & Filter Coffee!
        </>
      ),
      titleTa: (
        <>
          மொறுமொறு <span className="text-amber-400">நெய் தோசை</span> & டிகிரி காபி!
        </>
      ),
      subtitle:
        language === 'ta'
          ? 'சுத்தமான பசு நெய்யில் சுடப்பட்ட மெல்லிய தோசை, சாம்பார் மற்றும் 3 வகை சட்னியுடன் கும்பகோணம் டிகிரி காபி.'
          : 'Handcrafted breakfast treats smeared with pure desi cow ghee, served with 3 coconut chutneys and hot sambar.',
      image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=1000&auto=format&fit=crop&q=80',
      highlightTag: 'Breakfast Combo',
      highlightItem: 'Ghee Roast + Degree Coffee @ ₹135',
    },
  ];

  // Carousel Auto Slider Effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  return (
    <div className="space-y-16 pb-12">
      {/* 1. HERO BANNER CAROUSEL SECTION */}
      <section className="relative min-h-[85vh] flex items-center bg-gradient-to-br from-brand-maroon-900 via-brand-maroon-800 to-black text-white overflow-hidden group">
        {/* Background Overlay Graphic */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/20 via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:24px_24px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 w-full">
          {/* Left Column Text (Slide Content) */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left transition-all duration-700 transform">
            <div className="inline-flex items-center space-x-2 bg-amber-400/20 border border-amber-400/40 text-amber-300 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md animate-fadeIn">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{heroSlides[currentSlide].badge}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight animate-fadeIn">
              {language === 'ta'
                ? heroSlides[currentSlide].titleTa
                : heroSlides[currentSlide].titleEn}
            </h1>

            <p className="text-base sm:text-lg text-amber-100/80 max-w-2xl leading-relaxed mx-auto lg:mx-0 animate-fadeIn">
              {heroSlides[currentSlide].subtitle}
            </p>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <Link
                href="/menu"
                className="bg-gradient-to-r from-brand-orange-500 to-amber-500 hover:from-brand-orange-600 hover:to-amber-600 text-white font-bold px-7 py-3.5 rounded-2xl shadow-xl hover:shadow-amber-500/25 transition-all flex items-center space-x-2 text-base active:scale-95"
              >
                <Utensils className="w-5 h-5" />
                <span>{t('orderNow')}</span>
              </Link>

              <a
                href="https://wa.me/919876543210?text=Hello%20Amutha%20Surabi!%20I%20want%20to%20place%20an%20order."
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3.5 rounded-2xl shadow-lg transition-all flex items-center space-x-2 text-base active:scale-95"
              >
                <MessageCircle className="w-5 h-5" />
                <span>WhatsApp</span>
              </a>

              <a
                href="tel:+919876543210"
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold px-5 py-3.5 rounded-2xl transition-all flex items-center space-x-2 text-base backdrop-blur-md"
              >
                <Phone className="w-5 h-5 text-amber-400" />
                <span>Call Now</span>
              </a>
            </div>

            {/* Highlights Bar */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-amber-500/20 text-center lg:text-left">
              <div>
                <p className="text-2xl font-black text-amber-400">100%</p>
                <p className="text-xs text-amber-200/70">Pure Desi Ghee</p>
              </div>
              <div>
                <p className="text-2xl font-black text-amber-400">4.9 ★</p>
                <p className="text-xs text-amber-200/70">5,000+ Reviews</p>
              </div>
              <div>
                <p className="text-2xl font-black text-amber-400">Fresh</p>
                <p className="text-xs text-amber-200/70">Daily Ground Spices</p>
              </div>
            </div>
          </div>

          {/* Right Column Hero Food Image (Dynamic Carousel Slide Image) */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-72 h-72 sm:w-96 sm:h-96 lg:w-[420px] lg:h-[420px] rounded-full p-3 bg-gradient-to-tr from-amber-400 via-brand-orange-500 to-brand-maroon-700 shadow-2xl ring-8 ring-amber-400/20 transition-transform duration-700 hover:scale-105">
              <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white">
                <Image
                  key={heroSlides[currentSlide].id}
                  src={heroSlides[currentSlide].image}
                  alt="South Indian Special Feast"
                  fill
                  priority
                  className="object-cover transition-all duration-700 animate-fadeIn"
                />
              </div>
            </div>

            {/* Floating Offer Badge */}
            <div className="absolute -bottom-4 -left-2 sm:bottom-4 sm:left-4 bg-white text-gray-900 p-4 rounded-2xl shadow-2xl border border-amber-300 flex items-center space-x-3 backdrop-blur-md animate-fadeIn">
              <div className="p-3 bg-orange-100 text-brand-orange-600 rounded-xl">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold">
                  {heroSlides[currentSlide].highlightTag}
                </p>
                <p className="text-sm font-black text-brand-maroon-900">
                  {heroSlides[currentSlide].highlightItem}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Navigation Arrow Buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/40 hover:bg-amber-500 text-white hover:text-gray-900 border border-white/20 transition-all shadow-xl backdrop-blur-md opacity-70 group-hover:opacity-100"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/40 hover:bg-amber-500 text-white hover:text-gray-900 border border-white/20 transition-all shadow-xl backdrop-blur-md opacity-70 group-hover:opacity-100"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Carousel Pagination Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-2">
          {heroSlides.map((slide, idx) => (
            <button
              key={slide.id}
              onClick={() => setCurrentSlide(idx)}
              className={`transition-all duration-300 rounded-full ${
                currentSlide === idx
                  ? 'w-8 h-2.5 bg-amber-400 shadow-lg'
                  : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* 2. CATEGORIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">
            {language === 'ta' ? 'உணவு பிரிவுகள்' : 'Explore Our Categories'}
          </h2>
          <p className="text-sm text-gray-600">
            {language === 'ta'
              ? 'காலை முதல் இரவு வரை அறுசுவை உணவுகள்'
              : 'From morning idlis to evening filter coffee'}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/menu?category=${cat.id}`}
              className="group bg-white rounded-2xl p-6 text-center border border-gray-100 shadow-sm hover:shadow-xl hover:border-amber-300 transition-all transform hover:-translate-y-1"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-orange-50 text-3xl flex items-center justify-center group-hover:scale-110 group-hover:bg-brand-orange-500 transition-all">
                {cat.icon}
              </div>
              <h3 className="font-bold text-gray-800 group-hover:text-brand-orange-600 transition-colors">
                {language === 'ta' ? cat.nameTa : cat.name}
              </h3>
              <p className="text-xs text-gray-400 mt-1">{cat.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. TODAY'S SPECIAL SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-orange-100">
          <div>
            <div className="inline-flex items-center space-x-2 text-brand-orange-600 font-bold text-xs uppercase tracking-wider mb-1">
              <Flame className="w-4 h-4" />
              <span>Chef's Choice</span>
            </div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">
              {t('todaysSpecial')}
            </h2>
          </div>
          <Link
            href="/menu"
            className="mt-4 sm:mt-0 text-sm font-bold text-brand-orange-600 hover:text-brand-orange-700 flex items-center space-x-1"
          >
            <span>{t('viewFullMenu')}</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-2xl h-80 animate-pulse bg-gray-100" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {todaysSpecials.map((food) => (
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
                    <div className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow">
                      Special
                    </div>
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
                    <h3 className="font-extrabold text-lg text-gray-900 group-hover:text-brand-orange-600 transition-colors">
                      {language === 'ta' ? food.nameTa : food.name}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2">
                      {language === 'ta' ? food.descriptionTa : food.description}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 flex items-center justify-between border-t border-gray-50 mt-2">
                  <span className="text-xl font-black text-brand-orange-600">₹{food.price}</span>
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
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. POPULAR DISHES SECTION */}
      <section className="bg-orange-50/50 py-16 border-y border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">
              {t('popularDishes')}
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              {language === 'ta'
                ? 'எங்கள் வாடிக்கையாளர்களால் அதிகம் விரும்பி உண்ணப்படும் உணவுகள்'
                : 'Loved by thousands of food lovers across Madurai & Tamil Nadu'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularDishes.map((food) => (
              <div
                key={food.id}
                className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div className="relative h-44 w-full rounded-xl overflow-hidden mb-3 bg-gray-100">
                  <Image
                    src={
                      food.images?.[0]?.url ||
                      'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=800&auto=format&fit=crop&q=80'
                    }
                    alt={food.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-base">
                    {language === 'ta' ? food.nameTa : food.name}
                  </h4>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-base font-black text-brand-orange-600">₹{food.price}</span>
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
                      className="bg-orange-100 hover:bg-brand-orange-600 hover:text-white text-brand-orange-700 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                    >
                      + Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CUSTOMER REVIEWS WITH GRAPHICS & AVATARS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-orange-500/10 via-brand-maroon-900/5 to-amber-500/10 rounded-3xl p-8 sm:p-12 border border-amber-200/50 shadow-sm">
          <div className="text-center space-y-3 mb-12">
            <div className="inline-flex items-center space-x-2 bg-brand-maroon-900 text-amber-300 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow">
              <Quote className="w-3.5 h-3.5 fill-current" />
              <span>{language === 'ta' ? 'வாடிக்கையாளர் சான்றுகள்' : 'Verified Reviews'}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
              {t('customerReviews')}
            </h2>
            <p className="text-sm text-gray-600 max-w-xl mx-auto">
              {language === 'ta'
                ? 'எங்கள் உணவகத்திற்கு வருகை தந்த 5,000க்கும் மேற்பட்ட உணவுப் பிரியர்களின் நேர்மறை கருத்துக்கள்'
                : 'Loved by thousands of food lovers across Madurai & South India'}
            </p>

            {/* Aggregated Rating Banner Graphic */}
            <div className="pt-2 flex items-center justify-center space-x-6 text-xs font-bold text-gray-700">
              <div className="flex items-center space-x-1 bg-white px-3 py-1.5 rounded-full border border-amber-200 shadow-sm">
                <Star className="w-4 h-4 text-amber-500 fill-current" />
                <span className="text-gray-900 font-extrabold">4.9 / 5.0</span>
                <span className="text-gray-400">Rating</span>
              </div>
              <div className="flex items-center space-x-1 bg-white px-3 py-1.5 rounded-full border border-emerald-200 shadow-sm text-emerald-700">
                <ThumbsUp className="w-3.5 h-3.5 fill-current" />
                <span>99% Recommended</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sundar Raman',
                location: 'Madurai, TN',
                rating: 5,
                review:
                  'Best Ghee Roast Dosa and Kumbakonam Filter Coffee in town! Tastes just like home. The atmosphere is warm and welcoming.',
                favoriteDish: 'Special Ghee Roast Dosa',
                avatar: '/reviews/avatar1.png',
              },
              {
                name: 'Kavitha Murugan',
                location: 'Chennai, TN',
                rating: 5,
                review:
                  'The Chettinad Biryani and Madurai Jigarthanda were top notch. Outstanding traditional presentation on banana leaf!',
                favoriteDish: 'Chettinad Chicken Biryani',
                avatar: '/reviews/avatar2.png',
              },
              {
                name: 'Anand Kumar & Family',
                location: 'Coimbatore, TN',
                rating: 5,
                review:
                  'Super soft Malli Poo Idly and hot Sambar. Highly recommended for authentic South Indian breakfast with family.',
                favoriteDish: 'Malli Poo Idli & Pongal',
                avatar: '/reviews/avatar3.png',
              },
            ].map((rev, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl p-6 border border-amber-100 shadow-lg hover:shadow-2xl transition-all relative flex flex-col justify-between group transform hover:-translate-y-1"
              >
                {/* Decorative Quote Watermark Graphic */}
                <div className="absolute top-4 right-4 text-brand-orange-500/10 group-hover:text-brand-orange-500/20 transition-colors pointer-events-none">
                  <Quote className="w-16 h-16 fill-current" />
                </div>

                <div className="space-y-4 relative z-10">
                  {/* Rating Stars & Favorite Tag */}
                  <div className="flex items-center justify-between">
                    <div className="flex text-amber-400">
                      {[...Array(rev.rating)].map((_, idx) => (
                        <Star key={idx} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-[10px] font-bold text-brand-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100">
                      ♥ {rev.favoriteDish}
                    </span>
                  </div>

                  <p className="text-gray-700 text-xs sm:text-sm leading-relaxed italic">
                    "{rev.review}"
                  </p>
                </div>

                {/* Customer Graphic Avatar & Info */}
                <div className="pt-4 mt-4 border-t border-gray-100 flex items-center space-x-3 relative z-10">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-amber-400 shadow-md shrink-0">
                    <Image
                      src={rev.avatar}
                      alt={rev.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-gray-900 group-hover:text-brand-orange-600 transition-colors">
                      {rev.name}
                    </h4>
                    <div className="flex items-center space-x-1 text-[10px] text-gray-500 font-medium">
                      <span className="text-emerald-600 font-bold">✓ Verified Order</span>
                      <span>•</span>
                      <span>{rev.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. GOOGLE MAP & CONTACT TEASER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="bg-gradient-to-r from-brand-maroon-900 to-black text-white rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-6 p-8 lg:p-12 space-y-6 flex flex-col justify-center">
            <div className="inline-flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <MapPin className="w-4 h-4" />
              <span>Visit Our Restaurant</span>
            </div>
            <h2 className="text-3xl font-black text-white leading-tight">
              {language === 'ta'
                ? 'எங்கள் உணவகத்திற்கு நேரில் வருகை தந்து பாரம்பரிய சுவையை அனுபவியுங்கள்!'
                : 'Experience Authentic South Indian Hospitality in Madurai!'}
            </h2>
            <p className="text-amber-100/80 text-sm leading-relaxed">
              {language === 'ta'
                ? '123 கோவில் ரிங் ரோடு, மதுரை. குடும்பத்துடன் வந்து அறுசுவை உணவை சுவையுங்கள்.'
                : 'Located at 123 Temple Ring Road, Madurai. Open daily from 7:00 AM to 11:00 PM.'}
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="bg-amber-400 hover:bg-amber-300 text-brand-maroon-900 font-black px-6 py-3 rounded-xl text-sm transition-all"
              >
                {t('contactUs')}
              </Link>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3 rounded-xl text-sm border border-white/20 transition-all"
              >
                Get Directions
              </a>
            </div>
          </div>

          <div className="lg:col-span-6 h-80 lg:h-auto min-h-[320px] relative">
            <iframe
              title="Google Map Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15724.896695270114!2d78.118742!3d9.925201!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b00c582b1189633%3A0xdc28892485303 shadow!2sMadurai%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1680000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              className="absolute inset-0 w-full h-full grayscale hover:grayscale-0 transition-all duration-500"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
