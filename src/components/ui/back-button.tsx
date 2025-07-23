"use client";

import { useRouter } from 'next/navigation';

interface BackButtonProps {
  children: React.ReactNode;
  className?: string;
  href?: string;
}

export default function BackButton({ children, className = "", href }: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    if (href) {
      router.push(href);
    } else if (typeof window !== 'undefined') {
      window.history.back();
    }
  };

  return (
    <button
      onClick={handleBack}
      className={className}
    >
      {children}
    </button>
  );
}
