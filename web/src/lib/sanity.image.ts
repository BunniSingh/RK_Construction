import imageUrlBuilder from '@sanity/image-url';
import type { Image } from 'sanity';
import { sanityClient } from './sanity.client';

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source?: Image | null): string | null {
  if (!source) return null;
  try {
    return builder.image(source).auto('format').url();
  } catch {
    // Malformed or incomplete image reference (e.g. an asset that was
    // removed in Sanity) — fall back to the placeholder like a missing image.
    return null;
  }
}
