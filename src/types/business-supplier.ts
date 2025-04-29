
export interface BusinessSupplier {
  id: string;
  business_id: string;
  supplier_id: string | null;
  business_name: string | null;
  first_name: string;
  last_name: string;
  email: string | null;
  tin_number: string | null;
  credit_limit: number | null;
  address: string | null;
  mobile_number: string | null;
  total_purchase: number | null;
  total_invoices: number | null;
  total_invoices_due: number | null;
  total_amount_invoices_due: number | null;
  total_purchase_return_due: number | null;
  account_status: string;
  created_at: string;
  updated_at: string;
}

export type SupplierCreateInput = {
  business_id: string;
  first_name: string;
  last_name: string;
  account_status: string;
  // Make these fields optional
  business_name?: string | null;
  email?: string | null;
  tin_number?: string | null;
  credit_limit?: number | null;
  address?: string | null;
  mobile_number?: string | null;
};

export type SupplierUpdateInput = Partial<SupplierCreateInput>;

export const AccountStatusOptions = [
  'active',
  'inactive',
  'pending',
  'suspended',
  'blocked'
];
