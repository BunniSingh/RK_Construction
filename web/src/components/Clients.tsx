import type { Client } from '@/lib/types';
import { RevealGroup } from './RevealGroup';

export function Clients({ clients }: { clients: Client[] }) {
  return (
    <section id="clients">
      <div className="wrap">
        <div className="sheet-label">Sheet 06 / 08 &mdash; Key Clients</div>
        {clients.length === 0 ? (
          <p className="mono" style={{ color: 'var(--muted)' }}>Client list is being updated — check back shortly.</p>
        ) : (
          <RevealGroup className="client-wall">
            {clients.map((c) => (
              <div className="client-cell" key={c._id}>
                <div className="cname">{c.name}</div>
                {c.location && <div className="cloc">{c.location}</div>}
              </div>
            ))}
          </RevealGroup>
        )}
      </div>
    </section>
  );
}
