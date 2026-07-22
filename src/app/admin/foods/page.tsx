'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Flame,
  Clock,
  Sparkles,
  Upload,
  Check,
  X,
} from 'lucide-react';

interface FoodItem {
  id: string;
  name: string;
  nameTa: string;
  description: string;
  descriptionTa: string;
  price: number;
  discount: number;
  gst: number;
  isVeg: boolean;
  spicyLevel: number;
  prepTimeMinutes: number;
  isFeatured: boolean;
  isTodaySpecial: boolean;
  isAvailable: boolean;
  categoryId: string;
  category: { id: string; name: string };
  images: { url: string }[];
}

export default function AdminFoodsPage() {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    nameTa: '',
    description: '',
    descriptionTa: '',
    price: '',
    discount: '0',
    gst: '5',
    isVeg: true,
    spicyLevel: 1,
    prepTimeMinutes: 15,
    isFeatured: false,
    isTodaySpecial: false,
    isAvailable: true,
    categoryId: '',
    imageUrl: '',
  });

  useEffect(() => {
    loadFoods();
    loadCategories();
  }, []);

  async function loadFoods() {
    try {
      const res = await fetch('/api/foods');
      if (res.ok) setFoods(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function loadCategories() {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const cats = await res.json();
        setCategories(cats);
        if (cats.length > 0 && !formData.categoryId) {
          setFormData((prev) => ({ ...prev, categoryId: cats[0].id }));
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  const handleOpenCreateModal = () => {
    setEditingId(null);
    setFormData({
      name: '',
      nameTa: '',
      description: '',
      descriptionTa: '',
      price: '',
      discount: '0',
      gst: '5',
      isVeg: true,
      spicyLevel: 1,
      prepTimeMinutes: 15,
      isFeatured: false,
      isTodaySpecial: false,
      isAvailable: true,
      categoryId: categories[0]?.id || '',
      imageUrl: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (food: FoodItem) => {
    setEditingId(food.id);
    setFormData({
      name: food.name,
      nameTa: food.nameTa,
      description: food.description,
      descriptionTa: food.descriptionTa,
      price: String(food.price),
      discount: String(food.discount),
      gst: String(food.gst),
      isVeg: food.isVeg,
      spicyLevel: food.spicyLevel,
      prepTimeMinutes: food.prepTimeMinutes,
      isFeatured: food.isFeatured,
      isTodaySpecial: food.isTodaySpecial,
      isAvailable: food.isAvailable,
      categoryId: food.categoryId,
      imageUrl: food.images?.[0]?.url || '',
    });
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const body = new FormData();
    body.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body,
      });
      const data = await res.json();
      if (data.url) {
        setFormData((prev) => ({ ...prev, imageUrl: data.url }));
      }
    } catch (err) {
      alert('Upload failed');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = editingId ? `/api/foods/${editingId}` : '/api/foods';
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsModalOpen(false);
        loadFoods();
      } else {
        const err = await res.json();
        alert(err.error || 'Operation failed');
      }
    } catch (e) {
      alert('Failed to save food');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this food item?')) return;
    try {
      const res = await fetch(`/api/foods/${id}`, { method: 'DELETE' });
      if (res.ok) loadFoods();
    } catch (e) {
      alert('Failed to delete');
    }
  };

  const toggleAvailability = async (food: FoodItem) => {
    try {
      await fetch(`/api/foods/${food.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAvailable: !food.isAvailable }),
      });
      loadFoods();
    } catch (e) {
      console.error(e);
    }
  };

  const filteredFoods = foods.filter(
    (f) =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.nameTa.includes(search) ||
      f.category.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Food Management</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Add, update, or toggle dishes on your menu.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="bg-brand-orange-600 hover:bg-brand-orange-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center space-x-1.5 transition-all shadow-md active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Dish</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        <input
          type="text"
          placeholder="Search by food or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-slate-800/80 border border-slate-700/60 rounded-xl text-xs text-white focus:outline-none focus:border-brand-orange-500"
        />
      </div>

      {/* Table */}
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left border-collapse text-xs text-slate-300">
          <thead>
            <tr className="bg-slate-900/80 text-slate-400 font-bold border-b border-slate-700/60 uppercase tracking-wider text-[10px]">
              <th className="p-4">Dish</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Type</th>
              <th className="p-4">Special</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/40">
            {filteredFoods.map((food) => (
              <tr key={food.id} className="hover:bg-slate-800/50 transition-colors">
                <td className="p-4 flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 overflow-hidden relative border border-slate-700 shrink-0">
                    {food.images?.[0]?.url && (
                      <Image src={food.images[0].url} alt={food.name} fill className="object-cover" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs">{food.name}</h4>
                    <p className="text-[10px] text-amber-400 font-medium">{food.nameTa}</p>
                  </div>
                </td>

                <td className="p-4">
                  <span className="bg-slate-900 border border-slate-700 px-2 py-1 rounded text-[10px] font-semibold text-slate-300">
                    {food.category.name}
                  </span>
                </td>

                <td className="p-4 font-black text-amber-400">₹{food.price}</td>

                <td className="p-4">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      food.isVeg
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-red-500/10 text-red-400 border border-red-500/30'
                    }`}
                  >
                    {food.isVeg ? 'VEG' : 'NON-VEG'}
                  </span>
                </td>

                <td className="p-4">
                  {food.isTodaySpecial && (
                    <span className="bg-red-600 text-white px-2 py-0.5 rounded text-[9px] font-black uppercase">
                      Today Special
                    </span>
                  )}
                </td>

                <td className="p-4">
                  <button
                    onClick={() => toggleAvailability(food)}
                    className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                      food.isAvailable
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-red-500/10 text-red-400 border border-red-500/30'
                    }`}
                  >
                    {food.isAvailable ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    <span>{food.isAvailable ? 'Available' : 'Hidden'}</span>
                  </button>
                </td>

                <td className="p-4 text-right space-x-2">
                  <button
                    onClick={() => handleOpenEditModal(food)}
                    className="p-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-200"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(food.id)}
                    className="p-1.5 bg-red-500/20 hover:bg-red-500/40 rounded-lg text-red-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Food Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full p-6 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-white text-base">
                {editingId ? 'Edit Dish' : 'Add New Dish'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">English Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Tamil Name (தமிழ்)</label>
                  <input
                    type="text"
                    required
                    value={formData.nameTa}
                    onChange={(e) => setFormData({ ...formData, nameTa: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">English Description</label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Tamil Description</label>
                  <textarea
                    rows={2}
                    value={formData.descriptionTa}
                    onChange={(e) => setFormData({ ...formData, descriptionTa: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Category</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Spicy Level (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={formData.spicyLevel}
                    onChange={(e) => setFormData({ ...formData, spicyLevel: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 items-center">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Image URL or Upload</label>
                  <input
                    type="text"
                    placeholder="https://... or upload below"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none mb-1"
                  />
                  <input type="file" onChange={handleImageUpload} className="text-[10px] text-slate-400" />
                </div>

                <div className="space-y-2 pt-4">
                  <label className="flex items-center space-x-2 text-slate-300 font-bold">
                    <input
                      type="checkbox"
                      checked={formData.isVeg}
                      onChange={(e) => setFormData({ ...formData, isVeg: e.target.checked })}
                      className="rounded"
                    />
                    <span>Vegetarian Item</span>
                  </label>

                  <label className="flex items-center space-x-2 text-slate-300 font-bold">
                    <input
                      type="checkbox"
                      checked={formData.isTodaySpecial}
                      onChange={(e) => setFormData({ ...formData, isTodaySpecial: e.target.checked })}
                      className="rounded"
                    />
                    <span className="text-red-400">Today's Special</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-400 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-orange-600 hover:bg-brand-orange-700 text-white font-bold rounded-xl"
                >
                  Save Dish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
