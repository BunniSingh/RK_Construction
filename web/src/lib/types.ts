export type Project = {
  _id: string;
  title: string;
  client: string;
  location: string;
  category: string;
  description?: string;
  photo?: import('sanity').Image;
  order: number;
};

export type Client = {
  _id: string;
  name: string;
  location?: string;
  logo?: import('sanity').Image;
};

export type Service = {
  _id: string;
  name: string;
  description?: string;
  order: number;
};

export type GalleryImage = {
  _id: string;
  image: import('sanity').Image;
  caption: string;
};

export type SiteSettings = {
  mission?: string;
  vision?: string;
  workforceCount?: string;
  engineeringStaffCount?: string;
  coreExpertise?: string;
  annualProjectValue?: string;
  address?: string;
  phone?: string;
  email?: string;
};
