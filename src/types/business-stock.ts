
export interface BusinessStockTransaction {
  id: string;
  business_id: string;
  item_type: 'product' | 'ingredient' | 'consumable';
  item_id: string;
  transaction_type: 'increase' | 'decrease';
  quantity: number;
  adjustment_reason: string | null;
  reason: string | null;
  updated_by: string;
  created_at: string;
  item_name?: string;
  business_products?: { name: string } | null;
  business_ingredients?: { name: string } | null;
  business_consumables?: { name: string } | null;
}

export type StockTransactionFormValues = {
  item_type: 'product' | 'ingredient' | 'consumable';
  item_id: string;
  transaction_type: 'increase' | 'decrease';
  quantity: number;
  adjustment_reason?: string;
  reason?: string;
};
