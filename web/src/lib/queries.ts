import { sanityClient } from './sanity.client';
import type { Project, Client, Service, GalleryImage, SiteSettings } from './types';

async function safeFetch<T>(query: string, fallback: T): Promise<T> {
  try {
    const result = await sanityClient.fetch<T>(query);
    return (result ?? fallback) as T;
  } catch (err) {
    console.error(`Sanity fetch failed for query "${query}":`, err);
    return fallback;
  }
}

export async function getProjects(): Promise<Project[]> {
  return safeFetch<Project[]>(`*[_type == "project"] | order(order asc)`, []);
}

export async function getClients(): Promise<Client[]> {
  return safeFetch<Client[]>(`*[_type == "client"] | order(name asc)`, []);
}

export async function getServices(): Promise<Service[]> {
  return safeFetch<Service[]>(`*[_type == "service"] | order(order asc)`, []);
}

export async function getGalleryImages(): Promise<GalleryImage[]> {
  return safeFetch<GalleryImage[]>(`*[_type == "galleryImage"]`, []);
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  return safeFetch<SiteSettings | null>(`*[_type == "siteSettings"][0]`, null);
}
