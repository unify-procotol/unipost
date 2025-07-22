'use client';

import { ProjectEntity } from '@/entities/project';

interface SubscriptionConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectEntity;
  locale: string;
}

export default function SubscriptionConfigModal({ 
  isOpen, 
  onClose, 
  project, 
  locale 
}: SubscriptionConfigModalProps) {
  if (!isOpen) return null;

  // Translations for different locales
  const translations: Record<string, {
    title: string;
    subtitle: string;
    description: string;
    steps: string[];
    closeButton: string;
    contactAdmin: string;
  }> = {
    en: {
      title: 'Subscription Not Available',
      subtitle: 'This project needs to be configured for newsletter subscriptions',
      description: 'To enable newsletter subscriptions for this project, the administrator needs to configure the Ghost Admin API key.',
      steps: [
        'Go to your Ghost Admin panel',
        'Navigate to Settings → Integrations',
        'Create a new custom integration or use an existing one',
        'Copy the Admin API Key (not the Content API Key)',
        'Add this key to the project configuration'
      ],
      closeButton: 'Got it',
      contactAdmin: 'Contact Administrator',
    },
    zh: {
      title: '订阅功能不可用',
      subtitle: '此项目需要配置新闻通讯订阅功能',
      description: '要为此项目启用新闻通讯订阅，管理员需要配置 Ghost Admin API 密钥。',
      steps: [
        '前往您的 Ghost 管理面板',
        '导航到设置 → 集成',
        '创建新的自定义集成或使用现有集成',
        '复制 Admin API 密钥（不是 Content API 密钥）',
        '将此密钥添加到项目配置中'
      ],
      closeButton: '知道了',
      contactAdmin: '联系管理员',
    },
    es: {
      title: 'Suscripción No Disponible',
      subtitle: 'Este proyecto necesita ser configurado para suscripciones de boletín',
      description: 'Para habilitar las suscripciones de boletín para este proyecto, el administrador necesita configurar la clave de Ghost Admin API.',
      steps: [
        'Ve a tu panel de administración de Ghost',
        'Navega a Configuración → Integraciones',
        'Crea una nueva integración personalizada o usa una existente',
        'Copia la Clave de Admin API (no la Clave de Content API)',
        'Agrega esta clave a la configuración del proyecto'
      ],
      closeButton: 'Entendido',
      contactAdmin: 'Contactar Administrador',
    },
  };

  const t = translations[locale] || translations.en;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-2xl border border-gray-700 max-w-lg w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">{t.title}</h2>
                <p className="text-gray-400 text-sm">{t.subtitle}</p>
              </div>
            </div>
            <button
              onClick={onClose}
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
          <p className="text-gray-300 mb-6">{t.description}</p>

          {/* Setup Steps */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-white mb-3">Setup Steps:</h3>
            <ol className="space-y-2">
              {t.steps.map((step: string, index: number) => (
                <li key={index} className="flex items-start gap-3 text-sm text-gray-300">
                  <span className="flex-shrink-0 w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-medium">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Project Info */}
          <div className="bg-gray-700/50 rounded-lg p-4 mb-6">
            <h4 className="text-sm font-medium text-white mb-2">Project Information:</h4>
            <div className="space-y-1 text-sm text-gray-300">
              <div><span className="text-gray-400">Name:</span> {project.name}</div>
              <div><span className="text-gray-400">Domain:</span> {project.ghost_domain}</div>
              <div><span className="text-gray-400">Prefix:</span> {project.prefix}</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              {t.closeButton}
            </button>
            <button
              onClick={() => {
                // You can implement contact functionality here
                window.open('mailto:admin@example.com?subject=Ghost Admin API Configuration Request&body=Please configure Ghost Admin API for project: ' + project.name, '_blank');
              }}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              {t.contactAdmin}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
