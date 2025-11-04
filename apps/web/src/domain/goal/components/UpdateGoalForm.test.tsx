import { render, screen, fireEvent } from "@/test-utils";
import { UpdateGoalForm } from "./UpdateGoalForm";
import type { FinancialGoal } from "../goal";
import { goalRepository } from "@/infrastructure/ApiGoalRepository";
import { vi, describe, it, expect } from "vitest";

vi.mock("@/infrastructure/ApiGoalRepository");

const goal: FinancialGoal = {
  id: "1",
  name: "Goal 1",
  targetAmount: 1000,
  currentAmount: 500,
  userId: "1",
};

describe("UpdateGoalForm", () => {
  it("should call the update mutation on form submit", async () => {
    (goalRepository.update as vi.Mock).mockResolvedValue(undefined);
    const onDone = vi.fn();
    render(<UpdateGoalForm goal={goal} onDone={onDone} />);

    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Updated Goal" },
    });
    fireEvent.click(screen.getByText("Update Goal"));

    await screen.findByText("Update Goal");

    expect(goalRepository.update).toHaveBeenCalledWith("1", {
      id: "1",
      name: "Updated Goal",
      targetAmount: 1000,
      currentAmount: 500,
    });
  });
});
