import { render, screen, cleanup } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GoalList } from "../components/GoalList";
import { goalRepository } from "@/infrastructure/ApiGoalRepository";
import { vi, describe, it, expect, afterEach, beforeEach } from "vitest";

vi.mock("@/infrastructure/ApiGoalRepository");

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe("GoalList", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    vi.resetAllMocks();
    vi.useRealTimers();
  });

  it("should render loading state", () => {
    (goalRepository.getAll as any).mockReturnValue(new Promise(() => {}));
    render(<GoalList />, { wrapper });
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it.skip("should render error state", async () => {
    (goalRepository.getAll as any).mockRejectedValue(new Error("Error"));
    render(<GoalList />, { wrapper });
    expect(await screen.findByText("Error loading goals")).toBeInTheDocument();
  });

  it.skip("should render a list of goals", async () => {
    const goals = [
      { id: "1", name: "Goal 1", targetAmount: 1000, currentAmount: 500, userId: "1" },
    ];
    (goalRepository.getAll as any).mockResolvedValue(goals);
    render(<GoalList />, { wrapper });
    expect(await screen.findByText("Goal 1")).toBeInTheDocument();
  });
});
