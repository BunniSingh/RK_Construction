import { render, screen } from '@testing-library/react';
import { Overview } from '@/components/Overview';

test('renders fallback fact values when siteSettings has not been created yet', () => {
  render(<Overview settings={null} />);
  expect(screen.getByText(/300\+/)).toBeInTheDocument();
  expect(screen.getByText(/Raigarh, CG/)).toBeInTheDocument();
});

test('does not show an equipment count, showing core expertise instead', () => {
  render(<Overview settings={null} />);
  expect(screen.queryByText(/Ajax/)).toBeNull();
  expect(screen.queryByText(/JCB/)).toBeNull();
  expect(screen.getByText('Core expertise')).toBeInTheDocument();
  expect(screen.getByText('Steel Plants, ETPs & RCC Works')).toBeInTheDocument();
});

test('renders values from siteSettings when provided', () => {
  render(
    <Overview
      settings={{
        workforceCount: '450+ (variable)',
        engineeringStaffCount: '20+ engineers',
        coreExpertise: 'Sinter Plants & Water Treatment',
        annualProjectValue: '₹15 Cr+',
      }}
    />
  );
  expect(screen.getByText('450+ (variable)')).toBeInTheDocument();
  expect(screen.getByText('Sinter Plants & Water Treatment')).toBeInTheDocument();
});
