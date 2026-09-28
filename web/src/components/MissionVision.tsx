import type { SiteSettings } from '@/lib/types';
import { RevealGroup } from './RevealGroup';

const FALLBACK_MISSION = 'To lead the construction industry with a commitment to excellence, safety, and innovation — exceeding client expectations through meticulous planning, transparent communication, and exceptional craftsmanship.';
const FALLBACK_VISION = 'To be the premier choice in the construction industry, renowned for innovation, sustainability and excellence — shaping the future of industrial infrastructure.';

export function MissionVision({ settings }: { settings: SiteSettings | null }) {
  return (
    <section id="mission">
      <div className="wrap">
        <div className="sheet-label">Mission &amp; Vision</div>
        <RevealGroup className="mv-grid">
          <div className="mv-card">
            <span className="clause">01 &mdash; Mission</span>
            <h3>Lead with excellence, safety and trust.</h3>
            <p style={{ color: 'var(--muted)', fontSize: 14.5 }}>{settings?.mission || FALLBACK_MISSION}</p>
          </div>
          <div className="mv-card">
            <span className="clause">02 &mdash; Vision</span>
            <h3>Set the standard for industrial infrastructure.</h3>
            <p style={{ color: 'var(--muted)', fontSize: 14.5 }}>{settings?.vision || FALLBACK_VISION}</p>
          </div>
        </RevealGroup>
      </div>
    </section>
  );
}
