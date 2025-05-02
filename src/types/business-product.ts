
export interface BusinessProduct {
  id: string;
  business_id: string;
  name: string;
  description?: string | null;
  sku?: string | null;
  category_id?: string | null;
  image_url?: string | null;
  product_id?: string | null;
  cost_price: number;
  selling_price: number;
  has_ingredients: boolean;
  has_consumables: boolean;
  has_addons?: boolean;
  has_sizes: boolean;
  auto_generate_sku: boolean;
  created_at: string;
  updated_at: string;
  total_sales?: number;
  unit_id?: string | null;
  brand_id?: string | null;
  warranty_id?: string | null;
  unit?: { id: string; name: string; short_name: string } | null;
  brand?: { id: string; name: string } | null;
  warranty?: { id: string; name: string } | null;
  category?: { id: string; name: string } | null;
  quantity?: number;
  cost_margin?: number;
  profit_margin?: number;
  stock_status?: string;
  total_value?: number;
}

export interface ProductIngredient {
  id: string;
  product_id: string;
  ingredient_id: string;
  quantity: number;
  unit_id?: string | null;
  cost: number;
  name?: string;
  unit?: { id: string; name: string; short_name: string } | null;
  ingredient?: { 
    id: string;
    name: string;
    unit?: { id: string; name: string; short_name: string } | null;
  } | null;
}

export interface ProductConsumable {
  id: string;
  product_id: string;
  consumable_id: string;
  quantity: number;
  unit_id?: string | null;
  cost: number;
  name?: string;
  unit?: { id: string; name: string; short_name: string } | null;
  consumable?: { 
    id: string;
    name: string;
    unit?: { id: string; name: string; short_name: string } | null;
  } | null;
}

export interface ProductSize {
  id: string;
  product_id: string;
  name: string;
  additional_price: number;
}

export interface ProductSizeInput {
  id?: string;
  name: string;
  additional_price: number;
}

export interface ProductIngredientInput {
  id?: string;
  ingredient_id: string;
  quantity: number;
  unit_id?: string;
  cost?: number;
}

export interface ProductConsumableInput {
  id?: string;
  consumable_id: string;
  quantity: number;
  unit_id?: string;
  cost?: number;
}

export interface ProductFormValues {
  name: string;
  description?: string;
  sku?: string;
  category_id?: string;
  image_url?: string;
  cost_price: number;
  selling_price: number;
  has_ingredients: boolean;
  has_consumables: boolean;
  has_sizes: boolean;
  auto_generate_sku: boolean;
  is_active: boolean;
  unit_id?: string;
  brand_id?: string;
  warranty_id?: string;
  sizes?: ProductSizeInput[];
  ingredients?: ProductIngredientInput[];
  consumables?: ProductConsumableInput[];
}
