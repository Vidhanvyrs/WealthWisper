import { create } from "zustand";
import { Category } from "@/types/transaction";

export interface CategoryBudget {
  category: Category;
  amount: number;
  month: string; // "YYYY-MM"
}

interface BudgetState {
  budgets: CategoryBudget[];
  setBudget: (budget: CategoryBudget) => void;
  getBudgetForCategory: (category: Category, month: string) => number;
}

export const useBudgetStore = create<BudgetState>((set, get) => ({
  budgets: [
    { category: "Food & Dining", amount: 500, month: "2025-04" },
    { category: "Bills & Utilities", amount: 1000, month: "2025-04" },
    { category: "Transportation", amount: 200, month: "2025-04" },
    { category: "Shopping", amount: 300, month: "2025-04" },
    { category: "Entertainment", amount: 200, month: "2025-04" },
    { category: "Healthcare", amount: 400, month: "2025-04" },
  ],
  setBudget: (newBudget) =>
    set((state) => ({
      budgets: [
        ...state.budgets.filter(
          (b) =>
            !(b.category === newBudget.category && b.month === newBudget.month)
        ),
        newBudget,
      ],
    })),
  getBudgetForCategory: (category, month) => {
    const budget = get().budgets.find(
      (b) => b.category === category && b.month === month
    );
    return budget?.amount || 0;
  },
}));
