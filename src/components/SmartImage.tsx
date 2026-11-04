import React, { useState } from 'react';
import { normalizeImageUrl, getFallbackImageSvg } from '../services/imageUtils';

interface SmartImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string | null;
  alt: string;
  fallbackTitle?: string;
  className?: string;
  aspectRatioClass?: string;
}

export const SmartImage: React.FC<SmartImageProps> = ({
  src,
  alt,
  fallbackTitle,
  className = '',
  aspectRatioClass = 'aspect-[16/9]',
  ...rest
}) => {
  const cleanSrc = normalizeImageUrl(src);
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  React.useEffect(() => {
    setHasError(false);
    setIsLoaded(false);
  }, [cleanSrc]);

  if (!cleanSrc || hasError) {
    const fallbackDataUri = getFallbackImageSvg(fallbackTitle || alt);
    return (
      <div className={`relative overflow-hidden bg-neutral-900 ${aspectRatioClass}`}>
        <img
          src={fallbackDataUri}
          alt={alt}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/60 to-transparent pointer-events-none" />
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-neutral-900 ${aspectRatioClass}`}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-neutral-900 animate-pulse flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-neutral-700 border-t-neutral-400 rounded-full animate-spin" />
        </div>
      )}
      <img
        src={cleanSrc}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
        {...rest}
      />
    </div>
  );
};
