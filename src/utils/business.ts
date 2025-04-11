
import { Business } from '@/types/business';

export const isBusinessActive = (business: Business): boolean => {
  return business.custom_data?.is_active !== false;
};
