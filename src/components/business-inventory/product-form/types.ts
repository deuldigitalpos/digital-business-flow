
import { z } from "zod";

export const productFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  sku: z.string().optional(),
  category_id: z.string().optional(),
  image_url: z.string().optional(),
  cost_price: z.number().min(0, "Cost price must be positive"),
  selling_price: z.number().min(0, "Selling price must be positive"),
  has_ingredients: z.boolean().default(false),
  has_consumables: z.boolean().default(false),
  has_sizes: z.boolean().default(false),
  auto_generate_sku: z.boolean().default(true),
  is_active: z.boolean().default(true),
  sizes: z.array(
    z.object({
      name: z.string(),
      additional_price: z.number(),
    })
  ).optional(),
  ingredients: z.array(
    z.object({
      ingredient_id: z.string(),
      quantity: z.number(),
      cost: z.number(),
    })
  ).optional(),
  consumables: z.array(
    z.object({
      consumable_id: z.string(),
      quantity: z.number(),
      cost: z.number(),
    })
  ).optional(),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;

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
