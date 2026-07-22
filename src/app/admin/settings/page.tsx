'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Save, CheckCircle2 } from 'lucide-react';

export default function AdminSettingsPage() {
  const [formData, setFormData] = useState({
    name: '',
    nameTa: '',
    address: '',
    addressTa: '',
    phone: '',
    whatsapp: '',
    email: '',
    openingHours: '',
    openingHoursTa: '',
    gstNumber: '',
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) setFormData(await res.json());
      } catch (e) {
        console.error(e);
      }
    }
    loadSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 4000);
      }
    } catch (e) {
      alert('Failed to save settings');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Restaurant Settings</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Manage restaurant branding, addresses in English & Tamil, GST registration, and contact details.
        </p>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl flex items-center space-x-2 font-bold">
          <CheckCircle2 className="w-4 h-4" />
          <span>Settings updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-slate-800/80 border border-slate-700/60 p-6 rounded-2xl space-y-4 text-xs">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-400 font-bold mb-1">Restaurant Name (English)</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-bold mb-1">Restaurant Name (Tamil)</label>
            <input
              type="text"
              required
              value={formData.nameTa}
              onChange={(e) => setFormData({ ...formData, nameTa: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-400 font-bold mb-1">Address (English)</label>
            <textarea
              rows={2}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-bold mb-1">Address (Tamil)</label>
            <textarea
              rows={2}
              value={formData.addressTa}
              onChange={(e) => setFormData({ ...formData, addressTa: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-slate-400 font-bold mb-1">Phone Number</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-bold mb-1">WhatsApp Number</label>
            <input
              type="text"
              value={formData.whatsapp}
              onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-bold mb-1">GSTIN Number</label>
            <input
              type="text"
              value={formData.gstNumber}
              onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-400 font-bold mb-1">Opening Hours (English)</label>
            <input
              type="text"
              value={formData.openingHours}
              onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-bold mb-1">Opening Hours (Tamil)</label>
            <input
              type="text"
              value={formData.openingHoursTa}
              onChange={(e) => setFormData({ ...formData, openingHoursTa: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-700">
          <button
            type="submit"
            className="bg-brand-orange-600 hover:bg-brand-orange-700 text-white font-bold px-6 py-2.5 rounded-xl flex items-center space-x-2 transition-all shadow-md active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
