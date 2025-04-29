
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

export type CustomerCreateInput = Pick<
  BusinessCustomer,
  | 'business_id'
  | 'business_name'
  | 'first_name'
  | 'last_name'
  | 'email'
  | 'tin_number'
  | 'credit_limit'
  | 'address'
  | 'mobile_number'
  | 'account_status'
  | 'is_lead'
>;

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
