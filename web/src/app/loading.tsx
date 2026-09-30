import { SkeletonGrid } from '@/components/SkeletonGrid';

export default function LoadingHome() {
  return (
    <main>
      <section className="hero">
        <div className="wrap">
          <div className="skeleton skel-line" style={{ width: 220, marginBottom: 18 }} />
          <div className="skeleton skel-hero" style={{ marginBottom: 10 }} />
          <div className="skeleton skel-hero" style={{ width: '70%' }} />
          <div className="hero-ctas">
            <div className="skeleton skel-line" style={{ width: 160, height: 42 }} />
            <div className="skeleton skel-line" style={{ width: 140, height: 42 }} />
          </div>
        </div>
      </section>
      <section>
        <div className="wrap">
          <div className="skeleton skel-line" style={{ width: 140, marginBottom: 22 }} />
          <SkeletonGrid variant="proj" count={3} />
        </div>
      </section>
    </main>
  );
}
