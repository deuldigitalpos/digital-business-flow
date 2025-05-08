
import { Business } from '@/types/business';

export const isBusinessActive = (business: Business): boolean => {
  // Check if custom_data exists and if is_active is explicitly false
  // If custom_data doesn't exist or is_active is not defined, default to true
  return business.custom_data?.is_active !== false;
};

/**
 * Helper function to check if a business has required profile information
 * @param business The business object to check
 * @returns boolean indicating if the profile is complete
 */
export const isBusinessProfileComplete = (business: Business): boolean => {
  // At minimum, a business should have a name, country and currency
  return !!(business.business_name && business.country && business.currency);
};
