import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const existingFood = await prisma.food.findUnique({ where: { id } });
    if (!existingFood) {
      return NextResponse.json({ error: 'Food not found' }, { status: 404 });
    }

    const updatedFood = await prisma.food.update({
      where: { id },
      data: {
        name: name !== undefined ? name : existingFood.name,
        nameTa: nameTa !== undefined ? nameTa : existingFood.nameTa,
        description: description !== undefined ? description : existingFood.description,
        descriptionTa: descriptionTa !== undefined ? descriptionTa : existingFood.descriptionTa,
        price: price !== undefined ? parseFloat(price) : existingFood.price,
        discount: discount !== undefined ? parseFloat(discount) : existingFood.discount,
        gst: gst !== undefined ? parseFloat(gst) : existingFood.gst,
        isVeg: isVeg !== undefined ? isVeg : existingFood.isVeg,
        spicyLevel: spicyLevel !== undefined ? parseInt(spicyLevel) : existingFood.spicyLevel,
        prepTimeMinutes: prepTimeMinutes !== undefined ? parseInt(prepTimeMinutes) : existingFood.prepTimeMinutes,
        isFeatured: isFeatured !== undefined ? isFeatured : existingFood.isFeatured,
        isTodaySpecial: isTodaySpecial !== undefined ? isTodaySpecial : existingFood.isTodaySpecial,
        isAvailable: isAvailable !== undefined ? isAvailable : existingFood.isAvailable,
        categoryId: categoryId !== undefined ? categoryId : existingFood.categoryId,
      },
      include: {
        category: true,
        images: true,
      },
    });

    if (imageUrl) {
      await prisma.foodImage.deleteMany({ where: { foodId: id } });
      await prisma.foodImage.create({
        data: {
          foodId: id,
          url: imageUrl,
          isPrimary: true,
        },
      });
    }

    return NextResponse.json(updatedFood);
  } catch (error) {
    console.error('Update food error:', error);
    return NextResponse.json({ error: 'Failed to update food' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.food.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Food deleted' });
  } catch (error) {
    console.error('Delete food error:', error);
    return NextResponse.json({ error: 'Failed to delete food' }, { status: 500 });
  }
}
