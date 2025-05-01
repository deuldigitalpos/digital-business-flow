
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
  is_raw_ingredient: boolean;
  is_consumable: boolean;
  ingredient_id: string | null;
  consumable_id: string | null;
  created_at: string;
  updated_at: string;
  business_product_sizes?: BusinessProductSize[];
}

export interface BusinessProductSize {
  id: string;
  product_id: string;
  size_name: string;
  price: number;
  created_at: string;
  updated_at: string;
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
  expiration_date?: string | Date; // Updated to accept both string and Date
  alert_quantity?: number;
  is_raw_ingredient?: boolean;
  is_consumable?: boolean;
  ingredient_id?: string;
  consumable_id?: string;
  sizes?: {
    size_name: string;
    price: number;
  }[];
};
