
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
  image_url: string | null;
  expiration_date: string | null; // ISO date string
  alert_quantity: number | null;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  quantity_sold: number;
  quantity_available: number;
  is_consumable: boolean;
  unit_price: number | null;
  selling_price: number | null;
  has_recipe: boolean;
  has_modifiers: boolean;
  has_consumables: boolean;
  created_at: string;
  updated_at: string;
  business_product_sizes?: BusinessProductSize[];
  business_product_recipes?: BusinessProductRecipe[];
  business_product_modifiers?: BusinessProductModifier[];
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

export interface BusinessProductModifier {
  id: string;
  product_id: string;
  name: string;
  size_regular_price: number;
  size_medium_price: number | null;
  size_large_price: number | null;
  size_xl_price: number | null;
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

export interface ModifierItem {
  name: string;
  size_regular_price: number;
  size_medium_price: number | null;
  size_large_price: number | null;
  size_xl_price: number | null;
}

export type ProductFormValues = {
  name: string;
  sku?: string;
  description?: string;
  category_id?: string;
  brand_id?: string;
  warranty_id?: string;
  location_id?: string;
  image_url?: string;
  expiration_date?: string; // Changed from string | Date to just string
  alert_quantity?: number;
  is_consumable?: boolean;
  unit_price?: number;
  selling_price?: number;
  has_recipe?: boolean;
  has_modifiers?: boolean;
  has_consumables?: boolean;
  sizes?: {
    size_name: string;
    price: number;
  }[];
  recipe_items?: RecipeItem[];
  modifier_items?: ModifierItem[];
  consumable_items?: ConsumableItem[];
};
