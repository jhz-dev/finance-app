
import { screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { Sidebar } from './Sidebar';
import { renderWithProviders } from '@/lib/test-utils';

describe('Sidebar', () => {
  test('renders all navigation links and the logout button', async () => {
    renderWithProviders(<Sidebar />);

    expect(await screen.findByText('Dashboard')).toBeInTheDocument();
    expect(await screen.findByText('Goals')).toBeInTheDocument();
    expect(await screen.findByText('Profile')).toBeInTheDocument();
    expect(await screen.findByText('Logout')).toBeInTheDocument();
  });
});
