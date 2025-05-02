
import { z } from 'zod';
import { BusinessAddon } from '@/types/business-addon';

export const addonFormSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  description: z.string().nullable().optional(),
  category_id: z.string().nullable().optional(),
  unit_id: z.string().nullable().optional(),
  image_url: z.string().nullable().optional(),
});

export type AddonFormValues = z.infer<typeof addonFormSchema>;

export interface AddonFormProps {
  addon?: BusinessAddon;
  onClose: () => void;
}
