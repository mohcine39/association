import { useState } from 'react';
import { X } from 'lucide-react';

interface AddEventModalProps {
  onClose: () => void;
  onSave: (event: any) => void;
}

export default function AddEventModal({ onClose, onSave }: AddEventModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [facebookUrl, setFacebookUrl] = useState('');
  const [isPublished, setIsPublished] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newEvent = {
      title,
      description,
      date: date ? new Date(date).toISOString() : null,
      location,
      imageUrl: imageUrl || null,
      facebookUrl: facebookUrl || null,
      isPublished,
    };
    onSave(newEvent);
    // reset fields
    setTitle('');
    setDescription('');
    setDate('');
    setLocation('');
    setImageUrl('');
    setFacebookUrl('');
    setIsPublished(true);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 w-full max-w-lg shadow-lg relative">
        <button
          className="absolute top-3 right-3 text-slate-500 hover:text-slate-800"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
          إضافة فعالية جديدة
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            required
            placeholder="العنوان"
            className="w-full px-4 py-2 border rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            required
            placeholder="الوصف"
            className="w-full px-4 py-2 border rounded h-24"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            type="date"
            className="w-full px-4 py-2 border rounded"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <input
            placeholder="الموقع"
            className="w-full px-4 py-2 border rounded"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <input
            placeholder="رابط الصورة (URL)"
            className="w-full px-4 py-2 border rounded"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
          <input
            placeholder="رابط الفيسبوك"
            className="w-full px-4 py-2 border rounded"
            value={facebookUrl}
            onChange={(e) => setFacebookUrl(e.target.value)}
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
            />
            <span>نشر الفعالية</span>
          </label>
          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded hover:bg-primary/90 transition"
          >
            حفظ الفعالية
          </button>
        </form>
      </div>
    </div>
  );
}
