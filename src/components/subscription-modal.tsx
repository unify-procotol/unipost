'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { PublicProjectEntity } from '@/entities/public-project';
import { useSubscription } from '@/hooks/use-subscription';
import { useTranslation } from '@/hooks/use-translation';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: PublicProjectEntity;
  locale: string;
}

export default function SubscriptionModal({
  isOpen,
  onClose,
  project,
  locale
}: SubscriptionModalProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const { loading, error, success, subscribe, reset } = useSubscription();
  const { t } = useTranslation(locale);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      return;
    }

    const result = await subscribe({
      email: email.trim(),
      name: name.trim() || undefined,
      prefix: project.prefix,
      labels: [project.name, locale],
    });

    if (result.success) {
      setEmail('');
      setName('');
    }
  };

  const handleClose = () => {
    setEmail('');
    setName('');
    reset();
    onClose();
  };

  // Manage body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const modalContent = (
    <div className="modal-container">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose}></div>
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="relative bg-white rounded-2xl border border-gray-200 max-w-md w-full mx-4 overflow-hidden shadow-xl z-10">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{t('subscription.title')}</h2>
              <p className="text-gray-600 text-sm mt-1">{t('subscription.subtitle')} {project.name}</p>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {success ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('subscription.successTitle')}</h3>
              <p className="text-gray-600 mb-6">{t('subscription.successMessage')}</p>
              <button
                onClick={handleClose}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                {t('subscription.closeButton')}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('subscription.emailLabel')}
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('subscription.emailPlaceholder')}
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Name Input */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('subscription.nameLabel')}
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('subscription.namePlaceholder')}
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="text-sm p-3 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t('subscription.subscribingButton')}
                  </>
                ) : (
                  t('subscription.subscribeButton')
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
    </div>
  );

  // Use portal to render modal at document body level
  return typeof window !== 'undefined' ? createPortal(modalContent, document.body) : null;
}
