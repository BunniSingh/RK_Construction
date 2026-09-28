import type { Service } from '@/lib/types';
import { RevealGroup } from './RevealGroup';

export function Services({ services }: { services: Service[] }) {
  return (
    <section id="services">
      <div className="wrap">
        <div className="sheet-label">Services</div>
        <div className="services-head">
          <h2>Full-spectrum industrial construction.</h2>
          <p>A decade building integrated steel plants — from conceptual design and engineering through construction and ongoing maintenance.</p>
        </div>
        {services.length === 0 ? (
          <p className="mono" style={{ color: 'var(--muted)' }}>The service list is being updated — check back shortly.</p>
        ) : (
          <RevealGroup className="svc-grid">
            {services.map((s, i) => (
              <div className="svc-card" key={s._id}>
                <span className="idx mono">{`S${i + 1}`}</span>
                <div>
                  <div className="t">{s.name}</div>
                  {s.description && <div className="sub">{s.description}</div>}
                </div>
              </div>
            ))}
          </RevealGroup>
        )}
      </div>
    </section>
  );
}
