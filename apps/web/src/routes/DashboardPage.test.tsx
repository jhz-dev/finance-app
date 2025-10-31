import { render, screen, cleanup } from '@testing-library/react';
import { describe, expect, test, vi, beforeEach, afterEach } from 'vitest';
import DashboardPage from './DashboardPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { I18nextProvider } from 'react-i18next';
import i18n from '../lib/i18n';
import { budgetRepository } from '@/infrastructure/ApiBudgetRepository';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory, createRootRoute, createRouter, RouterProvider, createRoute } from '@tanstack/react-router';

const rootRoute = createRootRoute();
const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: '/' });
const routeTree = rootRoute.addChildren([indexRoute]);

const router = createRouter({
  routeTree,
  history: createMemoryHistory(),
});

vi.mock('@/infrastructure/ApiBudgetRepository');
vi.mock('@/components/BudgetCard', () => ({
  BudgetCard: ({ budget }) => <div data-testid="budget-card">{budget.name}</div>,
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const renderComponent = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        <RouterProvider router={router}>
          <DashboardPage />
        </RouterProvider>
      </I18nextProvider>
    </QueryClientProvider>,
  );
};

describe('DashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  afterEach(() => {
    cleanup();
  });

  test.todo('shows a loading message while fetching budgets', () => {
    vi.mocked(budgetRepository.getAll).mockReturnValue(new Promise(() => {})); // Never resolves
    renderComponent();
    expect(screen.getByText('Loading budgets...')).toBeDefined();
  });

  test.todo('shows an error message if fetching budgets fails', async () => {
    vi.mocked(budgetRepository.getAll).mockRejectedValue(new Error('Failed to fetch'));
    renderComponent();
    expect(await screen.findByText('Error fetching budgets: Failed to fetch')).toBeDefined();
  });

  test.todo('displays budgets and pagination when fetch is successful', async () => {
    const mockData = {
      budgets: [{ id: '1', name: 'Vacation Fund', balance: 500, ownerId: 'user1' }],
      totalBudgets: 1,
    };
    vi.mocked(budgetRepository.getAll).mockResolvedValue(mockData);
    renderComponent();

    expect(await screen.findByText('Vacation Fund')).toBeDefined();
    expect(screen.getByText('Page 1')).toBeDefined();
  });

  test.todo('displays a message when there are no budgets', async () => {
    const mockData = {
      budgets: [],
      totalBudgets: 0,
    };
    vi.mocked(budgetRepository.getAll).mockResolvedValue(mockData);
    renderComponent();
    expect(await screen.findByText('No Budgets Yet')).toBeDefined();
  });

  test.todo('pagination buttons work correctly', async () => {
    const user = userEvent.setup();
    const mockDataPage1 = {
      budgets: [{ id: '1', name: 'Budget 1', balance: 100, ownerId: 'user1' }],
      totalBudgets: 10, // More than one page
    };
    const mockDataPage2 = {
      budgets: [{ id: '2', name: 'Budget 2', balance: 200, ownerId: 'user1' }],
      totalBudgets: 10,
    };

    vi.mocked(budgetRepository.getAll).mockResolvedValue(mockDataPage1);
    renderComponent();

    expect(await screen.findByText('Budget 1')).toBeDefined();

    // Go to next page
    vi.mocked(budgetRepository.getAll).mockResolvedValue(mockDataPage2);
    await user.click(screen.getByRole('button', { name: 'Next' }));

    expect(await screen.findByText('Budget 2')).toBeDefined();
    expect(screen.getByText('Page 2')).toBeDefined();
  });
});
