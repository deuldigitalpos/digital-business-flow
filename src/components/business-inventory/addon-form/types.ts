
import { z } from 'zod';

export const addonFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  category_id: z.string().optional(),
  image_url: z.string().optional()
});

export type AddonFormValues = z.infer<typeof addonFormSchema>;
