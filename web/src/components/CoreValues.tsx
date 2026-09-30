import { RevealGroup } from './RevealGroup';

const VALUES = [
  { no: '3.1', name: 'Excellence', body: 'We pursue excellence in all aspects of our work, delivering projects of the highest quality that exceed client expectations.' },
  { no: '3.2', name: 'Integrity', body: 'We uphold the highest ethical standards, fostering trust and transparency with clients, partners and stakeholders.' },
  { no: '3.3', name: 'Safety', body: 'Safety is our top priority — a secure work environment through rigorous standards, comprehensive training, and continuous vigilance.' },
  { no: '3.4', name: 'Planning & Deliverables', body: 'Meticulous planning, efficient workflows and proactive management ensure every project ships on schedule, without compromising quality or safety.' },
];

export function CoreValues() {
  return (
    <section id="values">
      <div className="wrap">
        <div className="sheet-label">Core Values</div>
        <div className="section-head">
          <h2>The standards we build to.</h2>
          <p>Four principles that govern how our teams operate on every site, from tender to handover.</p>
        </div>
        <RevealGroup className="values-list">
          {VALUES.map((v) => (
            <div className="value-row" key={v.no}>
              <span className="clause-no">{v.no}</span>
              <div><h3>{v.name}</h3><p>{v.body}</p></div>
            </div>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
