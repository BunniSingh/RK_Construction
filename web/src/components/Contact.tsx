import type { SiteSettings } from '@/lib/types';
import { ContactForm } from './ContactForm';
import { RevealGroup } from './RevealGroup';

const FALLBACK = {
  address: 'House No. 24, Bhagwanpur Uper Basti, Jindal Road, Raigarh, CG',
  phone: '+91 97524 50852',
  email: 'raju2021rgh@gmail.com',
};

export function Contact({ settings }: { settings: SiteSettings | null }) {
  const s = { ...FALLBACK, ...(settings ?? {}) };
  return (
    <section id="contact" style={{ borderBottom: 'none' }}>
      <div className="wrap">
        <div className="sheet-label">Contact</div>
        <RevealGroup className="contact-grid">
          <div className="contact-info">
            <h2 style={{ fontSize: 'clamp(26px,4vw,36px)', marginBottom: 18 }}>Start a proposal.</h2>
            <div className="row"><span className="k">Address</span><span className="v">{s.address}</span></div>
            <div className="row"><span className="k">Phone</span><span className="v">{s.phone}</span></div>
            <div className="row"><span className="k">Email</span><span className="v">{s.email}</span></div>
          </div>
          <ContactForm />
        </RevealGroup>
      </div>
    </section>
  );
}
