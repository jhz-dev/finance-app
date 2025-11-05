import { render, screen, fireEvent } from "@testing-library/react";
import { ShareBudgetDialog } from "./ShareBudgetDialog";
import { vi, describe, it, expect } from "vitest";
import type { BudgetMember } from "@/domain/budget/BudgetMember";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

const members: BudgetMember[] = [
  {
    id: "1",
    budgetId: "1",
    userId: "1",
    role: "ADMIN",
    createdAt: "",
    updatedAt: "",
  },
];

describe("ShareBudgetDialog", () => {
  const queryClient = new QueryClient();
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it("renders the share button", () => {
    render(<ShareBudgetDialog budgetId="1" members={members} />, { wrapper });
    expect(screen.getByText("Share")).toBeInTheDocument();
  });

  it("opens the dialog when the share button is clicked", () => {
    render(<ShareBudgetDialog budgetId="1" members={members} />, { wrapper });
    fireEvent.click(screen.getAllByRole("button", { name: /share/i })[0]);
    expect(screen.getByText("Manage Collaborators")).toBeInTheDocument();
  });
});
