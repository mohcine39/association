'use client';

import { motion } from 'framer-motion';
import { Calendar, MapPin, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface EventCardProps {
  event: {
    id: string;
    title: string;
    description: string;
    date?: string | null;
    location?: string | null;
    imageUrl?: string | null;
    facebookUrl?: string | null;
  };
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-border group"
    >
      <div className="relative h-48 w-full overflow-hidden">
        {event.imageUrl ? (
          <img 
            src={event.imageUrl} 
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <Calendar className="w-12 h-12 text-primary/40" />
          </div>
        )}
        <div className="absolute top-4 right-4">
          <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
            فعالية
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold mb-3 line-clamp-1 group-hover:text-primary transition-colors">
          {event.title}
        </h3>
        
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-3 h-12">
          {event.description}
        </p>

        <div className="flex flex-col gap-2 mb-6 text-sm text-slate-500">
          {event.date && (
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{new Date(event.date).toLocaleDateString('ar-MA', { dateStyle: 'long' })}</span>
            </div>
          )}
          {event.location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{event.location}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-auto">
          <Link 
            href={`/events/${event.id}`}
            className="px-5 py-2 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-black transition-all shadow-md shadow-black/10"
          >
            التفاصيل
          </Link>
          
          {event.facebookUrl && (
            <a 
              href={event.facebookUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-blue-600"
              title="شاهد على فيسبوك"
            >
              <ExternalLink className="w-5 h-5" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
