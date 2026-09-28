import { render, screen } from '@testing-library/react';
import { Overview } from '@/components/Overview';

test('renders fallback fact values when siteSettings has not been created yet', () => {
  render(<Overview settings={null} />);
  expect(screen.getByText(/300\+/)).toBeInTheDocument();
  expect(screen.getByText(/Raigarh, CG/)).toBeInTheDocument();
});

test('renders values from siteSettings when provided', () => {
  render(
    <Overview
      settings={{
        workforceCount: '450+ (variable)',
        engineeringStaffCount: '20+ engineers',
        machineryList: '3 Ajax · 3 JCB · 2 Excavator',
        annualProjectValue: '₹15 Cr+',
      }}
    />
  );
  expect(screen.getByText('450+ (variable)')).toBeInTheDocument();
});
