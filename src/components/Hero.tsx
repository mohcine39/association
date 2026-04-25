'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative h-[80vh] flex items-center justify-center overflow-hidden premium-gradient text-white">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/40" />
        {/* Placeholder for association image - ideally background of a past event */}
        <div 
          className="w-full h-full bg-cover bg-center" 
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")' }} 
        />
      </div>

      <div className="container relative z-10 px-6 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl sm:text-4xl md:text-6xl font-bold mb-6 leading-tight"
        >
          جمعية أجيال كيغلان
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg sm:text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90 leading-relaxed"
        >
          جمعية تربوية، ثقافية، رياضية واجتماعية.
          نعمل من أجل التنمية الشاملة للشباب والمجتمع في مكناس.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link 
            href="/events" 
            className="w-full sm:w-auto px-8 py-3 bg-slate-900 hover:bg-black text-white rounded-full font-bold transition-all transform hover:scale-105 shadow-xl shadow-black/20 border border-white/10 text-center"
          >
            استكشف الفعاليات
          </Link>
          <Link 
            href="#about" 
            className="w-full sm:w-auto px-8 py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-full font-bold transition-all border border-white/10 shadow-lg text-center"
          >
            اكتشف المزيد
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
