
export interface BusinessBrand {
  id: string;
  business_id: string;
  name: string;
  description: string | null;
  is_active: boolean | null;
  created_at: string;
  updated_at: string;
}

export type BusinessBrandFormValues = {
  name: string;
  description?: string;
  is_active?: boolean;
};
