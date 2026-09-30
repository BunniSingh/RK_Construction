import { GalleryGrid } from '@/components/GalleryGrid';
import { getGalleryImages } from '@/lib/queries';

export const revalidate = 60;

export const metadata = {
  title: 'Site Gallery — R.K. Constructions',
};

export default async function GalleryPage() {
  const images = await getGalleryImages();

  return (
    <main>
      <section className="subpage-hero">
        <div className="wrap">
          <a className="back-link" href="/#gallery">&larr; Back to home</a>
          <h1>Site Gallery</h1>
          <p className="lede">Photos from active R.K. Constructions job sites.</p>
        </div>
      </section>
      <section>
        <div className="wrap">
          {images.length === 0 ? (
            <p className="mono" style={{ color: 'var(--muted)' }}>Gallery is being updated — check back shortly.</p>
          ) : (
            <GalleryGrid images={images} />
          )}
        </div>
      </section>
    </main>
  );
}
