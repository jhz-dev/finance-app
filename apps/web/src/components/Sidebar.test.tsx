import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { Sidebar } from './Sidebar';
import { I18nextProvider } from 'react-i18next';
import i18n from '../lib/i18n';
import { createMemoryHistory, createRootRoute, createRoute, createRouter, RouterProvider } from '@tanstack/react-router';

const rootRoute = createRootRoute();
const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: '/' });
const goalsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/goals' });
const profileRoute = createRoute({ getParentRoute: () => rootRoute, path: '/profile' });

const router = createRouter({
  routeTree: rootRoute.addChildren([indexRoute, goalsRoute, profileRoute]),
  history: createMemoryHistory(),
});

vi.mock('@/domain/auth/auth.store', () => ({
  useAuthStore: () => ({
    logout: vi.fn(),
  }),
}));

describe('Sidebar', () => {
  test.todo('renders all navigation links and the logout button', async () => {
    render(
      <I18nextProvider i18n={i18n}>
        <RouterProvider router={router}>
          <Sidebar />
        </RouterProvider>
      </I18nextProvider>,
    );

    expect(await screen.findByText('Dashboard')).toBeDefined();
    expect(await screen.findByText('Goals')).toBeDefined();
    expect(await screen.findByText('Profile')).toBeDefined();
    expect(await screen.findByText('Logout')).toBeDefined();
  });
});
