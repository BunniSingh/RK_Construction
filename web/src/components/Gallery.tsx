import type { GalleryImage } from '@/lib/types';
import { GalleryGrid } from './GalleryGrid';

export function Gallery({ images }: { images: GalleryImage[] }) {
  return (
    <section id="gallery">
      <div className="wrap">
        <div className="sheet-label">Sheet 07 / 08 &mdash; Site Gallery</div>
        <GalleryGrid images={images} limit={6} moreHref="/gallery" />
      </div>
    </section>
  );
}
