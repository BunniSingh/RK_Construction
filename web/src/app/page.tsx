import { Hero } from '@/components/Hero';
import { Overview } from '@/components/Overview';
import { MissionVision } from '@/components/MissionVision';
import { CoreValues } from '@/components/CoreValues';
import { Services } from '@/components/Services';
import { Projects } from '@/components/Projects';
import { Clients } from '@/components/Clients';
import { Gallery } from '@/components/Gallery';
import { Contact } from '@/components/Contact';
import { getProjects, getClients, getServices, getGalleryImages, getSiteSettings } from '@/lib/queries';

export const revalidate = 60;

export default async function Page() {
  const [projects, clients, services, gallery, settings] = await Promise.all([
    getProjects(),
    getClients(),
    getServices(),
    getGalleryImages(),
    getSiteSettings(),
  ]);

  return (
    <main>
      <Hero />
      <Overview settings={settings} />
      <MissionVision settings={settings} />
      <CoreValues />
      <Services services={services} />
      <Projects projects={projects} />
      <Clients clients={clients} />
      <Gallery images={gallery} />
      <Contact settings={settings} />
    </main>
  );
}
