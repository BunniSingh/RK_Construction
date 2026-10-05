'use client';

import { useState } from 'react';
import type { GalleryImage } from '@/lib/types';
import { ImagePlate } from './ImagePlate';
import { urlFor } from '@/lib/sanity.image';
import { RevealGroup } from './RevealGroup';
import { GalleryModal } from './GalleryModal';

type Props = {
  images: GalleryImage[];
  limit?: number;
  moreHref?: string;
};

export function GalleryGrid({ images, limit, moreHref }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const visible = typeof limit === 'number' ? images.slice(0, limit) : images;
  const hasMore = typeof limit === 'number' && images.length > limit;

  return (
    <>
      <RevealGroup className="gal-grid">
        {visible.map((img, i) => (
          <div key={img._id} className="gal-card" onClick={() => setOpenIndex(i)}>
            <ImagePlate src={urlFor(img.image, 600)} alt={img.caption} caption={img.caption} photoCaption={img.caption} />
          </div>
        ))}
      </RevealGroup>
      {hasMore && moreHref && (
        <div className="more-cta">
          <a className="btn btn-solid" href={moreHref}>View All Photos &rarr;</a>
        </div>
      )}
      {openIndex !== null && (
        <GalleryModal image={visible[openIndex]} onClose={() => setOpenIndex(null)} />
      )}
    </>
  );
}
