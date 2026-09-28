import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({ name: 'mission', type: 'text' }),
    defineField({ name: 'vision', type: 'text' }),
    defineField({ name: 'workforceCount', type: 'string' }),
    defineField({ name: 'engineeringStaffCount', type: 'string' }),
    defineField({ name: 'machineryList', type: 'string' }),
    defineField({ name: 'annualProjectValue', type: 'string' }),
    defineField({ name: 'address', type: 'string' }),
    defineField({ name: 'phone', type: 'string' }),
    defineField({ name: 'email', type: 'string' }),
  ],
});
