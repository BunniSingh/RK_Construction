import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'galleryImage',
  title: 'Gallery Image',
  type: 'document',
  fields: [
    defineField({ name: 'image', type: 'image', validation: (r) => r.required() }),
    defineField({ name: 'caption', type: 'string', validation: (r) => r.required() }),
  ],
});
