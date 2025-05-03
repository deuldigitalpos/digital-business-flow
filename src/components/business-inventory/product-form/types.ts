
import { ProductConsumableInput, ProductIngredientInput, ProductSizeInput } from "@/types/business-product";

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
