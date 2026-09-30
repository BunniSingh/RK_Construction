import type { GalleryImage } from '@/lib/types';
import { ImagePlate } from './ImagePlate';
import { urlFor } from '@/lib/sanity.image';
import { RevealGroup } from './RevealGroup';

type Props = {
  images: GalleryImage[];
  limit?: number;
  moreHref?: string;
};

export function GalleryGrid({ images, limit, moreHref }: Props) {
  const visible = typeof limit === 'number' ? images.slice(0, limit) : images;
  const hasMore = typeof limit === 'number' && images.length > limit;

  return (
    <>
      <RevealGroup className="gal-grid">
        {visible.map((img) => (
          <ImagePlate key={img._id} src={urlFor(img.image, 600)} alt={img.caption} caption={img.caption} photoCaption={img.caption} />
        ))}
      </RevealGroup>
      {hasMore && moreHref && (
        <div className="more-cta">
          <a className="btn btn-solid" href={moreHref}>View All Photos &rarr;</a>
        </div>
      )}
    </>
  );
}
