import { render, type RenderOptions, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n-test";
import {
  createRouter,
  createRootRoute,
  createMemoryHistory,
  RouterProvider,
} from "@tanstack/react-router";
import type React from "react";

interface CustomRenderOptions extends Omit<RenderOptions, "wrapper"> {
  initialEntries?: string[];
  component: React.ComponentType<unknown>;
}

const customRender = async (
  { component, initialEntries = ["/"] }: CustomRenderOptions,
  options?: Omit<RenderOptions, "wrapper">
) => {
  const rootRoute = createRootRoute({
    component: component,
  });
  const routeTree = rootRoute;

  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries }),
  });

  await router.load();

  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router}>
        <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
      </RouterProvider>
    </QueryClientProvider>
  );

  let returnVal: ReturnType<typeof render> | undefined;
  await act(async () => {
    returnVal = render(<div />, { wrapper: Wrapper, ...options });
  });
  if (!returnVal) {
    throw new Error("Render failed");
  }
  return returnVal;
};

export * from "@testing-library/react";
export { customRender as render };
