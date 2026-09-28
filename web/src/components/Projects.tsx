import type { Project } from '@/lib/types';
import { ProjectCard } from './ProjectCard';
import { RevealGroup } from './RevealGroup';

export function Projects({ projects }: { projects: Project[] }) {
  return (
    <section id="projects">
      <div className="wrap">
        <div className="sheet-label">Sheet 05 / 08 &mdash; Selected Projects</div>
        {projects.length === 0 ? (
          <p className="mono" style={{ color: 'var(--muted)' }}>Project records are being updated — check back shortly.</p>
        ) : (
          <RevealGroup className="proj-grid">
            {projects.map((p, i) => (
              <ProjectCard key={p._id} project={p} code={`P-${String(i + 1).padStart(2, '0')}`} />
            ))}
          </RevealGroup>
        )}
      </div>
    </section>
  );
}
