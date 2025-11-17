import { render, screen } from '../test-utils';
import { describe, it, expect, vi } from 'vitest';
import { GoalCard } from '../../components/GoalCard';
vi.mock('./EditGoalDialog', () => ({
  EditGoalDialog: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));
vi.mock('./AddTransactionToGoalDialog', () => ({
  AddTransactionToGoalDialog: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));
vi.mock('./DeleteGoalDialog', () => ({
  DeleteGoalDialog: () => <div />,
}));

const goal = {
  id: '1',
  name: 'Goal 1',
  targetAmount: 1000,
  currentAmount: 250,
  createdAt: new Date(),
  updatedAt: new Date(),
  userId: '1',
};

describe('GoalCard', () => {
  it('should render the goal name, formatted amounts, and progress', async () => {
    await render(<GoalCard goal={goal} />);
    expect(screen.getByText('Goal 1')).toBeInTheDocument();
    expect(screen.getByText('$250.00')).toBeInTheDocument();
    expect(screen.getByText('Target: $1,000.00')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute(
      'aria-valuenow',
      '25'
    );
  });

  it('should render the action buttons', async () => {
    await render(<GoalCard goal={goal} />);
    expect(
      screen.getByRole('button', { name: 'Add transaction' })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '' })).toBeInTheDocument(); // Edit button
  });
});
