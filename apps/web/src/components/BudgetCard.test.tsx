import { screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { BudgetCard } from './BudgetCard';
import { renderWithProviders } from '@/lib/test-utils';
import type { Budget } from '@/domain/transaction/budget';

describe('BudgetCard', () => {
  test('renders budget name and formatted balance', () => {
    const budget: Budget = {
      id: '1',
      name: 'Test Budget',
      balance: 1234.56,
      transactions: []
    };

    renderWithProviders(<BudgetCard budget={budget} />, { authStoreState: { isAuthenticated: true } });

    expect(screen.getByText('Test Budget')).toBeInTheDocument();
    expect(screen.getByText('$1,234.56')).toBeInTheDocument();
  });
});
