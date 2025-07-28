"use client";

import Image from "next/image";
import { useState } from "react";

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

export default function SafeImage({ 
  src, 
  alt, 
  className = "",
  width = 800,
  height = 600
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    setHasError(true);
  };

  if (hasError) {
    return <div className={`bg-gray-200 ${className}`} style={{ width, height }} />;
  }

  return (
    <Image 
      src={src} 
      alt={alt} 
      width={width}
      height={height}
      className={className}
      onError={handleError}
    />
  );
}
