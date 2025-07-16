"use client";

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
}

export default function SafeImage({ src, alt, className = "" }: SafeImageProps) {
  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.style.display = 'none';
  };

  return (
    <img 
      src={src} 
      alt={alt} 
      className={className}
      onError={handleError}
    />
  );
}
