import { NextResponse } from 'next/server';
import { scrapeFacebookEvents } from '@/lib/scraper';
import { prisma } from '@/lib/prisma';

const FB_PAGE_URL = 'https://www.facebook.com/profile.php?id=100063546733917';

export async function POST(request: Request) {
  // Basic security check (Optional but recommended)
  const authHeader = request.headers.get('Authorization');
  if (process.env.ADMIN_SECRET && authHeader !== `Bearer ${process.env.ADMIN_SECRET}`) {
    // For now, let's allow it in development or if no secret is set
    // return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const scrapedEvents = await scrapeFacebookEvents(FB_PAGE_URL);
    
    let createdCount = 0;
    let updatedCount = 0;

    for (const event of scrapedEvents) {
      // Check if event already exists by facebookUrl
      const existingEvent = await prisma.event.findUnique({
        where: { facebookUrl: event.facebookUrl },
      });

      if (existingEvent) {
        // Update existing event if it was scraped (don't override manual edits if we had a flag, but for now simple update)
        if (existingEvent.type === 'scraped') {
          await prisma.event.update({
            where: { id: existingEvent.id },
            data: {
              title: event.title,
              description: event.description,
              imageUrl: event.imageUrl,
            },
          });
          updatedCount++;
        }
      } else {
        // Create new event
        await prisma.event.create({
          data: {
            title: event.title,
            description: event.description,
            imageUrl: event.imageUrl,
            facebookUrl: event.facebookUrl,
            type: 'scraped',
            isPublished: true,
          },
        });
        createdCount++;
      }
    }

    // Log the sync
    await prisma.syncLog.create({
      data: {
        status: 'success',
        message: `Sync completed. Created: ${createdCount}, Updated: ${updatedCount}`,
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: `Sync completed. ${createdCount} new events, ${updatedCount} updated.` 
    });
  } catch (error) {
    console.error('Sync error:', error);
    
    await prisma.syncLog.create({
      data: {
        status: 'failed',
        message: error instanceof Error ? error.message : 'Unknown error during sync',
      },
    });

    return NextResponse.json({ success: false, error: 'Failed to sync events' }, { status: 500 });
  }
}
