import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'description', type: 'string' }),
    defineField({ name: 'order', type: 'number', initialValue: 0 }),
  ],
});
