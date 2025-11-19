import { render, screen } from '@tests/test-utils';
import { describe, it, expect } from 'vitest';
import { BudgetCard } from '../../components/BudgetCard';

const budget = {
  id: '1',
  name: 'Budget 1',
  balance: 1000,
  ownerId: '1',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('BudgetCard', () => {
  it('should render the budget name and formatted balance', async () => {
    await render({ component: () => <BudgetCard budget={budget} /> });
    expect(screen.getByText('Budget 1')).toBeInTheDocument();
    expect(screen.getByText('$1,000.00')).toBeInTheDocument();
  });

  it('should link to the budget details page', async () => {
    await render({ component: () => <BudgetCard budget={budget} /> });
    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      '/budgets/1'
    );
  });
});
