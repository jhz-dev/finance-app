import { budgetRepository } from "../../infrastructure/ApiBudgetRepository";
import api from "../../lib/api";
import { vi, describe, it, expect } from "vitest";

vi.mock("../../lib/api");

describe("ApiBudgetRepository", () => {
  it("invites a member", async () => {
    await budgetRepository.inviteMember("1", "test@example.com", "VIEWER");
    expect(api.post).toHaveBeenCalledWith("/budgets/1/members", {
      email: "test@example.com",
      role: "VIEWER",
    });
  });

  it("updates a member's role", async () => {
    await budgetRepository.updateMemberRole("1", "1", "EDITOR");
    expect(api.patch).toHaveBeenCalledWith("/budgets/1/members/1", {
      role: "EDITOR",
    });
  });

  it("removes a member", async () => {
    await budgetRepository.removeMember("1", "1");
    expect(api.delete).toHaveBeenCalledWith("/budgets/1/members/1");
  });
});
