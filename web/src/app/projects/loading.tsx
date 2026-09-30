import { SkeletonGrid } from '@/components/SkeletonGrid';

export default function LoadingProjects() {
  return (
    <main>
      <section className="subpage-hero">
        <div className="wrap">
          <a className="back-link" href="/#projects">&larr; Back to home</a>
          <h1>All Projects</h1>
          <p className="lede">The full record of R.K. Constructions&apos; industrial and infrastructure work.</p>
        </div>
      </section>
      <section>
        <div className="wrap">
          <SkeletonGrid variant="proj" />
        </div>
      </section>
    </main>
  );
}
