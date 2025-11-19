import { render, screen, fireEvent } from "@tests/test-utils";
import { vi, describe, it, expect } from "vitest";
import { AddBudgetDialog } from "../../components/AddBudgetDialog";
import { useCreateBudget } from "../../hooks/useCreateBudget";

vi.mock("@/hooks/useCreateBudget");

const mockedUseCreateBudget = vi.mocked(useCreateBudget);

describe("AddBudgetDialog", () => {
  it("should call the create budget mutation with the correct data and close the dialog on success", async () => {
    const mutate = vi.fn((_variables, options) => {
      options.onSuccess();
    });
    mockedUseCreateBudget.mockReturnValue({
      mutate,
      isPending: false,
    } as ReturnType<typeof useCreateBudget>);

    await render({ component: AddBudgetDialog });

    fireEvent.click(await screen.findByText("Add New Budget"));
    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "New Budget" },
    });
    fireEvent.click(await screen.findByText("Save budget"));

    expect(mutate).toHaveBeenCalledWith(
      {
        name: "New Budget",
      },
      {
        onSuccess: expect.any(Function),
      }
    );

    expect(screen.queryByText("Create New Budget")).toBeNull();
  });
});
