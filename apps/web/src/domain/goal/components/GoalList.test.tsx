import { render, screen } from "@tests/test-utils";
import { vi, describe, it, expect } from "vitest";
import { GoalList } from "./GoalList";
import { useQuery } from "@tanstack/react-query";

vi.mock("@tanstack/react-query", async () => {
  const actual = await vi.importActual("@tanstack/react-query");
  return {
    ...actual,
    useQuery: vi.fn(),
  };
});

vi.mock("@/components/GoalCard", () => ({
  GoalCard: ({ goal }: { goal: { id: string; name: string } }) => (
    <div data-testid="goal-card">{goal.name}</div>
  ),
}));

const mockedUseQuery = vi.mocked(useQuery);

describe("GoalList", () => {
  const mockUseQueryImplementation = (
    options: Partial<ReturnType<typeof useQuery>>
  ) => {
    mockedUseQuery.mockReturnValue({
      isPending: false,
      isError: false,
      isSuccess: false,
      data: [],
      error: null,
      ...options,
    } as ReturnType<typeof useQuery>);
  };

  it("should render loading state", async () => {
    mockUseQueryImplementation({ isPending: true });
    await render({ component: GoalList });
    expect(screen.getByText("Loading goals...")).toBeInTheDocument();
  });

  it("should render error state", async () => {
    mockUseQueryImplementation({
      isError: true,
      error: new Error("Failed to fetch"),
    });
    await render({ component: GoalList });
    expect(
      screen.getByText("Error fetching goals: Failed to fetch")
    ).toBeInTheDocument();
  });

  it("should render success state with goals", async () => {
    const goals = [
      {
        id: "1",
        name: "Goal 1",
        targetAmount: 1000,
        currentAmount: 100,
        targetDate: new Date().toISOString(),
        userId: "1",
      },
      {
        id: "2",
        name: "Goal 2",
        targetAmount: 2000,
        currentAmount: 500,
        targetDate: new Date().toISOString(),
        userId: "1",
      },
    ];
    mockUseQueryImplementation({ isSuccess: true, data: goals });
    await render({ component: GoalList });
    const goalCards = screen.getAllByTestId("goal-card");
    expect(goalCards).toHaveLength(2);
    expect(goalCards[0]).toHaveTextContent("Goal 1");
    expect(goalCards[1]).toHaveTextContent("Goal 2");
  });

  it("should render empty state when there are no goals", async () => {
    mockUseQueryImplementation({ isSuccess: true, data: [] });
    await render({ component: GoalList });
    expect(screen.getByText("No Goals Yet")).toBeInTheDocument();
  });
});
