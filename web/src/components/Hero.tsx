import { StatReadout, type Stat } from './StatReadout';

const STATS: Stat[] = [
  { target: 10, suffix: '+', label: 'Years in operation' },
  { target: 10, prefix: '₹', suffix: 'Cr+', label: 'Annual project value' },
  { target: 300, suffix: '+', label: 'Workforce on site' },
  { target: 15, suffix: '+', label: 'Engineering staff' },
];

export function Hero() {
  return (
    <section className="hero">
      <div className="wrap hero-grid">
        <div>
          <span className="eyebrow">Raigarh, Chhattisgarh &middot; Est. one decade in industrial construction</span>
          <h1>We build what <span>steel</span> runs on.</h1>
          <p className="lede">
            R.K. Constructions delivers industrial and infrastructure projects for India&apos;s steel and power
            plants — sinter plants, blast furnaces, treatment plants and the roads that connect them — on
            schedule, on spec, without compromise.
          </p>
          <div className="hero-ctas">
            <a className="btn btn-solid" href="#contact">Request a Proposal &rarr;</a>
            <a className="btn" href="#projects">View Projects</a>
          </div>
        </div>
        <StatReadout stats={STATS} />
      </div>
    </section>
  );
}
