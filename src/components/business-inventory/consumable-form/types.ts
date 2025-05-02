
import { z } from 'zod';
import { BusinessConsumable } from '@/hooks/useBusinessConsumables';

export const consumableFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional().nullable(),
  category_id: z.string().optional().nullable(),
  unit_id: z.string().optional().nullable(),
  image_url: z.string().optional().nullable()
});

export type ConsumableFormValues = z.infer<typeof consumableFormSchema>;

export interface ConsumableFormProps {
  consumable: BusinessConsumable | null;
  onClose: () => void;
}
