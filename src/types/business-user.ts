
export interface BusinessUser {
  id: string;
  business_id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  role: string;
  role_id?: string;
  password?: string;
  created_at: string;
  date_of_birth?: string;
  gender?: string;
  marital_status?: string;
  contact_number?: string;
  bank_name?: string;
  bank_account_name?: string;
  bank_account_number?: string;
  primary_work_location?: string;
  daily_rate?: number;
  business_locations?: { name: string };
}
