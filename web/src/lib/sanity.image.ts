import imageUrlBuilder from '@sanity/image-url';
import type { Image } from 'sanity';
import { sanityClient } from './sanity.client';

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source?: Image | null): string | null {
  if (!source) return null;
  return builder.image(source).auto('format').url();
}
