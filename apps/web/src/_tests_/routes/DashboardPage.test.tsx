import { render, screen, fireEvent } from '@/test-utils';
import { vi, describe, it, expect, afterEach } from 'vitest';
import DashboardPage from '../../routes/DashboardPage';
import { createRootRoute, createRoute } from '@tanstack/react-router';
import { budgetRepository } from '@/infrastructure/ApiBudgetRepository';

vi.mock('@/infrastructure/ApiBudgetRepository');

vi.mock('@/components/AddBudgetDialog', () => ({
  AddBudgetDialog: () => <div />,
}));

vi.mock('@/components/Message', () => ({
  Message: ({ title, message }: { title: string; message: string }) => (
    <div>
      <h1>{title}</h1>
      <p>{message}</p>
    </div>
  ),
}));

vi.mock('@/components/PaginationControl', () => ({
  PaginationControl: ({ onPageChange }: { onPageChange: (page: number) => void }) => (
    <button onClick={() => onPageChange(2)}>Next</button>
  ),
}));

const rootRoute = createRootRoute();
const budgetRoute = createRoute({ getParentRoute: () => rootRoute, path: '/budgets/$budgetId' });

const mockedBudgetRepository = vi.mocked(budgetRepository);

describe('DashboardPage', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should display a loading message', async () => {
    mockedBudgetRepository.getAll.mockReturnValue(new Promise(() => {}));
    await render(<DashboardPage />);
    expect(screen.getByText('Loading budgets...')).toBeInTheDocument();
  });

  it('should display an error message', async () => {
    const error = new Error('Failed to fetch');
    mockedBudgetRepository.getAll.mockRejectedValue(error);
    await render(<DashboardPage />);

    expect(await screen.findByText('Error')).toBeInTheDocument();
    expect(
      await screen.findByText('Error fetching budgets: {{message}}')
    ).toBeInTheDocument();
  });

  it('should display a list of budgets', async () => {
    mockedBudgetRepository.getAll.mockResolvedValue({
      budgets: [
        { id: '1', name: 'Budget 1', balance: 1000 },
        { id: '2', name: 'Budget 2', balance: 2000 },
      ],
      totalBudgets: 2,
    });

    await render(<DashboardPage />, { routes: [budgetRoute] });

    expect(await screen.findByText('Budget 1')).toBeInTheDocument();
    expect(await screen.findByText('Budget 2')).toBeInTheDocument();
  });

  it('should display a message when there are no budgets', async () => {
    mockedBudgetRepository.getAll.mockResolvedValue({
      budgets: [],
      totalBudgets: 0,
    });

    await render(<DashboardPage />, { routes: [budgetRoute] });

    expect(await screen.findByText('No Budgets Yet')).toBeInTheDocument();
    expect(
      await screen.findByText(
        'Click the "Add New Budget" button to get started.'
      )
    ).toBeInTheDocument();
  });

  it('should handle pagination', async () => {
    mockedBudgetRepository.getAll.mockResolvedValue({
      budgets: [{ id: '1', name: 'Budget 1', balance: 1000 }],
      totalBudgets: 10,
    });

    await render(<DashboardPage />, { routes: [budgetRoute] });

    await screen.findByText('Budget 1');

    fireEvent.click(screen.getByText('Next'));

    expect(mockedBudgetRepository.getAll).toHaveBeenCalledWith({ page: 2, limit: 6 });
  });
});
