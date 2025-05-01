
export interface BusinessUnit {
  id: string;
  business_id: string;
  name: string;
  short_name: string;
  description: string | null;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export type BusinessUnitFormValues = {
  name: string;
  short_name: string;
  description?: string;
  is_default?: boolean;
};
