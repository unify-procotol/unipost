'use client';

import { useState } from 'react';
import { PublicProjectEntity } from '@/entities/public-project';
import { useSubscription } from '@/hooks/use-subscription';

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

  if (!isOpen) return null;

  // Translations for different locales
  const translations: Record<string, {
    title: string;
    subtitle: string;
    emailLabel: string;
    emailPlaceholder: string;
    nameLabel: string;
    namePlaceholder: string;
    subscribeButton: string;
    subscribingButton: string;
    closeButton: string;
    successTitle: string;
    successMessage: string;
  }> = {
    en: {
      title: 'Subscribe to Newsletter',
      subtitle: `Get the latest updates from ${project.name}`,
      emailLabel: 'Email Address',
      emailPlaceholder: 'Enter your email',
      nameLabel: 'Name (Optional)',
      namePlaceholder: 'Enter your name',
      subscribeButton: 'Subscribe',
      subscribingButton: 'Subscribing...',
      closeButton: 'Close',
      successTitle: 'Successfully Subscribed!',
      successMessage: 'Thank you for subscribing. You will receive updates in your inbox.',
    },
    zh: {
      title: '订阅新闻通讯',
      subtitle: `获取来自 ${project.name} 的最新更新`,
      emailLabel: '邮箱地址',
      emailPlaceholder: '请输入您的邮箱',
      nameLabel: '姓名（可选）',
      namePlaceholder: '请输入您的姓名',
      subscribeButton: '订阅',
      subscribingButton: '订阅中...',
      closeButton: '关闭',
      successTitle: '订阅成功！',
      successMessage: '感谢您的订阅。您将在收件箱中收到更新。',
    },
    es: {
      title: 'Suscribirse al Boletín',
      subtitle: `Recibe las últimas actualizaciones de ${project.name}`,
      emailLabel: 'Dirección de Correo',
      emailPlaceholder: 'Ingresa tu correo',
      nameLabel: 'Nombre (Opcional)',
      namePlaceholder: 'Ingresa tu nombre',
      subscribeButton: 'Suscribirse',
      subscribingButton: 'Suscribiendo...',
      closeButton: 'Cerrar',
      successTitle: '¡Suscripción Exitosa!',
      successMessage: 'Gracias por suscribirte. Recibirás actualizaciones en tu bandeja de entrada.',
    },
  };

  const t = translations[locale] || translations.en;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-2xl border border-gray-700 max-w-md w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">{t.title}</h2>
              <p className="text-gray-400 text-sm mt-1">{t.subtitle}</p>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-300 transition-colors"
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
              <h3 className="text-lg font-semibold text-white mb-2">{t.successTitle}</h3>
              <p className="text-gray-400 mb-6">{t.successMessage}</p>
              <button
                onClick={handleClose}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                {t.closeButton}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  {t.emailLabel}
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.emailPlaceholder}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Name Input */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  {t.nameLabel}
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t.namePlaceholder}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t.subscribingButton}
                  </>
                ) : (
                  t.subscribeButton
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
