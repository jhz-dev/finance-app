import { render, screen } from '@tests/test-utils';
import { describe, it, expect, vi } from 'vitest';
import { GoalsPage } from '../../routes/GoalsPage';

vi.mock('@/domain/goal/components/GoalList', () => ({
  GoalList: () => <div data-testid="goal-list" />,
}));

// Mock the data-fetching hook to prevent a real network request
vi.mock('@/domain/goal/hooks/useGoals', () => ({
  useGoals: () => ({
    data: [], // Provide mock data
    isLoading: false,
  }),
}));

describe('GoalsPage', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render the page title', async () => {
    await render({ component: GoalsPage });
    expect(screen.getByRole('heading', { name: /goals.title/i })).toBeInTheDocument();
  });

  it('should render the goal list', async () => {
    await render({ component: GoalsPage });
    expect(await screen.findByTestId("goal-list")).toBeInTheDocument();
  });
});
