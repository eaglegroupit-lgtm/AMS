'use client';

import React, { useState, useEffect } from 'react';
import { Users, Search, Phone, Calendar, IndianRupee } from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  phone: string;
  visitCount: number;
  totalSpend: number;
  lastVisit: string;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function loadCustomers() {
      try {
        const res = await fetch('/api/customers');
        if (res.ok) setCustomers(await res.json());
      } catch (e) {
        console.error(e);
      }
    }
    loadCustomers();
  }, []);

  const filtered = customers.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search)
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Customer CRM</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          View customer visit frequencies, total spends, and contact numbers.
        </p>
      </div>

      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        <input
          type="text"
          placeholder="Search customer name or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-slate-800/80 border border-slate-700/60 rounded-xl text-xs text-white focus:outline-none focus:border-brand-orange-500"
        />
      </div>

      <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs text-slate-300">
          <thead>
            <tr className="bg-slate-900/80 text-slate-400 font-bold border-b border-slate-700/60 uppercase tracking-wider text-[10px]">
              <th className="p-4">Customer Name</th>
              <th className="p-4">Phone Number</th>
              <th className="p-4">Total Visits</th>
              <th className="p-4">Total Spend</th>
              <th className="p-4">Last Visit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/40">
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-slate-800/50">
                <td className="p-4 font-bold text-white flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-full bg-brand-orange-600 text-white font-bold flex items-center justify-center text-xs">
                    {c.name[0]}
                  </div>
                  <span>{c.name}</span>
                </td>
                <td className="p-4 font-mono text-amber-300">{c.phone}</td>
                <td className="p-4 font-bold text-slate-200">{c.visitCount} visits</td>
                <td className="p-4 font-black text-emerald-400">₹{c.totalSpend}</td>
                <td className="p-4 text-slate-400">{new Date(c.lastVisit).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
