'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Receipt,
  UtensilsCrossed,
  Tags,
  Image,
  QrCode,
  BarChart3,
  Users,
  Settings,
  LogOut,
  ChevronRight,
} from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { href: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/admin/pos', label: 'POS Billing System', icon: Receipt, badge: 'POS' },
    { href: '/admin/foods', label: 'Food Management', icon: UtensilsCrossed },
    { href: '/admin/categories', label: 'Categories', icon: Tags },
    { href: '/admin/banners', label: 'Banner & Offers', icon: Image },
    { href: '/admin/qr-codes', label: 'QR Generator', icon: QrCode },
    { href: '/admin/reports', label: 'Sales Reports', icon: BarChart3 },
    { href: '/admin/customers', label: 'Customer CRM', icon: Users },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between min-h-screen border-r border-slate-800 shrink-0">
      <div>
        {/* Admin Brand Header */}
        <div className="p-6 border-b border-slate-800 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-orange-500 to-amber-400 text-white font-bold flex items-center justify-center text-lg shadow-md">
            அ
          </div>
          <div>
            <h2 className="text-white font-extrabold text-base tracking-tight">Amutha Surabi</h2>
            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
              Admin & POS Control
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-brand-orange-600 text-white shadow-md shadow-brand-orange-600/30'
                    : 'hover:bg-slate-800 hover:text-white text-slate-400'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="bg-amber-400 text-slate-900 px-1.5 py-0.5 rounded text-[9px] font-black uppercase">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout Footer */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 opacity-50" />
        </button>
      </div>
    </aside>
  );
}
