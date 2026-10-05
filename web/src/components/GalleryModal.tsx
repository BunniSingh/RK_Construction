'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { GalleryImage } from '@/lib/types';
import { ImagePlate } from './ImagePlate';
import { urlFor } from '@/lib/sanity.image';

type Props = {
  image: GalleryImage;
  onClose: () => void;
};

export function GalleryModal({ image, onClose }: Props) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return createPortal(
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-label={image.caption}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" type="button" aria-label="Close" onClick={onClose}>
          &times;
        </button>
        <ImagePlate
          src={urlFor(image.image, 1200)}
          alt={image.caption}
          caption={image.caption}
          photoCaption={image.caption}
        />
      </div>
    </div>,
    document.body
  );
}
