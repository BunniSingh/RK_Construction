'use client';

import { useState } from 'react';
import type { Project } from '@/lib/types';
import { ProjectCard } from './ProjectCard';
import { ProjectModal } from './ProjectModal';
import { RevealGroup } from './RevealGroup';

type Props = {
  projects: Project[];
  limit?: number;
  moreHref?: string;
};

function codeFor(i: number) {
  return `P-${String(i + 1).padStart(2, '0')}`;
}

export function ProjectsGrid({ projects, limit, moreHref }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const visible = typeof limit === 'number' ? projects.slice(0, limit) : projects;
  const hasMore = typeof limit === 'number' && projects.length > limit;

  return (
    <>
      <RevealGroup className="proj-grid">
        {visible.map((p, i) => (
          <ProjectCard key={p._id} project={p} code={codeFor(i)} onClick={() => setOpenIndex(i)} />
        ))}
      </RevealGroup>
      {hasMore && moreHref && (
        <div className="more-cta">
          <a className="btn btn-solid" href={moreHref}>View All Projects &rarr;</a>
        </div>
      )}
      {openIndex !== null && (
        <ProjectModal
          project={visible[openIndex]}
          code={codeFor(openIndex)}
          onClose={() => setOpenIndex(null)}
        />
      )}
    </>
  );
}
