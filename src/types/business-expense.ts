
export type Expense = {
  id: string;
  business_id: string;
  created_by: string | null;
  creator_name?: string;
  amount: number;
  name: string;
  description: string | null;
  expense_date: string;
  category: string | null;
  payment_method: string | null;
  status: string | null;
  receipt_url: string | null;
  created_at: string;
  updated_at: string;
};

export type ExpenseSummary = {
  totalAmount: number;
  totalCount: number;
  todayCount: number;
  weekCount: number;
};

export type ExpenseFormData = {
  name: string;
  amount: number;
  description?: string;
  expense_date: string;
  category?: string;
  payment_method?: string;
  status?: string;
};
