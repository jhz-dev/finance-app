import { render, screen, fireEvent, waitFor } from '@tests/test-utils';
import { vi, describe, it, expect } from 'vitest';
import { AddGoalDialog } from '../../components/AddGoalDialog';
import { useCreateGoal } from '../../hooks/useCreateGoal';
import { Button } from '../../components/ui/button';

vi.mock('@/hooks/useCreateGoal');

const mockedUseCreateGoal = vi.mocked(useCreateGoal);

describe('AddGoalDialog', () => {
  it('should call the create goal mutation with the correct data and close the dialog on success', async () => {
    const mutate = vi.fn((_variables, options) => {
      options.onSuccess();
    });
    mockedUseCreateGoal.mockReturnValue({
      mutate,
      isPending: false,
    } as ReturnType<typeof useCreateGoal>);

    await render({ component: () => (
      <AddGoalDialog>
        <Button>Add New Goal</Button>
      </AddGoalDialog>
    )});

    fireEvent.click(screen.getByText('Add New Goal'));

    await waitFor(() => {
        expect(screen.getByText('Add Goal')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: 'New Goal' },
    });
    fireEvent.change(screen.getByLabelText('Target Amount'), {
      target: { value: '1000' },
    });
    fireEvent.click(screen.getByText('Add Goal'));

    await waitFor(() => {
        expect(mutate).toHaveBeenCalledWith(
            {
                name: 'New Goal',
                targetAmount: 1000,
            },
            {
                onSuccess: expect.any(Function),
            }
        );
    });

    await waitFor(() => {
        expect(screen.queryByRole('heading', { name: 'Add New Goal' })).not.toBeInTheDocument();
    });
  });
});
