'use client';

import React, { useState } from 'react';
import { ImageOff } from 'lucide-react';
import { cn } from '@/lib/cn';

interface SmartImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  ratio?: string;
  className?: string;
  imgClassName?: string;
  fallbackLabel?: string;
  priority?: boolean;
}

/**
 * Local-image friendly image with a graceful branded fallback.
 * Avoids broken-image icons in the final experience.
 */
export const SmartImage: React.FC<SmartImageProps> = ({
  src,
  alt,
  ratio = 'aspect-[4/3]',
  className,
  imgClassName,
  fallbackLabel,
  priority,
  ...props
}) => {
  const [failed, setFailed] = useState(false);

  return (
    <div className={cn('relative overflow-hidden bg-sage-light', ratio, className)}>
      {failed ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-sage-light text-brand/60">
          <ImageOff className="h-6 w-6" strokeWidth={1.6} aria-hidden="true" />
          {fallbackLabel && (
            <span className="px-3 text-center text-[11px] font-semibold text-charcoal-secondary">
              {fallbackLabel}
            </span>
          )}
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onError={() => setFailed(true)}
          className={cn('h-full w-full object-cover', imgClassName)}
          {...props}
        />
      )}
    </div>
  );
};
