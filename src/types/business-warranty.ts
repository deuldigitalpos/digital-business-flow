
export interface BusinessWarranty {
  id: string;
  business_id: string;
  name: string;
  description: string | null;
  duration: number;
  duration_unit: 'days' | 'weeks' | 'months' | 'years';
  is_active: boolean | null;
  created_at: string;
  updated_at: string;
}

export type BusinessWarrantyFormValues = {
  name: string;
  description?: string;
  duration: number;
  duration_unit: 'days' | 'weeks' | 'months' | 'years';
  is_active?: boolean;
};

export interface BusinessWarrantyProduct {
  id: string;
  warranty_id: string;
  product_id: string;
  created_at: string;
  expires_at: string;
}
