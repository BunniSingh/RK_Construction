import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

const { PROJECTS } = vi.hoisted(() => ({
  PROJECTS: Array.from({ length: 8 }, (_, i) => ({
    _id: String(i),
    title: `Project ${i}`,
    client: 'Client',
    location: 'Location',
    category: 'Category',
    order: i,
  })),
}));

vi.mock('@/lib/queries', () => ({
  getProjects: vi.fn().mockResolvedValue(PROJECTS),
}));

import ProjectsPage from '@/app/projects/page';

test('renders every project with no "view all" overflow link (this IS the full list)', async () => {
  const ui = await ProjectsPage();
  render(ui);
  expect(screen.getByText('Project 0')).toBeInTheDocument();
  expect(screen.getByText('Project 7')).toBeInTheDocument();
  expect(screen.queryByRole('link', { name: /view all projects/i })).toBeNull();
});

test('links back to the home page', async () => {
  const ui = await ProjectsPage();
  render(ui);
  expect(screen.getByRole('link', { name: /back/i })).toHaveAttribute('href', '/#projects');
});
