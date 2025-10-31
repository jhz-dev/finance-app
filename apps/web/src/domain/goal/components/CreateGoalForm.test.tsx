import { render, screen, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CreateGoalForm } from "./CreateGoalForm";
import { goalRepository } from "@/infrastructure/ApiGoalRepository";
import { vi, describe, it, expect } from "vitest";

vi.mock("@/infrastructure/ApiGoalRepository");

const queryClient = new QueryClient();

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe("CreateGoalForm", () => {
  it("should call the create mutation on form submit", async () => {
    (goalRepository.create as any).mockResolvedValue({
      id: "1",
      name: "New Goal",
      targetAmount: 1000,
      currentAmount: 0,
      userId: "1",
    });
    render(<CreateGoalForm />, { wrapper });

    fireEvent.change(screen.getByRole("textbox", { name: /name/i }), { target: { value: "New Goal" } });
    fireEvent.change(screen.getByRole("spinbutton", { name: /target amount/i }), { target: { value: 1000 } });
    fireEvent.click(screen.getByText("Create Goal"));

    await screen.findByText("Create Goal");

    expect(goalRepository.create).toHaveBeenCalledWith({
      name: "New Goal",
      targetAmount: 1000,
    });
  });
});
