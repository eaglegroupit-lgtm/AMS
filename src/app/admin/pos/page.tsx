'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  Minus,
  Trash2,
  Printer,
  FileText,
  CreditCard,
  User,
  Phone,
  Hash,
  CheckCircle,
  AlertCircle,
  Utensils,
} from 'lucide-react';
import { jsPDF } from 'jspdf';

interface FoodItem {
  id: string;
  name: string;
  nameTa: string;
  price: number;
  isVeg: boolean;
  category: { slug: string; name: string };
}

interface CartItem extends FoodItem {
  quantity: number;
}

export default function POSBillingPage() {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [categories, setCategories] = useState<{ id: string; slug: string; name: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  // POS State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [tableNumber, setTableNumber] = useState<string>('T1');
  const [customerName, setCustomerName] = useState<string>('Walk-in Guest');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'UPI' | 'CARD'>('CASH');
  const [discount, setDiscount] = useState<number>(0);

  // Modal / Receipt state
  const [lastBill, setLastBill] = useState<any>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [fRes, cRes] = await Promise.all([fetch('/api/foods'), fetch('/api/categories')]);
        if (fRes.ok) setFoods(await fRes.json());
        if (cRes.ok) setCategories(await cRes.json());
      } catch (e) {
        console.error('POS data load error', e);
      }
    }
    loadData();
  }, []);

  const addToCart = (food: FoodItem) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === food.id);
      if (existing) {
        return prev.map((item) =>
          item.id === food.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...food, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const gstAmount = Math.round(subtotal * 0.05 * 100) / 100;
  const grandTotal = Math.round((subtotal - discount + gstAmount) * 100) / 100;

  const handleCreateBill = async () => {
    if (cart.length === 0) return;
    setLoading(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tableNumber,
          customerName,
          customerPhone,
          items: cart,
          discount,
          paymentMethod,
        }),
      });

      const orderData = await res.json();
      if (!res.ok) throw new Error(orderData.error || 'Failed to create bill');

      setLastBill(orderData);
      setIsReceiptModalOpen(true);

      // Clear cart
      setCart([]);
      setDiscount(0);
    } catch (e: any) {
      alert(e.message || 'Failed to generate bill');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    if (!lastBill) return;
    const doc = new jsPDF({ unit: 'mm', format: [80, 200] });

    doc.setFontSize(14);
    doc.text('AMUTHA SURABI RESTAURANT', 40, 10, { align: 'center' });
    doc.setFontSize(8);
    doc.text('123 Temple Ring Road, Madurai', 40, 15, { align: 'center' });
    doc.text('GSTIN: 33AAAAA0000A1Z5 | Ph: +91 98765 43210', 40, 19, { align: 'center' });
    doc.text('---------------------------------------------------------', 40, 23, { align: 'center' });

    doc.text(`Bill No: ${lastBill.billNumber}`, 5, 28);
    doc.text(`Table: ${lastBill.tableNumber || 'N/A'}`, 5, 33);
    doc.text(`Customer: ${lastBill.customerName}`, 5, 38);
    doc.text(`Date: ${new Date(lastBill.createdAt).toLocaleString()}`, 5, 43);
    doc.text('---------------------------------------------------------', 40, 47, { align: 'center' });

    let y = 52;
    lastBill.items.forEach((item: any, i: number) => {
      doc.text(`${i + 1}. ${item.foodName}`, 5, y);
      doc.text(`${item.quantity} x ${item.price} = ${item.total}`, 75, y, { align: 'right' });
      y += 5;
    });

    doc.text('---------------------------------------------------------', 40, y, { align: 'center' });
    y += 5;
    doc.text(`Subtotal: INR ${lastBill.subtotal}`, 75, y, { align: 'right' });
    y += 5;
    doc.text(`GST (5%): INR ${lastBill.gstAmount}`, 75, y, { align: 'right' });
    y += 5;
    doc.setFontSize(10);
    doc.text(`GRAND TOTAL: INR ${lastBill.grandTotal}`, 75, y, { align: 'right' });
    y += 8;
    doc.setFontSize(8);
    doc.text('Thank you! Visit Us Again!', 40, y, { align: 'center' });

    doc.save(`${lastBill.billNumber}.pdf`);
  };

  const filteredFoods = foods.filter((food) => {
    if (selectedCategory !== 'all' && food.category.slug !== selectedCategory) return false;
    if (search.trim() !== '') {
      const q = search.toLowerCase();
      return food.name.toLowerCase().includes(q) || food.nameTa.includes(q);
    }
    return true;
  });

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col lg:flex-row gap-6 overflow-hidden">
      {/* Left Menu Section */}
      <div className="flex-1 flex flex-col bg-slate-800/80 border border-slate-700/60 rounded-2xl p-4 overflow-hidden">
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between mb-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Quick search dish..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-brand-orange-500"
            />
          </div>

          <div className="flex items-center space-x-2">
            <select
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-xs font-bold text-amber-400 px-3 py-2 rounded-xl focus:outline-none"
            >
              {[...Array(15)].map((_, i) => (
                <option key={i} value={`T${i + 1}`}>
                  Table {i + 1}
                </option>
              ))}
              <option value="Takeaway">Takeaway Parcel</option>
            </select>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex space-x-2 overflow-x-auto pb-3 mb-2 shrink-0">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-brand-orange-600 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            All Items
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.slug
                  ? 'bg-brand-orange-600 text-white'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Food Item Grid */}
        <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 pr-1">
          {filteredFoods.map((food) => (
            <div
              key={food.id}
              onClick={() => addToCart(food)}
              className="bg-slate-900 border border-slate-800 hover:border-brand-orange-500/50 p-3 rounded-xl cursor-pointer transition-all flex flex-col justify-between group active:scale-95"
            >
              <div>
                <div className="flex justify-between items-start">
                  <span
                    className={`w-2 h-2 rounded-full ${food.isVeg ? 'bg-emerald-500' : 'bg-red-500'}`}
                  />
                  <span className="text-[10px] text-slate-500 font-semibold">{food.category.name}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-200 mt-1 line-clamp-1 group-hover:text-amber-400">
                  {food.name}
                </h4>
                <p className="text-[10px] text-slate-400">{food.nameTa}</p>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-slate-800/80 pt-2">
                <span className="text-xs font-black text-amber-400">₹{food.price}</span>
                <span className="bg-brand-orange-600/20 text-brand-orange-400 text-[10px] font-bold px-2 py-0.5 rounded">
                  + Add
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Billing Cart Panel */}
      <div className="w-full lg:w-96 bg-slate-800/80 border border-slate-700/60 rounded-2xl p-4 flex flex-col justify-between shrink-0">
        <div>
          <div className="border-b border-slate-700 pb-3 mb-3 flex items-center justify-between">
            <h3 className="font-extrabold text-white text-base">POS Order Cart</h3>
            <span className="text-xs text-amber-400 font-bold bg-slate-900 px-2 py-1 rounded">
              {tableNumber}
            </span>
          </div>

          {/* Customer Inputs */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <input
              type="text"
              placeholder="Guest Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none"
            />
          </div>

          {/* Items List */}
          <div className="max-h-[35vh] overflow-y-auto space-y-2 pr-1">
            {cart.length === 0 ? (
              <div className="text-center py-10 text-slate-500 text-xs">
                Click food items to add to bill cart
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2.5 bg-slate-900 rounded-xl border border-slate-800 text-xs"
                >
                  <div className="truncate pr-2">
                    <p className="font-bold text-slate-200 truncate">{item.name}</p>
                    <p className="text-[10px] text-amber-400">₹{item.price} x {item.quantity}</p>
                  </div>

                  <div className="flex items-center space-x-1.5 shrink-0">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="p-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-bold text-white px-1.5">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="p-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Totals & Payment Actions */}
        <div className="border-t border-slate-700 pt-3 space-y-3">
          <div className="space-y-1 text-xs text-slate-300">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Discount (₹):</span>
              <input
                type="number"
                min="0"
                value={discount}
                onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                className="w-16 px-1.5 py-0.5 bg-slate-900 border border-slate-700 rounded text-right text-xs text-amber-400 focus:outline-none"
              />
            </div>
            <div className="flex justify-between">
              <span>GST (5%):</span>
              <span>₹{gstAmount}</span>
            </div>
            <div className="flex justify-between font-black text-sm text-white pt-2 border-t border-slate-700">
              <span>Grand Total:</span>
              <span className="text-amber-400">₹{grandTotal}</span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="grid grid-cols-3 gap-2">
            {(['CASH', 'UPI', 'CARD'] as const).map((method) => (
              <button
                key={method}
                onClick={() => setPaymentMethod(method)}
                className={`py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                  paymentMethod === method
                    ? 'bg-amber-400 text-slate-900 shadow'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                {method}
              </button>
            ))}
          </div>

          <button
            onClick={handleCreateBill}
            disabled={cart.length === 0 || loading}
            className="w-full bg-gradient-to-r from-brand-orange-500 to-amber-500 hover:from-brand-orange-600 hover:to-amber-600 text-white font-bold py-3 rounded-xl shadow-lg transition-all text-xs active:scale-98 disabled:opacity-50"
          >
            {loading ? 'Processing Bill...' : 'Generate & Save Bill'}
          </button>
        </div>
      </div>

      {/* Printable Receipt Modal */}
      {isReceiptModalOpen && lastBill && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white text-gray-900 rounded-2xl max-w-sm w-full p-6 space-y-4">
            {/* Thermal Receipt Paper Layout */}
            <div id="printable-receipt" className="font-mono text-xs space-y-2">
              <div className="text-center border-b pb-2">
                <h2 className="font-extrabold text-sm uppercase">Amutha Surabi Restaurant</h2>
                <p className="text-[10px] text-gray-600">123 Temple Ring Road, Madurai</p>
                <p className="text-[10px] text-gray-600">GSTIN: 33AAAAA0000A1Z5</p>
              </div>

              <div className="space-y-0.5 text-[11px] border-b pb-2">
                <p>Bill No: {lastBill.billNumber}</p>
                <p>Table: {lastBill.tableNumber}</p>
                <p>Customer: {lastBill.customerName}</p>
                <p>Date: {new Date(lastBill.createdAt).toLocaleString()}</p>
              </div>

              <div className="space-y-1 border-b pb-2">
                {lastBill.items.map((item: any, i: number) => (
                  <div key={i} className="flex justify-between text-[11px]">
                    <span>
                      {item.foodName} x {item.quantity}
                    </span>
                    <span>₹{item.total}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-1 text-right text-[11px] border-b pb-2">
                <p>Subtotal: ₹{lastBill.subtotal}</p>
                {lastBill.discount > 0 && <p>Discount: -₹{lastBill.discount}</p>}
                <p>GST (5%): ₹{lastBill.gstAmount}</p>
                <p className="font-bold text-sm">TOTAL: ₹{lastBill.grandTotal}</p>
              </div>

              <div className="text-center pt-2 text-[10px] text-gray-500">
                <p>Payment: {lastBill.paymentMethod}</p>
                <p className="font-bold mt-1">Thank you! Visit Again!</p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex space-x-2 pt-2 border-t">
              <button
                onClick={handlePrint}
                className="flex-1 bg-slate-900 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center space-x-1"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>
              <button
                onClick={handleDownloadPDF}
                className="flex-1 bg-emerald-600 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center space-x-1"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>PDF</span>
              </button>
              <button
                onClick={() => setIsReceiptModalOpen(false)}
                className="px-3 bg-gray-100 text-gray-700 font-bold py-2 rounded-xl text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
