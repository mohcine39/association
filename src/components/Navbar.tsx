'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
        ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-md py-3' 
        : 'bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm py-4'
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="text-xl md:text-2xl font-bold flex items-center gap-2">
          <span className="text-slate-900 dark:text-white">أجيال كيغلان</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 font-bold text-slate-900 dark:text-slate-200">
          <Link href="/" className="hover:text-secondary transition-colors">الرئيسية</Link>
          <Link href="/events" className="hover:text-secondary transition-colors">الفعاليات</Link>
          <Link href="/#about" className="hover:text-secondary transition-colors">عن الجمعية</Link>
            <Link 
              href="/admin" 
              className="px-6 py-2.5 rounded-full transition-all font-black bg-slate-900 text-white hover:bg-black shadow-lg shadow-black/30"
            >
            لوحة التحكم
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-2xl text-slate-900 dark:text-white" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-slate-900 shadow-xl border-t border-border p-6 flex flex-col gap-4 animate-in slide-in-from-top duration-300">
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium">الرئيسية</Link>
          <Link href="/events" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium">الفعاليات</Link>
          <Link href="/#about" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium">عن الجمعية</Link>
          <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-primary">الإدارة</Link>
        </div>
      )}
    </nav>
  );
}
