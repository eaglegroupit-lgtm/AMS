import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: { items: true },
      orderBy: { createdAt: 'asc' },
    });

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const todayOrders = orders.filter((o) => new Date(o.createdAt) >= todayStart);
    const todaySales = todayOrders.reduce((sum, o) => sum + o.grandTotal, 0);

    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthlyOrders = orders.filter((o) => new Date(o.createdAt) >= monthStart);
    const monthlySales = monthlyOrders.reduce((sum, o) => sum + o.grandTotal, 0);

    const totalCustomers = await prisma.customer.count();

    // Aggregated Revenue by date
    const salesByDate: Record<string, number> = {};
    orders.forEach((o) => {
      const dateKey = new Date(o.createdAt).toISOString().slice(0, 10);
      salesByDate[dateKey] = (salesByDate[dateKey] || 0) + o.grandTotal;
    });

    const revenueChartData = Object.keys(salesByDate).map((date) => ({
      date,
      revenue: Math.round(salesByDate[date]),
    }));

    // Aggregated Popular Dishes
    const itemCounts: Record<string, { name: string; nameTa: string; count: number; totalSales: number }> = {};
    orders.forEach((o) => {
      o.items.forEach((item) => {
        if (!itemCounts[item.foodName]) {
          itemCounts[item.foodName] = {
            name: item.foodName,
            nameTa: item.foodNameTa,
            count: 0,
            totalSales: 0,
          };
        }
        itemCounts[item.foodName].count += item.quantity;
        itemCounts[item.foodName].totalSales += item.total;
      });
    });

    const popularFoods = Object.values(itemCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return NextResponse.json({
      todaySales,
      todayOrdersCount: todayOrders.length,
      monthlySales,
      totalCustomers,
      revenueChartData,
      popularFoods,
    });
  } catch (error) {
    console.error('Reports fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
  }
}
