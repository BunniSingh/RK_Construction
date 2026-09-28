'use client';

import { useState } from 'react';
import Image from 'next/image';

type Props = {
  src?: string | null;
  alt: string;
  /** Shown only on the placeholder plate (e.g. "Photo pending — P-05"). */
  caption: string;
  /** Shown as an overlay once a real photo is displayed. Omit to show no overlay on real photos. */
  photoCaption?: string;
};

function Placeholder({ alt, caption }: { alt: string; caption: string }) {
  return (
    <div className="plate" role="img" aria-label={alt}>
      <svg className="crosshair tl" viewBox="0 0 16 16"><path d="M8 0v16M0 8h16" stroke="var(--steel)" strokeWidth="1" /></svg>
      <svg className="crosshair br" viewBox="0 0 16 16"><path d="M8 0v16M0 8h16" stroke="var(--steel)" strokeWidth="1" /></svg>
      <div className="cap">{caption}</div>
    </div>
  );
}

export function ImagePlate({ src, alt, caption, photoCaption }: Props) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (!src || failed) {
    return <Placeholder alt={alt} caption={caption} />;
  }

  return (
    <div className={`plate plate--photo${loaded ? ' is-loaded' : ''}`}>
      <div className="plate-skeleton" aria-hidden="true" />
      <Image
        src={src}
        alt={alt}
        fill
        unoptimized
        sizes="(max-width: 700px) 100vw, 33vw"
        style={{ objectFit: 'cover' }}
        onError={() => setFailed(true)}
        onLoad={() => setLoaded(true)}
      />
      {photoCaption && <div className="cap">{photoCaption}</div>}
    </div>
  );
}
