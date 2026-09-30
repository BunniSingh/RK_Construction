import { SkeletonGrid } from '@/components/SkeletonGrid';

export default function LoadingGallery() {
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
          <SkeletonGrid variant="gal" count={9} />
        </div>
      </section>
    </main>
  );
}
