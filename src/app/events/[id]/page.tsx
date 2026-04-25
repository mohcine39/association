import { prisma } from '@/lib/prisma';
import { Calendar, MapPin, Share2, ExternalLink, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

async function getEvent(id: string) {
  return await prisma.event.findUnique({
    where: { id },
  });
}

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await getEvent(id);

  if (!event) {
    notFound();
  }

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="container mx-auto px-6">
        <Link 
          href="/events" 
          className="inline-flex items-center gap-2 text-slate-500 hover:text-primary mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 rotate-180" /> العودة إلى الفعاليات
        </Link>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <h1 className="text-4xl md:text-5xl font-bold mb-8 text-slate-900 dark:text-white leading-tight">
              {event.title}
            </h1>

            {event.imageUrl && (
              <div className="relative aspect-video w-full rounded-3xl overflow-hidden mb-12 shadow-xl">
                <img 
                  src={event.imageUrl} 
                  alt={event.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
              <div className="whitespace-pre-wrap text-slate-700 dark:text-slate-300 leading-relaxed">
                {event.description}
              </div>
            </div>
          </div>

          {/* Sidebar / Info */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-border shadow-sm sticky top-32">
              <h3 className="text-xl font-bold mb-6">معلومات الفعالية</h3>
              
              <div className="space-y-6 mb-8">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-medium">التاريخ</p>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {event.date ? new Date(event.date).toLocaleDateString('ar-MA', { dateStyle: 'full' }) : 'سيحدد لاحقاً'}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-medium">الموقع</p>
                    <p className="font-semibold text-slate-900 dark:text-white">{event.location || 'مكناس، المغرب'}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {event.facebookUrl && (
                  <a 
                    href={event.facebookUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 bg-[#1877F2] hover:bg-[#1864D9] text-white rounded-xl font-bold transition-all"
                  >
                    <ExternalLink className="w-5 h-5" /> شاهد على فيسبوك
                  </a>
                )}
                
                <button className="flex items-center justify-center gap-2 w-full py-3 glass hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white rounded-xl font-bold transition-all">
                  <Share2 className="w-5 h-5" /> مشاركة
                </button>
              </div>

              <div className="mt-8 pt-8 border-t border-border">
                <p className="text-sm text-slate-500 text-center">
                  تم النشر من طرف جمعية أجيال كيغلان بتاريخ {new Date(event.createdAt).toLocaleDateString('ar-MA')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
