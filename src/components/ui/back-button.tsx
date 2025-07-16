"use client";

interface BackButtonProps {
  children: React.ReactNode;
  className?: string;
}

export default function BackButton({ children, className = "" }: BackButtonProps) {
  const handleBack = () => {
    if (typeof window !== 'undefined') {
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
