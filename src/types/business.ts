
export interface Business {
  id: string;
  business_name: string;
  currency: string;
  country: string;
  website: string | null;
  logo_url: string | null;
  contact_number: string | null;
  created_at: string;
  updated_at: string;
  custom_data?: {
    is_active?: boolean;
  } | null;
}
