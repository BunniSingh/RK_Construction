import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'client', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'location', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'category', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'description', type: 'text' }),
    defineField({ name: 'photo', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'order', type: 'number', initialValue: 0 }),
  ],
});
