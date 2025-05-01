export interface BusinessProduct {
  id: string;
  business_id: string;
  product_id: string | null;
  name: string;
  sku: string | null;
  description: string | null;
  category_id: string | null;
  brand_id: string | null;
  warranty_id: string | null;
  location_id: string | null;
  unit_id: string | null;
  image_url: string | null;
  alert_quantity: number | null;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  quantity_sold: number;
  quantity_available: number;
  unit_price: number | null;
  selling_price: number | null;
  has_recipe: boolean;
  has_consumables: boolean;
  auto_generate_sku: boolean;
  warning_flags: Record<string, any> | null;
  created_at: string;
  updated_at: string;
  business_product_sizes?: BusinessProductSize[];
  business_product_recipes?: BusinessProductRecipe[];
  business_product_consumables?: BusinessProductConsumable[];
}

export interface BusinessProductSize {
  id: string;
  product_id: string;
  size_name: string;
  price: number;
  created_at: string;
  updated_at: string;
}

export interface BusinessProductRecipe {
  id: string;
  product_id: string;
  ingredient_id: string;
  quantity: number;
  unit_id: string | null;
  cost: number;
  created_at: string;
  updated_at: string;
}

export interface BusinessProductConsumable {
  id: string;
  product_id: string;
  consumable_id: string;
  quantity: number;
  unit_id: string | null;
  cost: number;
  created_at: string;
  updated_at: string;
}

export interface RecipeItem {
  ingredient_id: string;
  quantity: number;
  unit_id: string | null;
  cost: number;
}

export interface ConsumableItem {
  consumable_id: string;
  quantity: number;
  unit_id: string | null;
  cost: number;
}

export type ProductFormValues = {
  name: string;
  sku?: string;
  auto_generate_sku?: boolean;
  description?: string;
  category_id?: string;
  brand_id?: string;
  warranty_id?: string;
  location_id?: string;
  unit_id?: string;
  image_url?: string;
  alert_quantity?: number;  // Explicitly typed as number
  unit_price?: number;
  selling_price?: number;
  has_recipe?: boolean;
  has_consumables?: boolean;
  sizes?: {
    size_name: string;
    price: number;
  }[];
  recipe_items?: RecipeItem[];
  consumable_items?: ConsumableItem[];
};
