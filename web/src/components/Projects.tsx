import type { Project } from '@/lib/types';
import { ProjectsGrid } from './ProjectsGrid';

export function Projects({ projects }: { projects: Project[] }) {
  return (
    <section id="projects">
      <div className="wrap">
        <div className="sheet-label">Selected Projects</div>
        {projects.length === 0 ? (
          <p className="mono" style={{ color: 'var(--muted)' }}>Project records are being updated — check back shortly.</p>
        ) : (
          <ProjectsGrid projects={projects} limit={6} moreHref="/projects" />
        )}
      </div>
    </section>
  );
}
