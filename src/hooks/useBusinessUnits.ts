
import { useQuery } from '@tanstack/react-query';

export interface BusinessUnit {
  id: string;
  name: string;
  short_name: string;
}

// This is a placeholder hook since the business_units table doesn't exist
// It returns an empty array to prevent null reference errors
export const useBusinessUnits = () => {
  const query = useQuery({
    queryKey: ['business-units'],
    queryFn: async (): Promise<BusinessUnit[]> => {
      console.warn('business_units table does not exist');
      return [];
    }
  });

  return {
    data: [] as BusinessUnit[],
    isLoading: false,
    error: null
  };
};

export default useBusinessUnits;
