import type { SiteSettings } from '@/lib/types';
import { RevealGroup } from './RevealGroup';

const FALLBACK = {
  workforceCount: '300+ (variable)',
  engineeringStaffCount: '15+ engineers',
  coreExpertise: 'Steel Plants, ETPs & RCC Works',
  annualProjectValue: '₹10 Cr+',
};

export function Overview({ settings }: { settings: SiteSettings | null }) {
  const s = { ...FALLBACK, ...(settings ?? {}) };
  return (
    <section id="overview">
      <div className="wrap">
        <div className="sheet-label">Overview</div>
        <RevealGroup className="overview-grid">
          <div className="overview">
            <h2>Precision, at industrial scale.</h2>
            <p>
              R.K. Constructions is an emerging infrastructure development company where innovation meets
              precision. With a decade of experience, we specialize in delivering high-quality, efficient
              solutions for complex industrial and infrastructure projects.
            </p>
            <p>We build more than structures; we build lasting partnerships and transformative spaces that drive our clients&apos; success.</p>
          </div>
          <div className="fact-panel mono">
            <div className="row"><span className="k">Headquarters</span><span className="v">Raigarh, CG</span></div>
            <div className="row"><span className="k">Workforce</span><span className="v">{s.workforceCount}</span></div>
            <div className="row"><span className="k">Technical staff</span><span className="v">{s.engineeringStaffCount}</span></div>
            <div className="row"><span className="k">Core expertise</span><span className="v">{s.coreExpertise}</span></div>
            <div className="row"><span className="k">Annual project value</span><span className="v">{s.annualProjectValue}</span></div>
          </div>
        </RevealGroup>
      </div>
    </section>
  );
}
