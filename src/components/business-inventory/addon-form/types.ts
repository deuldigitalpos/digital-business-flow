
import { z } from 'zod';
import { BusinessAddon } from '@/hooks/useBusinessAddons';

export const addonFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional().nullable(),
  category_id: z.string().optional().nullable(),
  unit_id: z.string().optional().nullable(),
  image_url: z.string().optional().nullable()
});

export type AddonFormValues = z.infer<typeof addonFormSchema>;

export interface AddonFormProps {
  addon: BusinessAddon | null;
  onClose: () => void;
}
