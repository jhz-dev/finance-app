
import { screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { describe, expect, test } from 'vitest';

import DashboardPage from '@/routes/DashboardPage';
import { renderWithProviders } from '@/lib/test-utils';
import { server } from '@/mocks/server';
import userEvent from '@testing-library/user-event';

describe('DashboardPage', () => {
  test('shows a loading message while fetching budgets', async () => {
    renderWithProviders(<DashboardPage />, { authStoreState: { isAuthenticated: true } });

    expect(screen.getByText('Loading budgets...')).toBeInTheDocument();
  });

  test('shows an error message if fetching budgets fails', async () => {
    server.use(
      http.get('/api/budgets', () => {
        return new HttpResponse(null, { status: 500 });
      }),
    );
    renderWithProviders(<DashboardPage />);
    expect(
      await screen.findByText('Error fetching budgets:'),
    ).toBeInTheDocument();
  });

  test('displays budgets and pagination when fetch is successful', async () => {
    renderWithProviders(<DashboardPage />);
    await waitFor(() => {
      expect(screen.getByText('Vacation Fund')).toBeInTheDocument();
      expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();
    });
  });

  test('displays a message when there are no budgets', async () => {
    server.use(
      http.get('/api/budgets', () => {
        return HttpResponse.json({ budgets: [], totalBudgets: 0 });
      }),
    );
    renderWithProviders(<DashboardPage />);
    expect(await screen.findByText('No Budgets Yet')).toBeInTheDocument();
  });

  test('pagination buttons work correctly', async () => {
    const user = userEvent.setup();
    renderWithProviders(<DashboardPage />);

    await waitFor(async () => {
      expect(await screen.findByText('Vacation Fund')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'Next' }));

    await waitFor(async () => {
      expect(await screen.findByText('Emergency Fund')).toBeInTheDocument();
      expect(screen.getByText('Page 2 of 2')).toBeInTheDocument();
    });
  });
});
