
import { UUID } from "./common";

export interface BusinessProduct {
  id: UUID;
  business_id: UUID;
  product_id: string | null;
  name: string;
  description: string | null;
  sku: string | null;
  category_id: UUID | null;
  image_url: string | null;
  cost_price: number;
  selling_price: number;
  has_ingredients: boolean;
  has_consumables: boolean;
  has_addons: boolean;
  has_sizes: boolean;
  auto_generate_sku: boolean;
  total_sales: number;
  created_at: string;
  updated_at: string;
  
  // Joined fields
  category?: { id: UUID; name: string } | null;
  
  // Calculated fields
  quantity?: number;
  cost_margin?: number;
  profit_margin?: number;
  stock_status?: string;
}

export type ProductFormValues = {
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
};

export interface ProductIngredientInput {
  ingredient_id: string;
  quantity: number;
  cost: number;
}

export interface ProductConsumableInput {
  consumable_id: string;
  quantity: number;
  cost: number;
}

export interface ProductSizeInput {
  name: string;
  additional_price: number;
}

export interface ProductIngredient {
  id: UUID;
  product_id: UUID;
  ingredient_id: UUID;
  quantity: number;
  cost: number;
  created_at: string;
  
  // Joined fields
  ingredient?: {
    id: UUID;
    name: string;
  };
}

export interface ProductConsumable {
  id: UUID;
  product_id: UUID;
  consumable_id: UUID;
  quantity: number;
  cost: number;
  created_at: string;
  
  // Joined fields
  consumable?: {
    id: UUID;
    name: string;
  };
}

export interface ProductSize {
  id: UUID;
  product_id: UUID;
  name: string;
  additional_price: number;
  created_at: string;
  updated_at: string;
}
