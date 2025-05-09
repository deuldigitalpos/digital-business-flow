
import { z } from "zod";
import { Expense } from "@/types/business-expense";

export interface ExpenseFormProps {
  initialValues?: Partial<ExpenseFormData> & { id?: string };
  onSuccess?: () => void;
  isEditing?: boolean;
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

export const ExpenseFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  amount: z.coerce.number().positive("Amount must be positive"),
  description: z.string().optional(),
  expense_date: z.string().min(1, "Date is required"),
  category: z.string().optional(),
  payment_method: z.string().optional(),
  status: z.string().optional(),
});

export const paymentMethods = ['Cash', 'Credit Card', 'Debit Card', 'Bank Transfer', 'Check', 'Mobile Payment', 'Other'];
export const categories = ['Rent', 'Utilities', 'Salary', 'Inventory', 'Equipment', 'Marketing', 'Transportation', 'Food', 'Office Supplies', 'Software', 'Insurance', 'Taxes', 'Other'];
export const statusOptions = ['completed', 'pending', 'cancelled'];
