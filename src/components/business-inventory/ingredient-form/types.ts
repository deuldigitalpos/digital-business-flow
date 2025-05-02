
import { z } from 'zod';
import { BusinessIngredient } from '@/hooks/useBusinessIngredients';

export const ingredientFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional().nullable(),
  category_id: z.string().optional().nullable(),
  image_url: z.string().optional().nullable()
});

export type IngredientFormValues = z.infer<typeof ingredientFormSchema>;

export interface IngredientFormProps {
  ingredient: BusinessIngredient | null;
  onClose: () => void;
}
