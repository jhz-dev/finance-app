
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createMemoryHistory } from '@tanstack/react-router';
import { render, RenderOptions } from '@testing-library/react';
import React from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18n';
import { createAppRouter } from '@/router';
import { vi } from 'vitest';

export const renderWithProviders = (
  ui: React.ReactElement,
  {
    route = '/',
    authStoreState = { isAuthenticated: true },
    sidebarStoreState = { isOpen: true },
    languageStoreState = { language: 'en' },
    ...renderOptions
  }: { route?: string; authStoreState?: any; sidebarStoreState?: any; languageStoreState?: any } & Omit<
    RenderOptions,
    'wrapper'
  > = {},
) => {
  vi.doMock('@/domain/auth/auth.store', () => ({
    useAuthStore: Object.assign(vi.fn(() => authStoreState), {
      getState: () => authStoreState,
    }),
  }));

  vi.doMock('@/domain/sidebar/sidebar.store', () => ({
    useSidebarStore: Object.assign(vi.fn(() => sidebarStoreState), {
      getState: () => sidebarStoreState,
    }),
  }));

  vi.doMock('@/domain/language/language.store', () => ({
    useLanguageStore: Object.assign(vi.fn(() => languageStoreState), {
      getState: () => languageStoreState,
    }),
  }));

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const memoryHistory = createMemoryHistory({
    initialEntries: [route],
  });

  const router = createAppRouter();
  router.history = memoryHistory;

  function AllTheProviders({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18n}>
          <RouterProvider router={router}>{children}</RouterProvider>
        </I18nextProvider>
      </QueryClientProvider>
    );
  }

  return render(ui, { wrapper: AllTheProviders, ...renderOptions });
};
