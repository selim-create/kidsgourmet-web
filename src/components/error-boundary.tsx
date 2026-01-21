'use client';

import { Component, ReactNode } from 'react';
import { isRateLimitError } from '@/lib/api';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  isRateLimited: boolean;
  retryAfter: number;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, isRateLimited: false, retryAfter: 0 };
  }

  static getDerivedStateFromError(error: Error): State {
    if (isRateLimitError(error)) {
      return {
        hasError: true,
        error,
        isRateLimited: true,
        retryAfter: error.data.retry_after,
      };
    }
    return { hasError: true, error, isRateLimited: false, retryAfter: 0 };
  }

  render() {
    if (this.state.hasError) {
      if (this.state.isRateLimited) {
        return (
          <div className="flex flex-col items-center justify-center min-h-[200px] p-8">
            <div className="text-orange-500 text-6xl mb-4">⏱️</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Çok fazla istek gönderildi
            </h2>
            <p className="text-gray-600 text-center mb-4">
              Lütfen {this.state.retryAfter} saniye bekleyip tekrar deneyin.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
            >
              Sayfayı Yenile
            </button>
          </div>
        );
      }

      return this.props.fallback || (
        <div className="flex flex-col items-center justify-center min-h-[200px] p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Bir hata oluştu
          </h2>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90"
          >
            Tekrar Dene
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
