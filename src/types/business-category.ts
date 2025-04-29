
import { UUID } from "./common";

export interface BusinessCategory {
  id: UUID;
  business_id: UUID;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  total_sales: number | null;
  monthly_sales: number | null;
}

export interface CreateCategoryInput {
  name: string;
  description?: string;
}

export interface UpdateCategoryInput {
  name?: string;
  description?: string;
}
