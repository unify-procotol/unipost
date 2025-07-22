'use client';

import { useState } from 'react';
import { ProjectEntity } from '@/entities/project';
import SubscriptionModal from './subscription-modal';

interface SubscribeButtonProps {
  project: ProjectEntity;
  locale: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function SubscribeButton({ 
  project, 
  locale, 
  variant = 'primary',
  size = 'md',
  className = '' 
}: SubscribeButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Don't render if project doesn't have Ghost Admin API key
  if (!project.ghost_admin_key || project.ghost_admin_key.trim() === '') {
    return null;
  }

  // Translations for different locales
  const translations: Record<string, string> = {
    en: 'Subscribe',
    zh: '订阅',
    es: 'Suscribirse',
    fr: "S'abonner",
    de: 'Abonnieren',
    ja: '購読',
    ko: '구독',
  };

  const buttonText = translations[locale] || translations.en;

  // Style variants
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white border-transparent',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white border-transparent',
    outline: 'bg-transparent hover:bg-blue-600/10 text-blue-400 border-blue-500/50 hover:border-blue-400',
  };

  // Size variants
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900';
  
  const buttonClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  const handleClick = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <button
        onClick={handleClick}
        className={buttonClasses}
        title={`Subscribe to ${project.name}`}
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        {buttonText}
      </button>

      <SubscriptionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        project={project}
        locale={locale}
      />
    </>
  );
}
