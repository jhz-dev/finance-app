import { apiGoalRepository } from "@/infrastructure/ApiGoalRepository";
import api from "@/lib/api";
import { vi } from "vitest";
import type {
  CreateFinancialGoal,
  FinancialGoal,
  UpdateFinancialGoal,
} from "@/domain/goal/goal";

vi.mock("@/lib/api");

describe("ApiGoalRepository", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  const goals: FinancialGoal[] = [
    {
      id: "1",
      name: "New Car",
      targetAmount: 20000,
      currentAmount: 10000,
      userId: "1",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  it("should fetch all goals", async () => {
    (api.get as vi.Mock).mockResolvedValue({ data: goals });
    const result = await apiGoalRepository.getAll();
    expect(api.get).toHaveBeenCalledWith("/goals");
    expect(result).toEqual(goals);
  });

  it("should create a goal", async () => {
    const newGoal: CreateFinancialGoal = {
      name: "New Laptop",
      targetAmount: 2000,
      currentAmount: 0,
    };
    const createdGoal: FinancialGoal = {
      ...newGoal,
      id: "2",
      userId: "1",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    (api.post as vi.Mock).mockResolvedValue({ data: createdGoal });
    const result = await apiGoalRepository.create(newGoal);
    expect(api.post).toHaveBeenCalledWith("/goals", newGoal);
    expect(result).toEqual(createdGoal);
  });

  it("should update a goal", async () => {
    const goalUpdate: UpdateFinancialGoal = {
      name: "Updated Goal Name",
    };
    (api.put as vi.Mock).mockResolvedValue({});
    await apiGoalRepository.update("1", goalUpdate);
    expect(api.put).toHaveBeenCalledWith("/goals/1", goalUpdate);
  });

  it("should delete a goal", async () => {
    (api.delete as vi.Mock).mockResolvedValue({});
    await apiGoalRepository.delete("1");
    expect(api.delete).toHaveBeenCalledWith("/goals/1");
  });

  it("should add a transaction to a goal", async () => {
    (api.post as vi.Mock).mockResolvedValue({});
    await apiGoalRepository.addTransaction("1", 100);
    expect(api.post).toHaveBeenCalledWith("/goals/1/transactions", {
      amount: 100,
    });
  });
});
