import { sanityClient } from './sanity.client';
import type { Project, Client, Service, GalleryImage, SiteSettings } from './types';

export async function getProjects(): Promise<Project[]> {
  const result = await sanityClient.fetch<Project[]>(`*[_type == "project"] | order(order asc)`);
  return result ?? [];
}

export async function getClients(): Promise<Client[]> {
  const result = await sanityClient.fetch<Client[]>(`*[_type == "client"] | order(name asc)`);
  return result ?? [];
}

export async function getServices(): Promise<Service[]> {
  const result = await sanityClient.fetch<Service[]>(`*[_type == "service"] | order(order asc)`);
  return result ?? [];
}

export async function getGalleryImages(): Promise<GalleryImage[]> {
  const result = await sanityClient.fetch<GalleryImage[]>(`*[_type == "galleryImage"]`);
  return result ?? [];
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const result = await sanityClient.fetch<SiteSettings | null>(`*[_type == "siteSettings"][0]`);
  return result ?? null;
}
