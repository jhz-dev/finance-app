import '@testing-library/jest-dom';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// You can add other global setup here, such as:
// - Mocking global objects (e.g., `window.matchMedia`)

// Ensures that mocks are cleared and the DOM is cleaned up after each test.
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});