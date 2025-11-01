# Unit Test Debugging Summary

This document summarizes the efforts to fix the unit tests in the `apps/web` project.

## Webpages Consulted

- [Zustand Testing Guide](https://zustand.docs.pmnd.rs/guides/testing)
- [Vitest Guide](https://vitest.dev/guide/)
- [Vitest Configuration](https://vitest.dev/config/#environment)
- [Testing Library Setup](https://testing-library.com/docs/dom-testing-library/setup/)

## Mocking Strategies Attempted

1.  **Manual Mocking in `vitest.setup.ts`**:
    - Mocked `useAuthStore`, `useSidebarStore`, and `useLanguageStore` directly in the setup file.
    - This approach led to `TypeError: useAuthStore.setState is not a function` and `(0 , __vite_ssr_import_5__.useSidebarStore) is not a function` errors.

2.  **Official Zustand Automocking**:
    - Implemented the recommended `__mocks__/zustand.ts` file to handle automocking and state resets.
    - This approach led to `TypeError: (0 , __vite_ssr_import_0__.create)(...) is not a function` errors, likely due to a conflict with the `persist` middleware.

3.  **Manual Mocking in Test Files**:
    - Removed all mocks from `vitest.setup.ts` and mocked the stores directly in each test file.
    - This approach led to `TypeError: vi.mocked(...).mockReturnValue is not a function` errors.

## Summary of Errors

- `TypeError: vi.mocked(...).mockReturnValue is not a function`
- `(0 , __vite_ssr_import_5__.useSidebarStore) is not a function`
- `TypeError: (0 , __vite_ssr_import_0__.create)(...) is not a function`
- `ReferenceError: expect is not defined`
- `Failed to resolve import "./mocks/server" from "vitest.setup.ts"`
- `No "I18nextProvider" export is defined on the "react-i18next" mock`

## Failing Test Files and Tests

- **`src/components/AddGoalDialog.test.tsx`**
  - `renders and opens the dialog`
- **`src/domain/goal/components/GoalList.test.tsx`**
  - `should render loading state`
  - `should render error state`
  - `should render a list of goals`
- **`src/routes/DashboardPage.test.tsx`**
  - `shows a loading message while fetching budgets`
  - `shows an error message if fetching budgets fails`
  - `displays budgets and pagination when fetch is successful`
  - `displays a message when there are no budgets`
  - `pagination buttons work correctly`
- **`src/components/Sidebar.test.tsx`**
  - `renders all navigation links and the logout button`
