import { render, screen } from '@testing-library/react';
import { ProjectCard } from '@/components/ProjectCard';

const LONG_TITLE = 'Infrastructure Development And Full RCC Road, Drain, And Boundary Wall Construction Package';

test('renders project details and does not clip a very long title', () => {
  render(
    <ProjectCard
      code="P-07"
      project={{
        _id: '1',
        title: LONG_TITLE,
        client: 'NTPC',
        location: 'Lara, Raigarh',
        category: 'Infrastructure Dev.',
        order: 0,
      }}
    />
  );
  const title = screen.getByText(LONG_TITLE);
  expect(title).toBeInTheDocument();
  expect(title).toHaveClass('proj-title');
});

test('falls back to the placeholder plate when the project has no photo', () => {
  const { container } = render(
    <ProjectCard
      code="P-01"
      project={{ _id: '1', title: 'Water Treatment Plant', client: 'Jindal Steel & Power', location: 'Raigarh, CG', category: 'Water Treatment', order: 0 }}
    />
  );
  expect(container.querySelector('img')).toBeNull();
  expect(screen.getByText(/Photo pending/)).toBeInTheDocument();
});
