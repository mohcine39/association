'use client';

import { useState, useEffect } from 'react';
import { 
  RefreshCw, Trash2, Edit, Plus, ExternalLink, 
  CheckCircle, XCircle, X, Calendar, MapPin, 
  Image as ImageIcon, Type, AlignLeft, Save, Loader2, LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' | '' }>({ text: '', type: '' });
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      // Fetch all events, including unpublished ones
      const res = await fetch('/api/events?published=false');
      const data = await res.json();
      setEvents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching events:', error);
      showMessage('خطأ في تحميل الفعاليات', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 5000);
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch('/api/sync', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        showMessage(data.message || 'تمت المزامنة بنجاح!', 'success');
        fetchEvents();
      } else {
        showMessage('خطأ أثناء المزامنة.', 'error');
      }
    } catch (error) {
      showMessage('حدث خطأ غير متوقع.', 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingEvent({
      title: '',
      description: '',
      imageUrl: '',
      date: '',
      location: '',
      isPublished: true,
      type: 'manual'
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (event: any) => {
    setEditingEvent({
      ...event,
      date: event.date ? new Date(event.date).toISOString().split('T')[0] : ''
    });
    setIsModalOpen(true);
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const isEditing = !!editingEvent.id;
      const url = isEditing ? `/api/events/${editingEvent.id}` : '/api/events';
      const method = isEditing ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingEvent),
      });

      if (res.ok) {
        showMessage(isEditing ? 'تم تحديث الفعالية!' : 'تم إضافة الفعالية!', 'success');
        setIsModalOpen(false);
        fetchEvents();
      } else {
        showMessage('حدث خطأ أثناء الحفظ.', 'error');
      }
    } catch (error) {
      showMessage('حدث خطأ غير متوقع.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteEvent = (id: string) => {
    setEventToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!eventToDelete) return;
    
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/events/${eventToDelete}`, { method: 'DELETE' });
      if (res.ok) {
        showMessage('تم حذف الفعالية بنجاح.', 'success');
        setIsDeleteModalOpen(false);
        setEventToDelete(null);
        fetchEvents();
      } else {
        showMessage('خطأ في الحذف.', 'error');
      }
    } catch (error) {
      showMessage('حدث خطأ غير متوقع.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleTogglePublish = async (event: any) => {
    try {
      const res = await fetch(`/api/events/${event.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !event.isPublished }),
      });
      if (res.ok) {
        fetchEvents();
      }
    } catch (error) {
      showMessage('خطأ في تحديث الحالة.', 'error');
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        router.push('/admin/login');
        router.refresh();
      }
    } catch (error) {
      showMessage('خطأ أثناء تسجيل الخروج', 'error');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">لوحة التحكم</h1>
              <button 
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex items-center gap-2 px-3 py-1 text-xs font-black text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all border border-slate-200 dark:border-slate-700"
              >
                {isLoggingOut ? <Loader2 className="w-3 h-3 animate-spin" /> : <LogOut className="w-3 h-3 text-red-500" />}
                تسجيل الخروج
              </button>
            </div>
            <p className="text-slate-500">إدارة فعاليات الجمعية بسهولة</p>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={handleSync}
              disabled={isSyncing}
              className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-black transition-all disabled:opacity-50 shadow-lg shadow-black/10"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'جاري المزامنة...' : 'مزامنة فيسبوك'}
            </button>
            <button 
              onClick={handleOpenAddModal}
              className="flex items-center gap-2 px-6 py-3 bg-slate-950 text-white rounded-xl font-black hover:bg-black hover:shadow-xl hover:shadow-black/30 hover:-translate-y-0.5 transition-all shadow-md border border-white/5"
            >
              <Plus className="w-5 h-5" />
              إضافة فعالية جديدة
            </button>
          </div>
        </div>

        {/* Message Toast */}
        <AnimatePresence>
          {message.text && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`p-4 rounded-xl mb-8 flex items-center gap-3 shadow-sm border ${
                message.type === 'error' 
                  ? 'bg-red-50 border-red-100 text-red-700 dark:bg-red-900/20 dark:border-red-900/30 dark:text-red-400' 
                  : 'bg-green-50 border-green-100 text-green-700 dark:bg-green-900/20 dark:border-green-900/30 dark:text-green-400'
              }`}
            >
              {message.type === 'error' ? <XCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
              <span className="font-medium">{message.text}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Summary (Simplified) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-border shadow-sm">
            <p className="text-slate-500 text-sm mb-1">إجمالي الفعاليات</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{events.length}</h3>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-border shadow-sm">
            <p className="text-slate-500 text-sm mb-1">المنشورة</p>
            <h3 className="text-2xl font-bold text-green-600">{events.filter(e => e.isPublished).length}</h3>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-border shadow-sm">
            <p className="text-slate-500 text-sm mb-1">المسودات</p>
            <h3 className="text-2xl font-bold text-slate-400">{events.filter(e => !e.isPublished).length}</h3>
          </div>
        </div>

        {/* Events Table */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-border text-slate-500 text-sm font-bold">
                <tr>
                  <th className="px-6 py-5">الفعالية</th>
                  <th className="px-6 py-5">المصدر</th>
                  <th className="px-6 py-5">التاريخ</th>
                  <th className="px-6 py-5">الحالة</th>
                  <th className="px-6 py-5 text-left">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <RefreshCw className="w-10 h-10 text-primary/20 animate-spin" />
                        <p className="text-slate-400">جاري تحميل البيانات...</p>
                      </div>
                    </td>
                  </tr>
                ) : events.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center text-slate-500">
                      لا توجد فعاليات حالياً. ابدأ بإضافة واحدة جديدة!
                    </td>
                  </tr>
                ) : (
                  events.map((event) => (
                    <tr key={event.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden flex-shrink-0 border border-border">
                            {event.imageUrl ? (
                              <img src={event.imageUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-300">
                                <ImageIcon className="w-6 h-6" />
                              </div>
                            )}
                          </div>
                          <div className="max-w-xs md:max-w-md">
                            <div className="font-bold text-slate-900 dark:text-white truncate text-lg">{event.title}</div>
                            <div className="text-sm text-slate-500 truncate">{event.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] uppercase tracking-wider font-black px-2.5 py-1 rounded-md ${
                          event.type === 'scraped' 
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' 
                            : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                        }`}>
                          {event.type === 'scraped' ? 'فيسبوك' : 'يدوي'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                        {event.date ? new Date(event.date).toLocaleDateString('ar-MA') : 'غير محدد'}
                      </td>
                      <td className="px-6 py-4">
                          <button 
                            onClick={() => handleTogglePublish(event)}
                            className={`flex items-center gap-1.5 text-sm font-black transition-colors px-3 py-1 rounded-full ${
                              event.isPublished 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-slate-100 text-slate-400'
                            }`}
                          >
                          {event.isPublished ? (
                            <><CheckCircle className="w-4 h-4" /> منشور</>
                          ) : (
                            <><XCircle className="w-4 h-4" /> مسودة</>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-left">
                        <div className="flex justify-start gap-2">
                          {event.facebookUrl && (
                            <a 
                              href={event.facebookUrl} 
                              target="_blank" 
                              className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                              title="فتح في فيسبوك"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                          <button 
                            onClick={() => handleOpenEditModal(event)}
                            className="p-2.5 text-slate-700 dark:text-slate-300 hover:text-black hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-all"
                            title="تعديل"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteEvent(event.id)}
                            className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                            title="حذف"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Form */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isSaving && setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-border"
            >
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {editingEvent?.id ? 'تعديل الفعالية' : 'إضافة فعالية جديدة'}
                </h2>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSaveEvent} className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* Title */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                      <Type className="w-4 h-4 text-primary" /> عنوان الفعالية
                    </label>
                    <input 
                      required
                      type="text"
                      value={editingEvent?.title || ''}
                      onChange={(e) => setEditingEvent({...editingEvent, title: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      placeholder="مثلاً: رحلة استكشافية إلى جبال الأطلس"
                    />
                  </div>

                  {/* Date */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" /> التاريخ
                    </label>
                    <input 
                      type="date"
                      value={editingEvent?.date || ''}
                      onChange={(e) => setEditingEvent({...editingEvent, date: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" /> الموقع
                    </label>
                    <input 
                      type="text"
                      value={editingEvent?.location || ''}
                      onChange={(e) => setEditingEvent({...editingEvent, location: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      placeholder="مكناس، المغرب"
                    />
                  </div>

                  {/* Image URL */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-primary" /> رابط الصورة
                    </label>
                    <input 
                      type="url"
                      value={editingEvent?.imageUrl || ''}
                      onChange={(e) => setEditingEvent({...editingEvent, imageUrl: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                      <AlignLeft className="w-4 h-4 text-primary" /> وصف الفعالية
                    </label>
                    <textarea 
                      required
                      rows={4}
                      value={editingEvent?.description || ''}
                      onChange={(e) => setEditingEvent({...editingEvent, description: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                      placeholder="اكتب تفاصيل الفعالية هنا..."
                    />
                  </div>
                </div>

                <div className="flex flex-col-reverse md:flex-row gap-4">
                  <button 
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 flex items-center justify-center gap-2 py-4 md:py-5 bg-slate-950 text-white rounded-2xl font-black text-lg md:text-xl hover:bg-black hover:shadow-2xl hover:shadow-black/40 transition-all disabled:opacity-50 active:scale-[0.98] border border-white/10"
                  >
                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    حفظ الفعالية
                  </button>
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    disabled={isSaving}
                    className="px-8 py-4 md:py-4 bg-transparent text-slate-900 dark:text-slate-100 rounded-2xl font-bold border-2 border-slate-900 dark:border-slate-100 hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900 transition-all"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isDeleting && setIsDeleteModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8 border border-border text-center"
            >
              <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
                <Trash2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">هل أنت متأكد؟</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-8">
                لا يمكن التراجع عن هذه العملية بعد الحذف.
              </p>
              <div className="flex flex-col-reverse md:flex-row gap-4">
                <button 
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                  تأكيد الحذف
                </button>
                <button 
                  onClick={() => setIsDeleteModalOpen(false)}
                  disabled={isDeleting}
                  className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                >
                  إلغاء
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
