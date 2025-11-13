import { render, screen } from '@/test-utils';
import { describe, it, expect } from 'vitest';
import { BudgetCard } from './BudgetCard';
import { createRootRoute, createRoute } from '@tanstack/react-router';

const budget = {
  id: '1',
  name: 'Budget 1',
  balance: 1000,
  ownerId: '1',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const rootRoute = createRootRoute();
const budgetRoute = createRoute({ getParentRoute: () => rootRoute, path: '/budgets/$budgetId' });

describe('BudgetCard', () => {
  it('should render the budget name and formatted balance', async () => {
    await render(<BudgetCard budget={budget} />, { routes: [budgetRoute] });
    expect(screen.getByText('Budget 1')).toBeInTheDocument();
    expect(screen.getByText('$1,000.00')).toBeInTheDocument();
  });

  it('should link to the budget details page', async () => {
    await render(<BudgetCard budget={budget} />, { routes: [budgetRoute] });
    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      '/budgets/1'
    );
  });
});
