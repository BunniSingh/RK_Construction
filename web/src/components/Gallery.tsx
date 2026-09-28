import type { GalleryImage } from '@/lib/types';
import { ImagePlate } from './ImagePlate';
import { urlFor } from '@/lib/sanity.image';
import { RevealGroup } from './RevealGroup';

export function Gallery({ images }: { images: GalleryImage[] }) {
  return (
    <section id="gallery">
      <div className="wrap">
        <div className="sheet-label">Sheet 07 / 08 &mdash; Site Gallery</div>
        <RevealGroup className="gal-grid">
          {images.map((img) => (
            <ImagePlate key={img._id} src={urlFor(img.image, 600)} alt={img.caption} caption={img.caption} />
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
