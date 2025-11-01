
import { screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { AddGoalDialog } from './AddGoalDialog';
import { renderWithProviders } from '@/lib/test-utils';
import userEvent from '@testing-library/user-event';

describe('AddGoalDialog', () => {
  test('renders and opens the dialog', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AddGoalDialog />);

    const button = await screen.findByRole('button', { name: /Add New Goal/i });
    await user.click(button);

    expect(await screen.findByText('Add Goal')).toBeInTheDocument();
  });
});
