import { render, screen } from '@/test-utils';
import { vi, describe, it, expect } from 'vitest';
import { GoalsPage } from './GoalsPage';

vi.mock('@/domain/goal/components/GoalList', () => ({
  GoalList: () => <div data-testid="goal-list" />,
}));

describe('GoalsPage', () => {
  it('should render the GoalList component', async () => {
    await render(<GoalsPage />);
    expect(screen.getByTestId('goal-list')).toBeInTheDocument();
  });
});
