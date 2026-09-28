import type { Project } from '@/lib/types';
import { ImagePlate } from './ImagePlate';
import { urlFor } from '@/lib/sanity.image';

export function ProjectCard({ project, code }: { project: Project; code: string }) {
  return (
    <article className="proj-card">
      <ImagePlate
        src={urlFor(project.photo, 800)}
        alt={`Site photo — ${project.title}`}
        caption={`Photo pending — ${code}`}
      />
      <div className="proj-body">
        <div className="proj-top">
          <span className="proj-code mono">{code}</span>
          <span className="proj-cat mono">{project.category}</span>
        </div>
        <div className="proj-title">{project.title}</div>
        <div className="proj-meta mono">
          <div><span className="k">Client</span>{project.client}</div>
          <div><span className="k">Location</span>{project.location}</div>
        </div>
      </div>
    </article>
  );
}
