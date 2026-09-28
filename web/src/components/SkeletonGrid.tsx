type Props = {
  variant: 'proj' | 'gal';
  count?: number;
};

export function SkeletonGrid({ variant, count = 6 }: Props) {
  const items = Array.from({ length: count });

  if (variant === 'gal') {
    return (
      <div className="gal-grid" aria-hidden="true" data-testid="skeleton-grid">
        {items.map((_, i) => (
          <div key={i} className="skeleton skel-photo" />
        ))}
      </div>
    );
  }

  return (
    <div className="proj-grid" aria-hidden="true" data-testid="skeleton-grid">
      {items.map((_, i) => (
        <div key={i} className="proj-card">
          <div className="skeleton skel-photo" />
          <div className="proj-body">
            <div className="skeleton skel-line" style={{ width: '30%' }} />
            <div className="skeleton skel-line" style={{ width: '70%', height: 18, marginTop: 12 }} />
            <div className="skeleton skel-line" style={{ width: '50%', marginTop: 14 }} />
          </div>
        </div>
      ))}
    </div>
  );
}
