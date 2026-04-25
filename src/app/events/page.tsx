import EventCard from '@/components/EventCard';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

async function getEvents() {
  try {
    const events = await prisma.event.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: 'desc' },
    });
    return events;
  } catch (e) {
    console.error('Error fetching events:', e);
    return [];
  }
}

export const dynamic = 'force-dynamic';

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <div className="pt-32 pb-24">
      <div className="container mx-auto px-6">
        <div className="mb-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-white">جميع فعالياتنا</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            اكتشف جميع الأنشطة والمبادرات التي تقوم بها جمعية أجيال كيغلان.
          </p>
        </div>

        {/* Filters Placeholder */}
        <div className="flex flex-wrap gap-4 mb-12 justify-center">
          <button className="px-6 py-2 bg-slate-900 text-white rounded-full font-bold shadow-lg shadow-black/20 border border-white/10">الكل</button>
          <button className="px-6 py-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-full font-bold border border-slate-300 hover:bg-slate-200 transition-colors">رحلات</button>
          <button className="px-6 py-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-full font-bold border border-slate-300 hover:bg-slate-200 transition-colors">ثقافة</button>
          <button className="px-6 py-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-full font-bold border border-slate-300 hover:bg-slate-200 transition-colors">اجتماعي</button>
        </div>

        {events.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-8">
            {events.map((event: any) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-slate-500 text-lg">لم يتم العثور على فعاليات.</p>
          </div>
        )}
      </div>
    </div>
  );
}
