
import { UUID } from "./common";
import { BusinessBrand } from "./business-brand";
import { BusinessCategory } from "./business-category";
import { BusinessUnit } from "./business-unit";
import { BusinessWarranty } from "./business-warranty";

export interface BusinessProduct {
  id: UUID;
  business_id: UUID;
  product_id: string | null;
  name: string;
  description: string | null;
  sku: string | null;
  category_id: UUID | null;
  unit_id: UUID | null;
  brand_id: UUID | null;
  warranty_id: UUID | null;
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
  unit?: { id: UUID; name: string; short_name: string } | null;
  brand?: { id: UUID; name: string } | null;
  warranty?: { id: UUID; name: string } | null;
  
  // Calculated fields
  quantity?: number;
  cost_margin?: number;
  profit_margin?: number;
  stock_status?: string;
}

export interface ProductFormValues {
  name: string;
  description?: string;
  sku?: string;
  category_id?: string;
  unit_id?: string;
  brand_id?: string;
  warranty_id?: string;
  image_url?: string;
  cost_price: number;
  selling_price: number;
  has_ingredients: boolean;
  has_consumables: boolean;
  has_sizes: boolean;
  auto_generate_sku: boolean;
}

export interface ProductIngredient {
  id: UUID;
  product_id: UUID;
  ingredient_id: UUID;
  quantity: number;
  unit_id: UUID | null;
  cost: number;
  created_at: string;
  
  // Joined fields
  ingredient?: {
    id: UUID;
    name: string;
    unit?: { id: UUID; name: string; short_name: string } | null;
  };
  unit?: { id: UUID; name: string; short_name: string } | null;
}

export interface ProductConsumable {
  id: UUID;
  product_id: UUID;
  consumable_id: UUID;
  quantity: number;
  unit_id: UUID | null;
  cost: number;
  created_at: string;
  
  // Joined fields
  consumable?: {
    id: UUID;
    name: string;
    unit?: { id: UUID; name: string; short_name: string } | null;
  };
  unit?: { id: UUID; name: string; short_name: string } | null;
}

export interface ProductSize {
  id: UUID;
  product_id: UUID;
  name: string;
  additional_price: number;
  created_at: string;
  updated_at: string;
}

export interface ProductIngredientInput {
  ingredient_id: string;
  quantity: number;
  unit_id: string;
  cost: number;
}

export interface ProductConsumableInput {
  consumable_id: string;
  quantity: number;
  unit_id: string;
  cost: number;
}

export interface ProductSizeInput {
  name: string;
  additional_price: number;
}
