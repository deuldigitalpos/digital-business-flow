
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useBusinessAuth } from '@/context/BusinessAuthContext';
import { BusinessUnit, UnitType } from '@/types/business-unit';

export const useBusinessUnits = () => {
  const { businessUser } = useBusinessAuth();
  const businessId = businessUser?.business_id;

  return useQuery({
    queryKey: ['business-units'],
    queryFn: async (): Promise<BusinessUnit[]> => {
      if (!businessId) {
        return [];
      }
      
      try {
        const { data, error } = await supabase
          .from('business_units')
          .select('*')
          .eq('business_id', businessId)
          .order('name');
        
        if (error) {
          console.error('Error fetching units:', error);
          return [];
        }
        
        // Apply type validation and transformation to ensure data conforms to BusinessUnit type
        const validatedUnits: BusinessUnit[] = Array.isArray(data) ? data.map(unit => {
          // Validate that type is one of the acceptable UnitType values
          let validType: UnitType = 'weight'; // Default fallback
          
          // Check if type is a valid UnitType
          if (unit.type === 'weight' || 
              unit.type === 'volume' || 
              unit.type === 'length' || 
              unit.type === 'count') {
            validType = unit.type as UnitType;
          } else {
            console.warn(`Invalid unit type "${unit.type}" for unit ${unit.id}, defaulting to "weight"`);
          }
          
          // Return a validated BusinessUnit object
          return {
            id: unit.id,
            name: unit.name,
            short_name: unit.short_name,
            type: validType,
            description: unit.description,
            is_default: !!unit.is_default,
            created_at: unit.created_at,
            updated_at: unit.updated_at,
            business_id: unit.business_id
          };
        }) : [];
        
        return validatedUnits;
      } catch (error) {
        console.error('Caught error fetching units:', error);
        return [];
      }
    },
    enabled: !!businessId
  });
};

export default useBusinessUnits;
