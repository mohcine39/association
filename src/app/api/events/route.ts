import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '10');
  const publishedOnly = searchParams.get('published') !== 'false';

  try {
    const events = await prisma.event.findMany({
      where: publishedOnly ? { isPublished: true } : {},
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Extract only the fields we want to save
    const { title, description, date, location, imageUrl, isPublished } = data;

    const event = await prisma.event.create({
      data: {
        title: title || 'بدون عنوان',
        description: description || '',
        date: date ? new Date(date) : null,
        location: location || '',
        imageUrl: imageUrl || '',
        isPublished: isPublished !== undefined ? isPublished : true,
        type: 'manual',
      },
    });
    
    return NextResponse.json(event);
  } catch (error) {
    console.error('Create event error:', error);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}
