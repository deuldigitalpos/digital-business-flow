
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
  category_name?: string;
  payment_method_name?: string;
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

export type ExpenseCategory = {
  id: string;
  business_id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
};

export type ExpenseCategoryFormData = {
  name: string;
  description?: string;
};

export type ExpensePaymentMethod = {
  id: string;
  business_id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
};

export type ExpensePaymentMethodFormData = {
  name: string;
  description?: string;
};
