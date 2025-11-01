import { RouterProvider, createRouter } from "@tanstack/react-router";
import { I18nextProvider } from "react-i18next";
import i18n from "@/lib/i18n";
import { routeTree } from "@/routeTree.gen";

const router = createRouter({ routeTree });

export function TestWrapper({ children }) {
  return (
    <I18nextProvider i18n={i18n}>
      <RouterProvider router={router}>{children}</RouterProvider>
    </I18nextProvider>
  );
}
