import { render, screen } from '@testing-library/react';
import { MissionVision } from '@/components/MissionVision';

test('renders a section heading and sub-heading paragraph above the mission/vision cards', () => {
  render(<MissionVision settings={null} />);
  expect(screen.getByRole('heading', { name: 'What drives every project.' })).toBeInTheDocument();
  expect(
    screen.getByText(/Two commitments that shape how we plan, build, and hand over every site/)
  ).toBeInTheDocument();
});
