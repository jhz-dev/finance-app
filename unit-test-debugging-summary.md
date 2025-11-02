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

# Gemini's Debugging Summary

This section summarizes the additional efforts made by Gemini to fix the unit tests.

## Research

- Conducted research on mocking Zustand (especially with the `persist` middleware) and `react-i18next` in a Vitest environment.
- Found that the `persist` middleware was a likely source of errors and that `react-i18next` required a more complete mock.

## Mocking Strategies Attempted by Gemini

1.  **Improved Global Mocks:**
    - Created a mock for `zustand/middleware` to bypass the `persist` middleware during tests.
    - Improved the `react-i18next` mock in `vitest.setup.ts` to include `initReactI18next` and use `importOriginal` to provide the real `I18nextProvider`.
    - **Result:** This led to a new error: `TypeError: __vite_ssr_import_5__.useAuthStore.getState is not a function`.

2.  **More Realistic Store Mocks:**
    - Updated the Zustand store mocks in `test-mocks.ts` to include a `getState` function, making them behave more like real Zustand stores.
    - **Result:** The same `getState is not a function` error persisted, indicating a deeper issue with how the mocks were being applied.

3.  **Router Refactoring:**
    - Identified that the root cause of the problem was that the router was being created only once with the original, un-mocked `useAuthStore`.
    - Refactored the application to create a `createAppRouter` function, allowing a new, correctly mocked router to be created for each test.
    - **Result:** This was a critical step, but it still didn't solve the problem on its own.

4.  **The `vi.doMock` Strategy:**
    - Realized that the mocks needed to be applied *before* the router was created for each test.
    - Updated the `renderWithProviders` function in `test-utils.tsx` to use `vi.doMock` to mock the stores *inside* the function, just before the router is created.
    - This ensures that the mocks are applied at the correct time.

## Current Status

The tests are still failing with the same error: `Unable to find role="button" and name /Add New Budget/i`. This means the application is still redirecting to the login page.

This is happening because the `beforeLoad` function in the router is still not getting the mocked authentication state, even after all the refactoring and changes to the mocking strategy.

## Next Steps for Jules

I have exhausted my current knowledge and abilities to solve this problem. It seems to be a very tricky issue related to the interaction between TanStack Router, Vitest, and Zustand.

Here are my final recommendations for you:

1.  **Focus on `test-utils.tsx`:** The key to solving this lies in the `renderWithProviders` function. The mocks need to be applied in a way that the `createAppRouter` function uses the mocked stores, not the real ones.

2.  **Try a different mocking approach:** The `vi.doMock` approach should have worked. There might be a subtle detail that I'm missing. You could try to use `vi.mock` with `vi.hoisted` again, but be very careful about the order of imports.

3.  **Simplify the problem:** Try to create a minimal reproduction of the issue in a separate file. Create a simple component that uses `useAuthStore` and a simple route with a `beforeLoad` function. This might help to isolate the problem.

4.  **Consult the experts:** If all else fails, I recommend reaching out to the communities for TanStack Router and Vitest. They might have encountered this issue before and can provide guidance.

I am sorry that I was not able to solve this for you. I have learned a lot from this experience, and I hope that the summary I have provided will be helpful to you.