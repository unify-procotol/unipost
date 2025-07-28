'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { PublicProjectEntity } from '@/entities/public-project';
import SubscriptionModal from '@/components/subscription-modal';
import SubscriptionConfigModal from '@/components/subscription-config-modal';

type ModalType = 'subscription' | 'subscription-config' | null;

interface ModalProps {
  project: PublicProjectEntity;
  locale: string;
}

interface ModalState {
  type: ModalType;
  isOpen: boolean;
  props?: ModalProps;
}

interface ModalContextType {
  modalState: ModalState;
  openSubscriptionModal: (project: PublicProjectEntity, locale: string) => void;
  openSubscriptionConfigModal: (project: PublicProjectEntity, locale: string) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function useModal() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}

interface ModalProviderProps {
  children: ReactNode;
}

export function ModalProvider({ children }: ModalProviderProps) {
  const [modalState, setModalState] = useState<ModalState>({
    type: null,
    isOpen: false,
    props: undefined,
  });

  const openSubscriptionModal = useCallback((project: PublicProjectEntity, locale: string) => {
    setModalState({
      type: 'subscription',
      isOpen: true,
      props: { project, locale },
    });
  }, []);

  const openSubscriptionConfigModal = useCallback((project: PublicProjectEntity, locale: string) => {
    setModalState({
      type: 'subscription-config',
      isOpen: true,
      props: { project, locale },
    });
  }, []);

  const closeModal = useCallback(() => {
    setModalState({
      type: null,
      isOpen: false,
      props: undefined,
    });
  }, []);

  const contextValue: ModalContextType = {
    modalState,
    openSubscriptionModal,
    openSubscriptionConfigModal,
    closeModal,
  };

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
      
      {/* Global Modal Renderer */}
      {modalState.isOpen && modalState.type === 'subscription' && modalState.props && (
        <SubscriptionModal
          isOpen={modalState.isOpen}
          onClose={closeModal}
          project={modalState.props.project}
          locale={modalState.props.locale}
        />
      )}
      
      {modalState.isOpen && modalState.type === 'subscription-config' && modalState.props && (
        <SubscriptionConfigModal
          isOpen={modalState.isOpen}
          onClose={closeModal}
          project={modalState.props.project}
          locale={modalState.props.locale}
        />
      )}
    </ModalContext.Provider>
  );
}