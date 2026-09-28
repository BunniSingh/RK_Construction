import type { GalleryImage } from '@/lib/types';
import { GalleryGrid } from './GalleryGrid';

export function Gallery({ images }: { images: GalleryImage[] }) {
  return (
    <section id="gallery">
      <div className="wrap">
        <div className="sheet-label">Site Gallery</div>
        <div className="section-head">
          <h2>Inside an active site.</h2>
          <p>Real photographs from our ongoing ETP and industrial works — no stock imagery.</p>
        </div>
        <GalleryGrid images={images} limit={6} moreHref="/gallery" />
      </div>
    </section>
  );
}
