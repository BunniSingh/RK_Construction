'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { Project } from '@/lib/types';
import { ImagePlate } from './ImagePlate';
import { urlFor } from '@/lib/sanity.image';

type Props = {
  project: Project;
  code: string;
  onClose: () => void;
};

export function ProjectModal({ project, code, onClose }: Props) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return createPortal(
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-label={project.title}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" type="button" aria-label="Close" onClick={onClose}>
          &times;
        </button>
        <ImagePlate
          src={urlFor(project.photo, 1000)}
          alt={`Site photo — ${project.title}`}
          caption={`Photo pending — ${code}`}
        />
        <div className="modal-body">
          <div className="proj-top">
            <span className="proj-code mono">{code}</span>
            <span className="proj-cat mono">{project.category}</span>
          </div>
          <h3 className="modal-title">{project.title}</h3>
          <div className="proj-meta mono">
            <div><span className="k">Client</span>{project.client}</div>
            <div><span className="k">Location</span>{project.location}</div>
          </div>
          {project.description && <p className="modal-description">{project.description}</p>}
        </div>
      </div>
    </div>,
    document.body
  );
}
