import Hero from '@/components/Hero';
import EventCard from '@/components/EventCard';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { prisma } from '@/lib/prisma';

async function getLatestEvents() {
  try {
    const events = await prisma.event.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: 'desc' },
      take: 3,
    });
    return events;
  } catch (e) {
    console.error('Error fetching latest events:', e);
    return [];
  }
}

export const dynamic = 'force-dynamic';

export default async function Home() {
  const events = await getLatestEvents();

  return (
    <div>
      <Hero />

      {/* About Section */}
      <section id="about" className="py-24 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-secondary font-bold tracking-wider uppercase text-sm mb-4 block">من نحن؟</span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900 dark:text-white">
                جمعية تربوية، ثقافية، رياضية واجتماعية بمكناس
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                جمعية أجيال كيغلان للتنمية والثقافة هي منظمة رائدة في مكناس، تعمل على تمكين الشباب وتعزيز الهوية الثقافية من خلال أنشطة متنوعة تشمل المخيمات، الرحلات، والورش التعليمية والرياضية.
              </p>
              <div className="flex gap-8 py-6 border-y border-slate-100 dark:border-slate-800">
                <div>
                  <div className="text-3xl font-bold text-primary mb-1">0622-158485</div>
                  <div className="text-sm text-slate-500">للتواصل المباشر</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-1">ajyalmeknes@gmail.com</div>
                  <div className="text-sm text-slate-500">البريد الإلكتروني</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-slate-200 rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Activities" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 glass p-6 rounded-2xl shadow-xl hidden md:block">
                <p className="font-bold text-slate-900 dark:text-white">"الشباب هم المستقبل"</p>
                <p className="text-sm text-slate-500">جمعية أجيال كيغلان</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-24 bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-primary font-bold tracking-wider uppercase text-sm mb-4 block">برنامجنا</span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">الفعاليات القادمة</h2>
            </div>
            <Link href="/events" className="flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all group">
              شاهد الكل <ArrowRight className="w-5 h-5 rotate-180" />
            </Link>
          </div>

          {events.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-8">
              {events.map((event: any) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
              <p className="text-slate-500 text-lg mb-4">لا توجد فعاليات متاحة حالياً.</p>
              <p className="text-sm text-slate-400">عد قريباً أو تصفح صفحتنا على فيسبوك.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
