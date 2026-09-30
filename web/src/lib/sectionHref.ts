export function sectionHref(pathname: string | null, id: string): string {
  return pathname === '/' ? `#${id}` : `/#${id}`;
}
