import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { AddGoalDialog } from './AddGoalDialog';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { I18nextProvider } from 'react-i18next';
import i18n from '../lib/i18n';
import userEvent from '@testing-library/user-event';
import { goalRepository } from '@/infrastructure/ApiGoalRepository';

vi.mock('@/infrastructure/ApiGoalRepository', () => ({
  goalRepository: {
    create: () => Promise.resolve(),
  },
}));

describe('AddGoalDialog', () => {
  test.todo('renders and opens the dialog', async () => {
    const user = userEvent.setup();
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18n}>
          <AddGoalDialog />
        </I18nextProvider>
      </QueryClientProvider>,
    );

    const button = await screen.findByRole('button', { name: /Add New Goal/i });
    await user.click(button);

    expect(await screen.findByText('Add Goal')).toBeDefined();
  });
});
