
import { Expense } from "@/types/business-expense";

export interface ExpenseFormProps {
  expense?: Expense;
  onSubmit: (data: ExpenseFormData) => void;
  isLoading: boolean;
}

export interface ExpenseFormData {
  name: string;
  amount: number;
  description?: string;
  expense_date: string;
  category?: string;
  payment_method?: string;
  status?: string;
}

export const paymentMethods = ['Cash', 'Credit Card', 'Debit Card', 'Bank Transfer', 'Check', 'Mobile Payment', 'Other'];
export const categories = ['Rent', 'Utilities', 'Salary', 'Inventory', 'Equipment', 'Marketing', 'Transportation', 'Food', 'Office Supplies', 'Software', 'Insurance', 'Taxes', 'Other'];
export const statusOptions = ['completed', 'pending', 'cancelled'];
