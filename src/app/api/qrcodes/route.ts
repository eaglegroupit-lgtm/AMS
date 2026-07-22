import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import QRCode from 'qrcode';

export async function GET() {
  try {
    const qrcodes = await prisma.qRCode.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(qrcodes);
  } catch (error) {
    console.error('Fetch QR codes error:', error);
    return NextResponse.json({ error: 'Failed to fetch QR codes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { title, type, targetUrl } = await request.json();

    if (!title || !targetUrl) {
      return NextResponse.json({ error: 'Title and targetUrl are required' }, { status: 400 });
    }

    // Generate base64 Data URL for the QR code
    const imagePath = await QRCode.toDataURL(targetUrl, { width: 300, margin: 2 });

    const qrcode = await prisma.qRCode.create({
      data: {
        title,
        type: type || 'MENU',
        targetUrl,
        imagePath,
      },
    });

    return NextResponse.json(qrcode, { status: 201 });
  } catch (error) {
    console.error('Create QR code error:', error);
    return NextResponse.json({ error: 'Failed to create QR code' }, { status: 500 });
  }
}
