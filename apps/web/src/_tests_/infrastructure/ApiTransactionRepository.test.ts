import { transactionRepository } from "@/infrastructure/ApiTransactionRepository";
import api from "@/lib/api";
import { vi } from "vitest";
import type {
  CreateTransaction,
  Transaction,
} from "@/domain/transaction/transaction";

vi.mock("@/lib/api");

describe("ApiTransactionRepository", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  const budgetId = "1";
  const transactions: Transaction[] = [
    {
      id: "1",
      budgetId: budgetId,
      amount: 100,
      type: "income",
      description: "Salary",
      date: new Date(),
    },
  ];

  it("should fetch all transactions for a budget", async () => {
    (api.get as vi.Mock).mockResolvedValue({ data: transactions });
    const result = await transactionRepository.getAll(budgetId);
    expect(api.get).toHaveBeenCalledWith(`/budgets/${budgetId}/transactions`);
    expect(result).toEqual(transactions);
  });

  it("should create a transaction", async () => {
    const newTransaction: CreateTransaction = {
      amount: 50,
      type: "expense",
      description: "Groceries",
      date: new Date(),
    };
    const createdTransaction: Transaction = {
      ...newTransaction,
      id: "2",
      budgetId: budgetId,
    };
    (api.post as vi.Mock).mockResolvedValue({ data: createdTransaction });
    const result = await transactionRepository.create(budgetId, newTransaction);
    expect(api.post).toHaveBeenCalledWith(
      `/budgets/${budgetId}/transactions`,
      newTransaction
    );
    expect(result).toEqual(createdTransaction);
  });

  it("should update a transaction", async () => {
    const transactionUpdate: Partial<Transaction> = {
      description: "Updated Description",
    };
    const updatedTransaction: Transaction = {
      ...transactions[0],
      ...transactionUpdate,
    };
    (api.put as vi.Mock).mockResolvedValue({ data: updatedTransaction });
    const result = await transactionRepository.update("1", transactionUpdate);
    expect(api.put).toHaveBeenCalledWith(
      "/transactions/1",
      transactionUpdate
    );
    expect(result).toEqual(updatedTransaction);
  });

  it("should delete a transaction", async () => {
    (api.delete as vi.Mock).mockResolvedValue({});
    await transactionRepository.delete("1");
    expect(api.delete).toHaveBeenCalledWith("/transactions/1");
  });
});
