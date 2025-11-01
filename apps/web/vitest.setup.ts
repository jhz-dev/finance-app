
import { expect, afterEach, vi, beforeAll, afterAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import { server } from '@/mocks/server';

expect.extend(matchers);

vi.mock('zustand');

vi.mock('react-i18next', async (importOriginal) => {
  const mod = await importOriginal();
  return {
    ...mod,
    useTranslation: () => ({
      t: (str) => str,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    }),
  };
});

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

afterEach(() => {
  server.resetHandlers();
  cleanup();
});

afterAll(() => server.close());
