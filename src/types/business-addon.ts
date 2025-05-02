
export interface BusinessAddon {
  id: string;
  business_id: string;
  name: string;
  description?: string | null;
  category_id?: string | null;
  image_url?: string | null;
  unit_id?: string | null;
  created_at: string;
  updated_at: string;
  quantity?: number;
  average_cost?: number;
  total_value?: number;
  category?: { id: string; name: string } | null;
  unit?: { id: string; name: string; short_name: string } | null;
}

export interface BusinessAddonFormValues {
  name: string;
  description?: string;
  category_id?: string;
  unit_id?: string;
  image_url?: string;
}
