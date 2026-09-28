import { createClient } from 'next-sanity';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

export const MEDIA_DIR = resolve(__dirname, '../../media');

export const ETP_FEATURED_PHOTO = 'WhatsApp Image 2026-09-28 at 11.56.37 AM.jpeg';
export const ETP_GALLERY_FILES = [
  { file: 'WhatsApp Image 2026-09-28 at 11.57.24 AM.jpeg', caption: 'Rebar & footing work — ETP site' },
  { file: 'WhatsApp Image 2026-09-28 at 11.56.44 AM.jpeg', caption: 'Tank & clarifier formwork — ETP site' },
  { file: 'WhatsApp Image 2026-09-28 at 11.57.01 AM.jpeg', caption: 'Site safety briefing — ETP crew' },
  { file: 'WhatsApp Image 2026-09-28 at 11.56.42 AM.jpeg', caption: 'Survey & layout marking — ETP site' },
  { file: 'WhatsApp Image 2026-09-28 at 11.56.51 AM.jpeg', caption: 'Site overview — ETP plant structure' },
  { file: 'WhatsApp Image 2026-09-28 at 11.57.00 AM.jpeg', caption: 'Night concrete pour — ETP site' },
];

async function uploadAsset(filename: string) {
  const buffer = readFileSync(resolve(MEDIA_DIR, filename));
  return client.assets.upload('image', buffer, { filename });
}

export const PROJECTS = [
  { title: 'Water Treatment Plant', client: 'Jindal Steel & Power', location: 'Raigarh, CG', category: 'Water Treatment', order: 0 },
  { title: 'Rolling Mill', client: 'Jindal Steel & Power', location: 'Patratu, JH', category: 'Industrial Construction', order: 1 },
  { title: 'PCI Unit', client: 'JSW Steel', location: 'Raigarh, CG', category: 'PCI / Coal Injection', order: 2 },
  { title: 'RCC Road & Drains', client: 'JSW Steel', location: 'Raigarh, CG', category: 'Infrastructure Dev.', order: 3 },
  { title: 'RMHS Feeding Circuit', client: 'Sinter & Pellet Plant', location: 'Raigarh, CG', category: 'Material Handling', order: 4 },
  { title: 'Infrastructure Development', client: 'NTPC', location: 'Lara, Raigarh', category: 'Infrastructure Dev.', order: 5 },
];

export const CLIENTS = [
  { name: 'Jindal Steel & Power Ltd.', location: 'Raigarh, CG' },
  { name: 'JSW Steel', location: 'Raigarh, CG' },
  { name: 'Jindal Steel & Power Ltd.', location: 'Patratu, JH' },
  { name: 'NTPC', location: 'Lara, Raigarh' },
  { name: 'HARSCO India Pvt. Ltd.', location: 'Slag processing · Raigarh' },
];

export const SERVICES = [
  { name: 'Infrastructure Development', description: 'RCC roads, drains, boundary walls' },
  { name: 'Sinter Plant Construction' },
  { name: 'Blast Furnace Construction' },
  { name: 'PCI Units', description: 'Pulverized coal injection' },
  { name: 'Power Plant Construction' },
  { name: 'Pellet Plant & DRI' },
  { name: 'Water Treatment Plants' },
  { name: 'Effluent Treatment (ETP)', description: 'Incl. Lamella clarifier tanks' },
  { name: 'SAF Area & Bag House', description: 'Road work & store construction' },
  { name: 'Oxygen Plant Flooring', description: 'Cooling tower flooring' },
  { name: 'Rail Forging Road Work' },
  { name: 'RMHS & Material Handling', description: 'Sinter & pellet plant circuits' },
];

async function seed() {
  console.log('Uploading ETP featured photo...');
  const featuredAsset = await uploadAsset(ETP_FEATURED_PHOTO);

  console.log('Creating projects...');
  for (const p of PROJECTS) {
    await client.create({ _type: 'project', ...p });
  }
  await client.create({
    _type: 'project',
    title: 'Effluent Treatment Plant (ETP)',
    client: 'Confidential — industrial client',
    location: 'Raigarh, CG',
    category: 'Effluent Treatment',
    order: 6,
    photo: { _type: 'image', asset: { _type: 'reference', _ref: featuredAsset._id } },
  });

  console.log('Creating clients...');
  for (const c of CLIENTS) {
    await client.create({ _type: 'client', ...c });
  }

  console.log('Creating services...');
  for (const [i, s] of SERVICES.entries()) {
    await client.create({ _type: 'service', ...s, order: i });
  }

  console.log('Uploading gallery photos...');
  for (const { file, caption } of ETP_GALLERY_FILES) {
    const asset = await uploadAsset(file);
    await client.create({
      _type: 'galleryImage',
      caption,
      image: { _type: 'image', asset: { _type: 'reference', _ref: asset._id } },
    });
  }

  console.log('Creating site settings...');
  await client.createIfNotExists({
    _id: 'siteSettings',
    _type: 'siteSettings',
    workforceCount: '300+ (variable)',
    engineeringStaffCount: '15+ engineers',
    machineryList: '2 Ajax · 2 JCB · 1 Excavator',
    annualProjectValue: '₹10 Cr+',
    address: 'House No. 24, Bhagwanpur Uper Basti, Jindal Road, Raigarh, CG',
    phone: '+91 97524 50852',
    email: 'raju2021rgh@gmail.com',
  });

  console.log('Seed complete.');
}

const isMainModule = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMainModule) {
  seed().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
