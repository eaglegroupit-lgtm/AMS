'use client';

import React, { useEffect, useState } from 'react';
import {
  IndianRupee,
  ShoppingBag,
  TrendingUp,
  Users,
  Flame,
  Clock,
  ArrowUpRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

interface ReportData {
  todaySales: number;
  todayOrdersCount: number;
  monthlySales: number;
  totalCustomers: number;
  revenueChartData: { date: string; revenue: number }[];
  popularFoods: { name: string; nameTa: string; count: number; totalSales: number }[];
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReports() {
      try {
        const res = await fetch('/api/reports');
        if (res.ok) {
          setData(await res.json());
        }
      } catch (e) {
        console.error('Failed to load dashboard reports', e);
      } finally {
        setLoading(false);
      }
    }
    loadReports();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-slate-800 rounded-lg" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-slate-800 rounded-2xl" />
          ))}
        </div>
        <div className="h-80 bg-slate-800 rounded-2xl" />
      </div>
    );
  }

  const stats = [
    {
      label: "Today's Revenue",
      value: `₹${data?.todaySales || 0}`,
      icon: IndianRupee,
      color: 'from-orange-500 to-amber-500',
    },
    {
      label: "Today's Orders",
      value: data?.todayOrdersCount || 0,
      icon: ShoppingBag,
      color: 'from-emerald-500 to-teal-500',
    },
    {
      label: 'Monthly Revenue',
      value: `₹${data?.monthlySales || 0}`,
      icon: TrendingUp,
      color: 'from-purple-500 to-pink-500',
    },
    {
      label: 'Total Registered Customers',
      value: data?.totalCustomers || 0,
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Executive Dashboard</h1>
        <p className="text-xs text-slate-400 mt-1">
          Real-time restaurant sales overview and customer metrics.
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-slate-800/80 border border-slate-700/60 p-5 rounded-2xl flex items-center justify-between shadow-lg"
          >
            <div>
              <p className="text-xs text-slate-400 font-semibold">{stat.label}</p>
              <h3 className="text-2xl font-black text-white mt-1">{stat.value}</h3>
            </div>
            <div
              className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${stat.color} text-white flex items-center justify-center shadow-md`}
            >
              <stat.icon className="w-6 h-6" />
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Chart & Popular Foods */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sales Chart */}
        <div className="lg:col-span-8 bg-slate-800/80 border border-slate-700/60 p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-lg text-white">Revenue Trend</h3>
              <p className="text-xs text-slate-400">Daily sales breakdown</p>
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            {data?.revenueChartData && data.revenueChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.revenueChartData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', borderRadius: '12px' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#f97316"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500 text-xs">
                No revenue records yet. Create orders in POS!
              </div>
            )}
          </div>
        </div>

        {/* Popular Foods */}
        <div className="lg:col-span-4 bg-slate-800/80 border border-slate-700/60 p-6 rounded-2xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-amber-400 mb-1">
              <Flame className="w-5 h-5" />
              <h3 className="font-extrabold text-lg text-white">Popular Dishes</h3>
            </div>
            <p className="text-xs text-slate-400">Top selling South Indian items</p>

            <div className="mt-4 space-y-3">
              {data?.popularFoods && data.popularFoods.length > 0 ? (
                data.popularFoods.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 bg-slate-900/60 rounded-xl border border-slate-800"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">{item.name}</h4>
                      <p className="text-[10px] text-slate-500">{item.count} orders sold</p>
                    </div>
                    <span className="text-xs font-black text-amber-400">₹{item.totalSales}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 py-6 text-center">No order data yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
