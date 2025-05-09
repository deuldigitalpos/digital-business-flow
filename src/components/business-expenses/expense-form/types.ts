
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
  tax_amount?: number;
  tax_included?: boolean;
}

export const ExpenseFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  amount: z.coerce.number().positive("Amount must be positive"),
  description: z.string().optional(),
  expense_date: z.string().min(1, "Date is required"),
  category: z.string().optional(),
  payment_method: z.string().optional(),
  status: z.string().optional(),
  tax_amount: z.coerce.number().optional(),
  tax_included: z.boolean().optional(),
});

export const statusOptions = ['completed', 'pending', 'cancelled'];
export const paymentMethodDefaultOptions = ['Cash', 'Credit Card', 'Bank Transfer', 'Mobile Payment'];

// Helper function to format status display
export const formatStatus = (status: string): string => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};
