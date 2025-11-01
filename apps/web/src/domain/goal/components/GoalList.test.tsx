
import { screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { describe, expect, test } from 'vitest';

import { server } from '@/mocks/server';
import { GoalList } from './GoalList';
import { renderWithProviders } from '@/lib/test-utils';

describe('GoalList', () => {
  test('should render loading state', () => {
    renderWithProviders(<GoalList />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('should render error state', async () => {
    server.use(
      http.get('/api/goals', () => {
        return new HttpResponse(null, { status: 500 });
      }),
    );
    renderWithProviders(<GoalList />);
    await waitFor(() => {
      expect(screen.getByText('Error loading goals')).toBeInTheDocument();
    });
  });

  test('should render a list of goals', async () => {
    renderWithProviders(<GoalList />);
    await waitFor(() => {
      expect(screen.getByText('Goal 1')).toBeInTheDocument();
    });
  });
});
