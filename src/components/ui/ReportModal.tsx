'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { reportContent } from '@/lib/community';

interface ReportModalProps {
  contentType: 'discussion' | 'comment';
  contentId: number;
  onClose: () => void;
}

const reportReasons = [
  { value: 'spam', label: 'Spam veya reklam' },
  { value: 'inappropriate', label: 'Uygunsuz içerik' },
  { value: 'harassment', label: 'Taciz veya zorbalık' },
  { value: 'misinformation', label: 'Yanlış bilgi (özellikle tıbbi)' },
  { value: 'other', label: 'Diğer' },
];

export default function ReportModal({ contentType, contentId, onClose }: ReportModalProps) {
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!reason) {
      toast.error('Lütfen bir sebep seçin');
      return;
    }

    try {
      setSubmitting(true);
      await reportContent(contentType, contentId, reason, description.trim() || undefined);
      toast.success('Raporunuz alındı. İnceleme yapılacaktır.');
      onClose();
    } catch (error) {
      console.error('Error reporting content:', error);
      toast.error('Raporlama sırasında bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-800">İçeriği Raporla</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Raporlama Sebebi *
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
              required
            >
              <option value="">Bir sebep seçin</option>
              {reportReasons.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Açıklama (opsiyonel)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Lütfen detay verin..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors resize-none"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={submitting || !reason}
              className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Gönderiliyor...' : 'Gönder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
