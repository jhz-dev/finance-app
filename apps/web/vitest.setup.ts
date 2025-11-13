import { expect, vi, afterAll, afterEach, beforeAll } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';
import { server } from './src/mocks/server';

expect.extend(matchers);

vi.mock('react-resizable-panels', () => ({
  Panel: (props: any) => props.children,
  PanelGroup: (props: any) => props.children,
  PanelResizeHandle: () => null,
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (str: string) => str,
    i18n: {
      changeLanguage: () => new Promise(() => {}),
    },
  }),
  initReactI18next: vi.fn(),
}));

vi.mock('i18next', () => ({
  default: {
    use: vi.fn().mockReturnThis(),
    init: vi.fn(),
  },
}));

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
