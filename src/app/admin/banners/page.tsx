'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Trash2, Image as ImageIcon } from 'lucide-react';

interface Banner {
  id: string;
  title: string;
  titleTa: string;
  subtitle: string;
  subtitleTa: string;
  imageUrl: string;
  type: string;
  autoSlide: boolean;
}

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    titleTa: '',
    subtitle: '',
    subtitleTa: '',
    imageUrl: '',
    type: 'SLIDER',
    autoSlide: true,
  });

  useEffect(() => {
    loadBanners();
  }, []);

  async function loadBanners() {
    try {
      const res = await fetch('/api/banners');
      if (res.ok) setBanners(await res.json());
    } catch (e) {
      console.error(e);
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const body = new FormData();
    body.append('file', file);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body });
      const data = await res.json();
      if (data.url) setFormData((prev) => ({ ...prev, imageUrl: data.url }));
    } catch (err) {
      alert('Upload failed');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setIsModalOpen(false);
        loadBanners();
      }
    } catch (e) {
      alert('Failed to save banner');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Banner & Offer Management</h1>
          <p className="text-xs text-slate-400 mt-0.5">Control homepage hero sliders and promotional festival banners.</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-brand-orange-600 hover:bg-brand-orange-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center space-x-1.5 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Banner</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {banners.map((b) => (
          <div key={b.id} className="bg-slate-800/80 border border-slate-700/60 rounded-2xl overflow-hidden shadow-xl space-y-3">
            <div className="relative h-48 w-full bg-slate-900">
              <Image src={b.imageUrl} alt={b.title} fill className="object-cover" />
              <div className="absolute top-3 right-3 bg-brand-orange-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded shadow">
                {b.type}
              </div>
            </div>
            <div className="p-4 space-y-1">
              <h3 className="font-bold text-white text-sm">{b.title}</h3>
              <p className="text-xs text-amber-400 font-medium">{b.titleTa}</p>
              <p className="text-xs text-slate-400 line-clamp-2">{b.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-extrabold text-white text-base">New Banner</h3>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Title (English)</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Title (Tamil)</label>
                <input
                  type="text"
                  required
                  value={formData.titleTa}
                  onChange={(e) => setFormData({ ...formData, titleTa: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Image URL or Upload</label>
                <input
                  type="text"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none mb-1"
                />
                <input type="file" onChange={handleImageUpload} className="text-[10px] text-slate-400" />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Banner Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none"
                >
                  <option value="SLIDER">Hero Slider</option>
                  <option value="OFFER">Special Offer</option>
                  <option value="FESTIVAL">Festival Notice</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-400 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-orange-600 text-white font-bold rounded-xl"
                >
                  Save Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
