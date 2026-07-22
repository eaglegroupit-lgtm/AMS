import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: true,
        customer: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Fetch orders error:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { tableNumber, customerName, customerPhone, items, discount, paymentMethod } =
      await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Order items are required' }, { status: 400 });
    }

    // 1. Calculate subtotal & GST
    const subtotal = items.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );
    const discVal = discount ? parseFloat(discount) : 0;
    const gstAmount = Math.round(subtotal * 0.05 * 100) / 100;
    const grandTotal = Math.round((subtotal - discVal + gstAmount) * 100) / 100;

    // 2. Upsert Customer CRM
    let customerId: string | undefined = undefined;
    if (customerPhone && customerPhone.trim() !== '') {
      const existingCust = await prisma.customer.findUnique({
        where: { phone: customerPhone.trim() },
      });
      if (existingCust) {
        const updatedCust = await prisma.customer.update({
          where: { id: existingCust.id },
          data: {
            name: customerName || existingCust.name,
            visitCount: existingCust.visitCount + 1,
            totalSpend: existingCust.totalSpend + grandTotal,
            lastVisit: new Date(),
          },
        });
        customerId = updatedCust.id;
      } else {
        const newCust = await prisma.customer.create({
          data: {
            name: customerName || 'Guest Customer',
            phone: customerPhone.trim(),
            visitCount: 1,
            totalSpend: grandTotal,
            lastVisit: new Date(),
          },
        });
        customerId = newCust.id;
      }
    }

    // 3. Generate unique Bill Number (e.g. AS-20260720-XXXX)
    const countToday = await prisma.order.count();
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const billNumber = `AS-${dateStr}-${String(countToday + 1).padStart(4, '0')}`;

    // 4. Create Order with OrderItems
    const order = await prisma.order.create({
      data: {
        billNumber,
        tableNumber: tableNumber || 'T1',
        customerName: customerName || 'Walk-in Guest',
        customerPhone: customerPhone || 'N/A',
        subtotal,
        discount: discVal,
        gstAmount,
        grandTotal,
        paymentMethod: paymentMethod || 'CASH',
        status: 'COMPLETED',
        customerId,
        items: {
          create: items.map((item: any) => ({
            foodId: item.foodId || item.id,
            foodName: item.name,
            foodNameTa: item.nameTa || item.name,
            price: parseFloat(item.price),
            quantity: parseInt(item.quantity),
            total: item.price * item.quantity,
          })),
        },
      },
      include: {
        items: true,
        customer: true,
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
