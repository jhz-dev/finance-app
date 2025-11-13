import { render, screen, fireEvent } from "@/test-utils";
import { ShareBudgetDialog } from "./ShareBudgetDialog";
import { describe, it, expect } from "vitest";
import type { BudgetMember } from "@/domain/budget/BudgetMember";

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
  it("renders the share button", async () => {
    await render(<ShareBudgetDialog budgetId="1" members={members} />);
    expect(screen.getByText("Share")).toBeInTheDocument();
  });

  it("opens the dialog when the share button is clicked", async () => {
    await render(<ShareBudgetDialog budgetId="1" members={members} />);
    fireEvent.click(screen.getAllByRole("button", { name: /share/i })[0]);
    expect(screen.getByText("Share budget")).toBeInTheDocument();
  });
});
