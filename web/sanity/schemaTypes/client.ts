import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'client',
  title: 'Client',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'location', type: 'string' }),
    defineField({ name: 'logo', type: 'image' }),
  ],
});
