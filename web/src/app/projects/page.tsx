import { ProjectsGrid } from '@/components/ProjectsGrid';
import { getProjects } from '@/lib/queries';

export const revalidate = 60;

export const metadata = {
  title: 'All Projects — R.K. Constructions',
};

export default async function ProjectsPage() {
  const projects = await getProjects();

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
          {projects.length === 0 ? (
            <p className="mono" style={{ color: 'var(--muted)' }}>Project records are being updated — check back shortly.</p>
          ) : (
            <ProjectsGrid projects={projects} />
          )}
        </div>
      </section>
    </main>
  );
}
