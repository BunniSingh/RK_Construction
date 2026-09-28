import type { GalleryImage } from '@/lib/types';
import { GalleryGrid } from './GalleryGrid';

export function Gallery({ images }: { images: GalleryImage[] }) {
  return (
    <section id="gallery">
      <div className="wrap">
        <div className="sheet-label">Site Gallery</div>
        <GalleryGrid images={images} limit={6} moreHref="/gallery" />
      </div>
    </section>
  );
}
