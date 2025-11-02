import { vi } from 'vitest';

const authStoreState = {
  isAuthenticated: true,
  user: { id: '1', name: 'Test User', email: 'test@example.com' },
  login: vi.fn(),
  logout: vi.fn(),
  init: vi.fn(),
};

export const mockAuthStore = {
  useAuthStore: Object.assign(vi.fn(() => authStoreState), {
    getState: () => authStoreState,
  }),
};

const sidebarStoreState = {
  isOpen: true,
  toggle: vi.fn(),
};

export const mockSidebarStore = {
  useSidebarStore: Object.assign(vi.fn(() => sidebarStoreState), {
    getState: () => sidebarStoreState,
  }),
};

const languageStoreState = {
  language: 'en',
  setLanguage: vi.fn(),
};

export const mockLanguageStore = {
  useLanguageStore: Object.assign(vi.fn(() => languageStoreState), {
    getState: () => languageStoreState,
  }),
};
