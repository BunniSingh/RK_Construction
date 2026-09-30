import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProjectsGrid } from '@/components/ProjectsGrid';

function makeProjects(n: number) {
  return Array.from({ length: n }, (_, i) => ({
    _id: String(i),
    title: `Project ${i}`,
    client: 'Client',
    location: 'Location',
    category: 'Category',
    order: i,
  }));
}

test('renders every project when there is no limit', () => {
  render(<ProjectsGrid projects={makeProjects(3)} />);
  expect(screen.getByText('Project 0')).toBeInTheDocument();
  expect(screen.getByText('Project 1')).toBeInTheDocument();
  expect(screen.getByText('Project 2')).toBeInTheDocument();
  expect(screen.queryByRole('link', { name: /view all projects/i })).toBeNull();
});

test('renders only the first `limit` projects and a "view all" link when there are more', () => {
  render(<ProjectsGrid projects={makeProjects(8)} limit={6} moreHref="/projects" />);
  expect(screen.getByText('Project 0')).toBeInTheDocument();
  expect(screen.getByText('Project 5')).toBeInTheDocument();
  expect(screen.queryByText('Project 6')).toBeNull();
  const link = screen.getByRole('link', { name: /view all projects/i });
  expect(link).toHaveAttribute('href', '/projects');
});

test('does not show a "view all" link when the count is within the limit', () => {
  render(<ProjectsGrid projects={makeProjects(4)} limit={6} moreHref="/projects" />);
  expect(screen.queryByRole('link', { name: /view all projects/i })).toBeNull();
});

test('clicking a card opens the detail modal for that project', async () => {
  render(<ProjectsGrid projects={makeProjects(3)} />);
  await userEvent.click(screen.getByText('Project 1'));
  const dialog = screen.getByRole('dialog');
  expect(dialog).toHaveTextContent('Project 1');
});

test('closing the modal removes it from the document', async () => {
  render(<ProjectsGrid projects={makeProjects(3)} />);
  await userEvent.click(screen.getByText('Project 1'));
  expect(screen.getByRole('dialog')).toBeInTheDocument();
  await userEvent.click(screen.getByRole('button', { name: /close/i }));
  expect(screen.queryByRole('dialog')).toBeNull();
});
