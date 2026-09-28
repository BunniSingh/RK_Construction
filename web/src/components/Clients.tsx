import Image from 'next/image';
import type { Client } from '@/lib/types';
import { RevealGroup } from './RevealGroup';
import { urlFor } from '@/lib/sanity.image';

export function Clients({ clients }: { clients: Client[] }) {
  return (
    <section id="clients">
      <div className="wrap">
        <div className="sheet-label">Key Clients</div>
        {clients.length === 0 ? (
          <p className="mono" style={{ color: 'var(--muted)' }}>Client list is being updated — check back shortly.</p>
        ) : (
          <RevealGroup className="client-wall">
            {clients.map((c) => {
              const logoUrl = urlFor(c.logo, 240);
              return (
                <div className="client-cell" key={c._id}>
                  {logoUrl && (
                    <div className="clogo">
                      <Image src={logoUrl} alt={`${c.name} logo`} width={120} height={48} unoptimized style={{ objectFit: 'contain', width: 'auto', height: '100%' }} />
                    </div>
                  )}
                  <div className="ctext">
                    <div className="cname">{c.name}</div>
                    {c.location && <div className="cloc">{c.location}</div>}
                  </div>
                </div>
              );
            })}
          </RevealGroup>
        )}
      </div>
    </section>
  );
}
