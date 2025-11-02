import type { StateCreator } from 'zustand';

// This mock ensures that the 'persist' middleware doesn't actually persist anything
// and just passes the store creator through.
export const persist = <T>(
  config: StateCreator<T>,
) => config;

// If you are also using the 'devtools' middleware, you might want to mock it similarly
export const devtools = <T>(
  config: StateCreator<T>,
) => config;
