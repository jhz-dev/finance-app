export type Budget = {
  id: string;
  name: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
};

export type BudgetRole = "VIEWER" | "EDITOR" | "ADMIN";
