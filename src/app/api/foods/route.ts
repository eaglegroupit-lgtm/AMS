import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const isVeg = searchParams.get('isVeg');

    const where: any = {};
    if (category && category !== 'all') {
      where.category = { slug: category };
    }
    if (isVeg !== null && isVeg !== undefined && isVeg !== '') {
      where.isVeg = isVeg === 'true';
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { nameTa: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const foods = await prisma.food.findMany({
      where,
      include: {
        category: true,
        images: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(foods);
  } catch (error) {
    console.error('Fetch foods error:', error);
    return NextResponse.json({ error: 'Failed to fetch foods' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      nameTa,
      description,
      descriptionTa,
      price,
      discount,
      gst,
      isVeg,
      spicyLevel,
      prepTimeMinutes,
      isFeatured,
      isTodaySpecial,
      isAvailable,
      categoryId,
      imageUrl,
    } = body;

    if (!name || !price || !categoryId) {
      return NextResponse.json({ error: 'Name, price, and categoryId are required' }, { status: 400 });
    }

    const food = await prisma.food.create({
      data: {
        name,
        nameTa: nameTa || name,
        description: description || '',
        descriptionTa: descriptionTa || description || '',
        price: parseFloat(price),
        discount: discount ? parseFloat(discount) : 0,
        gst: gst ? parseFloat(gst) : 5,
        isVeg: isVeg ?? true,
        spicyLevel: spicyLevel ? parseInt(spicyLevel) : 1,
        prepTimeMinutes: prepTimeMinutes ? parseInt(prepTimeMinutes) : 15,
        isFeatured: isFeatured ?? false,
        isTodaySpecial: isTodaySpecial ?? false,
        isAvailable: isAvailable ?? true,
        categoryId,
        images: imageUrl
          ? {
              create: [
                {
                  url: imageUrl,
                  isPrimary: true,
                },
              ],
            }
          : undefined,
      },
      include: {
        category: true,
        images: true,
      },
    });

    return NextResponse.json(food, { status: 201 });
  } catch (error) {
    console.error('Create food error:', error);
    return NextResponse.json({ error: 'Failed to create food' }, { status: 500 });
  }
}
