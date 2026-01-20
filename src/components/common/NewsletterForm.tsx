'use client';

import { useState } from 'react';
import Link from 'next/link';
import { newsletterService, NewsletterSubscriptionRequest } from '@/services/newsletterService';

interface NewsletterFormProps {
  source: string;
  variant?: 'default' | 'compact' | 'inline';
  placeholder?: string;
  buttonText?: string;
  showNameField?: boolean;
  className?: string;
  buttonClassName?: string;
  interests?: string[];
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

// Consent Checkbox Component - defined outside to avoid recreation on render
function ConsentCheckbox({ source, checked, onChange }: { source: string; checked: boolean; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <div className="flex items-center gap-2 mt-3">
      <input
        type="checkbox"
        id={`consent-${source}`}
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 shrink-0 text-orange-500 border-gray-300 rounded focus:ring-orange-500 cursor-pointer"
      />
      <label htmlFor={`consent-${source}`} className="text-xs text-gray-500 cursor-pointer">
        Bültene üye olarak{' '}
        <Link href="/aydinlatma-metni" className="text-orange-500 hover:underline font-medium">
          Aydınlatma Metni
        </Link>
        &apos;ni okuyup anladığımı kabul ediyorum.
      </label>
    </div>
  );
}

export default function NewsletterForm({
  source,
  variant = 'default',
  placeholder = 'Mail Adresiniz',
  buttonText = 'Abone Ol',
  showNameField = false,
  className = '',
  buttonClassName,
  interests = [],
  onSuccess,
  onError,
}: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [consentChecked, setConsentChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Geçerli bir e-posta adresi girin.');
      return;
    }

    if (!consentChecked) {
      setStatus('error');
      setMessage('Devam etmek için Aydınlatma Metni&apos;ni kabul etmelisiniz.');
      return;
    }

    setIsLoading(true);
    setStatus('idle');

    const data: NewsletterSubscriptionRequest = {
      email,
      source,
      interests: interests.length > 0 ? interests : undefined,
    };

    if (showNameField && name) {
      data.name = name;
    }

    const result = await newsletterService.subscribe(data);

    setIsLoading(false);

    if (result.success) {
      setStatus('success');
      setMessage(result.message || 'Başarıyla abone oldunuz! Onay e-postanızı kontrol edin.');
      setEmail('');
      setName('');
      setConsentChecked(false);
      onSuccess?.();
    } else {
      setStatus('error');
      setMessage(result.message || 'Bir hata oluştu. Lütfen tekrar deneyin.');
      onError?.(result.message || 'Bir hata oluştu.');
    }

    // 5 saniye sonra mesajı temizle
    setTimeout(() => {
      setStatus('idle');
      setMessage('');
    }, 5000);
  };

  // Başarı durumu
  if (status === 'success') {
    return (
      <div className={`bg-green-50 border border-green-200 rounded-xl p-4 text-center ${className}`}>
        <div className="text-green-600 mb-2">
          <i className="fa-solid fa-check-circle text-2xl"></i>
        </div>
        <p className="text-green-700 text-sm font-medium">{message}</p>
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={className}>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={placeholder}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-orange-500 bg-gray-50 focus:bg-white transition-colors"
            disabled={isLoading}
            required
          />
          <button
            type="submit"
            disabled={isLoading || !consentChecked}
            className="bg-slate-800 text-white font-bold py-2.5 px-4 rounded-xl text-sm hover:bg-slate-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <i className="fa-solid fa-spinner fa-spin"></i>
            ) : (
              <i className="fa-solid fa-paper-plane"></i>
            )}
          </button>
        </form>
        <ConsentCheckbox source={source} checked={consentChecked} onChange={(e) => setConsentChecked(e.target.checked)} />
        {status === 'error' && (
          <p className="text-red-500 text-xs mt-2">{message}</p>
        )}
      </div>
    );
  }

  // Inline variant
  if (variant === 'inline') {
    return (
      <div className={className}>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={placeholder}
            className="flex-1 py-3 px-6 rounded-full border border-gray-200 outline-none focus:border-green-500 shadow-sm"
            disabled={isLoading}
            required
          />
          <button
            type="submit"
            disabled={isLoading || !consentChecked}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full shadow-md transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                Gönderiliyor...
              </>
            ) : (
              buttonText
            )}
          </button>
        </form>
        <ConsentCheckbox source={source} checked={consentChecked} onChange={(e) => setConsentChecked(e.target.checked)} />
        {status === 'error' && (
          <p className="text-red-500 text-sm text-center sm:text-left mt-2">{message}</p>
        )}
      </div>
    );
  }

  // Default variant
  return (
    <div className={className}>
      <form onSubmit={handleSubmit}>
        {showNameField && (
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Adınız (opsiyonel)"
            className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm mb-2 outline-none focus:border-orange-500"
            disabled={isLoading}
          />
        )}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm mb-2 outline-none focus:border-orange-500"
          disabled={isLoading}
          required
        />
        <button
          type="submit"
          disabled={isLoading || !consentChecked}
          className={buttonClassName || "w-full bg-orange-500 text-white font-bold py-2 rounded-xl text-sm hover:bg-orange-600 transition-colors disabled:opacity-50"}
        >
          {isLoading ? (
            <>
              <i className="fa-solid fa-spinner fa-spin mr-2"></i>
              Gönderiliyor...
            </>
          ) : (
            buttonText
          )}
        </button>
      </form>
      <ConsentCheckbox source={source} checked={consentChecked} onChange={(e) => setConsentChecked(e.target.checked)} />
      {status === 'error' && (
        <p className="text-red-500 text-xs mt-2">{message}</p>
      )}
    </div>
  );
}
