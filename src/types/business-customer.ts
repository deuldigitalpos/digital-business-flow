
export interface BusinessCustomer {
  id: string;
  business_id: string;
  customer_id: string | null;
  business_name: string | null;
  first_name: string;
  last_name: string;
  email: string | null;
  tin_number: string | null;
  credit_limit: number | null;
  address: string | null;
  mobile_number: string | null;
  total_sale: number | null;
  total_invoices: number | null;
  total_invoices_due: number | null;
  total_amount_invoices_due: number | null;
  total_sell_return_due: number | null;
  account_status: string;
  is_lead: boolean | null;
  created_at: string;
  updated_at: string;
}

export type CustomerCreateInput = {
  business_id: string;
  first_name: string;
  last_name: string;
  account_status: string;
  is_lead?: boolean | null;
  // Make these fields optional
  business_name?: string | null;
  email?: string | null;
  tin_number?: string | null;
  credit_limit?: number | null;
  address?: string | null;
  mobile_number?: string | null;
  // Lead source reference
  lead_source_id?: string | null;
};

export type CustomerUpdateInput = Partial<CustomerCreateInput>;

export const AccountStatusOptions = [
  'active',
  'inactive',
  'pending',
  'suspended',
  'blocked'
];

export const LeadOptions = [
  { value: true, label: 'Yes' },
  { value: false, label: 'No' }
];
