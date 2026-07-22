'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { X, Plus, Minus, Trash2, ShoppingBag, MessageSquare } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, removeFromCart, updateQuantity, clearCart, subtotal, gstAmount, grandTotal } =
    useCart();
  const { language, t } = useLanguage();

  if (!isOpen) return null;

  const handleWhatsAppCheckout = () => {
    if (cart.length === 0) return;

    let text = `*New Order - Amutha Surabi Restaurant*\n\n`;
    cart.forEach((item, index) => {
      text += `${index + 1}. ${language === 'ta' ? item.nameTa : item.name} x ${item.quantity} = ₹${
        item.price * item.quantity
      }\n`;
    });
    text += `\n*Subtotal:* ₹${subtotal}`;
    text += `\n*GST (5%):* ₹${gstAmount}`;
    text += `\n*Grand Total:* ₹${grandTotal}`;
    text += `\n\nPlease confirm my order!`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/919876543210?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-sm transition-opacity animate-fadeIn">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 bg-gradient-to-r from-brand-maroon-900 to-brand-maroon-800 text-white flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-bold">{t('cartTitle')}</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 py-12">
                <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center text-brand-orange-600 mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="text-base font-semibold">{t('cartEmpty')}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {language === 'ta'
                    ? 'சுவையான தோசை, பிரியாணி போன்றவற்றை சேர்க்கவும்.'
                    : 'Add items from our delicious menu.'}
                </p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.foodId}
                  className="flex items-center justify-between p-3 border border-gray-100 rounded-xl bg-orange-50/30 hover:shadow-sm transition-all"
                >
                  <div className="flex items-center space-x-3">
                    <span
                      className={`w-3 h-3 rounded-full shrink-0 border ${
                        item.isVeg ? 'bg-emerald-600 border-emerald-700' : 'bg-red-600 border-red-700'
                      }`}
                      title={item.isVeg ? 'Veg' : 'Non-Veg'}
                    />
                    <div>
                      <h4 className="text-sm font-bold text-gray-800">
                        {language === 'ta' ? item.nameTa : item.name}
                      </h4>
                      <p className="text-xs text-brand-orange-600 font-semibold mt-0.5">
                        ₹{item.price} x {item.quantity} = ₹{item.price * item.quantity}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="flex items-center border border-gray-200 rounded-lg bg-white">
                      <button
                        onClick={() => updateQuantity(item.foodId, -1)}
                        className="p-1 text-gray-600 hover:bg-gray-100 rounded-l-lg"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-2.5 text-xs font-bold text-gray-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.foodId, 1)}
                        className="p-1 text-gray-600 hover:bg-gray-100 rounded-r-lg"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.foodId)}
                      className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Summary */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-gray-200 bg-gray-50 space-y-3">
              <div className="space-y-1 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>{t('subtotal')}</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('gst')}</span>
                  <span>₹{gstAmount}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-gray-900 pt-2 border-t border-gray-200">
                  <span>{t('total')}</span>
                  <span className="text-brand-orange-600">₹{grandTotal}</span>
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <button
                  onClick={handleWhatsAppCheckout}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center space-x-2 transition-all shadow-md active:scale-98"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>Order via WhatsApp</span>
                </button>
                <button
                  onClick={clearCart}
                  className="w-full text-center text-xs font-semibold text-gray-500 hover:text-red-600 py-1"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
