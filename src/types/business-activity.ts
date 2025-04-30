
export interface BusinessActivityLog {
  id: string;
  business_id: string;
  page: 'product' | 'ingredient' | 'consumable' | 'stock';
  action_type: string;
  item_id: string;
  item_name: string;
  previous_value: any | null;
  new_value: any | null;
  reason: string | null;
  updated_by: string;
  created_at: string;
}

export type ActivityLogFilters = {
  page?: string;
  action_type?: string;
  item_name?: string;
  updated_by?: string;
  start_date?: string;
  end_date?: string;
};
