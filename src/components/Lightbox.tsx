import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { normalizeImageUrl } from '../services/imageUtils';

export interface LightboxItem {
  url: string;
  caption?: string;
}

interface LightboxProps {
  items: LightboxItem[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onIndexChange: (newIndex: number) => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
  items,
  currentIndex,
  isOpen,
  onClose,
  onIndexChange,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onIndexChange((currentIndex - 1 + items.length) % items.length);
      if (e.key === 'ArrowRight') onIndexChange((currentIndex + 1) % items.length);
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, currentIndex, items.length, onClose, onIndexChange]);

  if (!isOpen || items.length === 0) return null;

  const current = items[currentIndex];
  const directUrl = normalizeImageUrl(current?.url);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label="Image gallery lightbox"
    >
      {/* Top action bar */}
      <div className="absolute top-4 right-4 z-50 flex items-center gap-4">
        <span className="text-xs font-mono text-neutral-400">
          {currentIndex + 1} / {items.length}
        </span>
        <button
          onClick={onClose}
          className="p-2 text-neutral-400 hover:text-white bg-neutral-900/80 rounded-md border border-neutral-800 transition-colors cursor-pointer"
          aria-label="Close lightbox"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Previous */}
      {items.length > 1 && (
        <button
          onClick={() => onIndexChange((currentIndex - 1 + items.length) % items.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-neutral-400 hover:text-white bg-neutral-900/60 rounded-full border border-neutral-800 hover:bg-neutral-800 transition-colors z-50"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Image container */}
      <div className="max-w-6xl max-h-[85vh] p-4 flex flex-col items-center">
        <img
          src={directUrl}
          alt={current.caption || 'Project visual'}
          className="max-h-[75vh] max-w-full object-contain rounded-md border border-neutral-800 shadow-2xl"
        />
        {current.caption && (
          <p className="mt-4 text-center text-sm text-neutral-300 max-w-2xl font-medium">
            {current.caption}
          </p>
        )}
      </div>

      {/* Navigation Next */}
      {items.length > 1 && (
        <button
          onClick={() => onIndexChange((currentIndex + 1) % items.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-neutral-400 hover:text-white bg-neutral-900/60 rounded-full border border-neutral-800 hover:bg-neutral-800 transition-colors z-50"
          aria-label="Next image"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};
