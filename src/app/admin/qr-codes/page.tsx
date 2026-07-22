'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Download, QrCode as QrIcon } from 'lucide-react';

interface QRCodeItem {
  id: string;
  title: string;
  type: string;
  targetUrl: string;
  imagePath?: string;
  createdAt: string;
}

export default function AdminQRCodesPage() {
  const [qrcodes, setQrcodes] = useState<QRCodeItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: 'Digital Menu QR',
    type: 'MENU',
    targetUrl: 'http://localhost:3000/menu',
  });

  useEffect(() => {
    loadQRCodes();
  }, []);

  async function loadQRCodes() {
    try {
      const res = await fetch('/api/qrcodes');
      if (res.ok) setQrcodes(await res.json());
    } catch (e) {
      console.error(e);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/qrcodes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsModalOpen(false);
        loadQRCodes();
      }
    } catch (e) {
      alert('Generate QR failed');
    }
  };

  const downloadQR = (imagePath: string, title: string) => {
    const link = document.createElement('a');
    link.href = imagePath;
    link.download = `${title.replace(/\s+/g, '_')}_QR.png`;
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">QR Code Generator</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Generate printable QR codes for Digital Menu, WhatsApp Order, UPI Payment, and Table Standees.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-brand-orange-600 hover:bg-brand-orange-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center space-x-1.5 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Generate New QR</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {qrcodes.map((qr) => (
          <div
            key={qr.id}
            className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 text-center space-y-4 shadow-xl flex flex-col items-center justify-between"
          >
            <div className="space-y-1">
              <span className="bg-amber-400 text-slate-900 px-2 py-0.5 rounded text-[10px] font-black uppercase">
                {qr.type}
              </span>
              <h3 className="font-extrabold text-white text-base mt-2">{qr.title}</h3>
              <p className="text-[10px] text-slate-400 truncate max-w-[200px] mx-auto">
                {qr.targetUrl}
              </p>
            </div>

            {qr.imagePath && (
              <div className="bg-white p-3 rounded-2xl border-2 border-amber-400 shadow-md">
                <Image src={qr.imagePath} alt={qr.title} width={160} height={160} className="mx-auto" />
              </div>
            )}

            {qr.imagePath && (
              <button
                onClick={() => downloadQR(qr.imagePath!, qr.title)}
                className="w-full bg-slate-900 hover:bg-slate-700 text-amber-400 font-bold py-2 rounded-xl text-xs flex items-center justify-center space-x-1.5 border border-slate-700 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PNG</span>
              </button>
            )}
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-extrabold text-white text-base">Generate QR Code</h3>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">QR Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">QR Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none"
                >
                  <option value="MENU">Restaurant Digital Menu</option>
                  <option value="WHATSAPP">WhatsApp Order Chat</option>
                  <option value="UPI">UPI Quick Payment</option>
                  <option value="TABLE">Table Standee Number</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Target URL / UPI String</label>
                <input
                  type="text"
                  required
                  value={formData.targetUrl}
                  onChange={(e) => setFormData({ ...formData, targetUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none font-mono"
                />
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
                  Generate QR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
