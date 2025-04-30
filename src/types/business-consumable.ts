
export interface BusinessConsumable {
  id: string;
  business_id: string;
  name: string;
  description: string | null;
  unit_id: string | null;
  unit_price: number;
  quantity_available: number;
  total_cost: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  created_at: string;
  updated_at: string;
}

export type ConsumableFormValues = {
  name: string;
  description?: string;
  unit_id?: string;
  unit_price: number;
  quantity_available?: number;
};
