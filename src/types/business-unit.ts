
export interface BusinessUnit {
  id: string;
  name: string;
  short_name: string;
  type: UnitType;
  description?: string | null;
  is_default: boolean;
  created_at: string;
  updated_at: string;
  business_id: string;
}

export type UnitType = 'weight' | 'volume' | 'length' | 'count';

export interface BusinessUnitFormValues {
  name: string;
  short_name: string;
  type: UnitType;
  description?: string;
  is_default?: boolean;
}
