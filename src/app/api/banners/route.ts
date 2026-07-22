import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(banners);
  } catch (error) {
    console.error('Fetch banners error:', error);
    return NextResponse.json({ error: 'Failed to fetch banners' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { title, titleTa, subtitle, subtitleTa, imageUrl, type, autoSlide } =
      await request.json();

    if (!title || !imageUrl) {
      return NextResponse.json({ error: 'Title and imageUrl are required' }, { status: 400 });
    }

    const banner = await prisma.banner.create({
      data: {
        title,
        titleTa: titleTa || title,
        subtitle: subtitle || '',
        subtitleTa: subtitleTa || subtitle || '',
        imageUrl,
        type: type || 'SLIDER',
        autoSlide: autoSlide ?? true,
      },
    });

    return NextResponse.json(banner, { status: 201 });
  } catch (error) {
    console.error('Create banner error:', error);
    return NextResponse.json({ error: 'Failed to create banner' }, { status: 500 });
  }
}
