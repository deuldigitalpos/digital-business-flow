
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useBusinessAuth } from '@/context/BusinessAuthContext';
import useProductIngredients from './useProductIngredients';
import useProductConsumables from './useProductConsumables';
import { BusinessProduct } from '@/types/business-product';

export interface ProductAvailability {
  productId: string;
  maxProducibleQuantity: number;
  directQuantity: number;
  calculatedFromComponents: boolean;
  limitingComponents: {
    type: 'ingredient' | 'consumable';
    id: string;
    name: string;
    availableQuantity: number;
    requiredQuantity: number;
    maxProductsPossible: number;
  }[];
}

export const useProductAvailability = (product?: BusinessProduct) => {
  const { businessUser } = useBusinessAuth();
  const { ingredients } = useProductIngredients(product?.id);
  const { consumables } = useProductConsumables(product?.id);
  
  const query = useQuery({
    queryKey: ['product-availability', product?.id, ingredients, consumables],
    queryFn: async (): Promise<ProductAvailability | null> => {
      if (!product || !businessUser?.business_id) {
        return null;
      }
      
      // If product has no ingredients or consumables, return null
      // as availability is based directly on inventory
      if (!product.has_ingredients && !product.has_consumables) {
        return {
          productId: product.id,
          maxProducibleQuantity: product.quantity || 0,
          directQuantity: product.quantity || 0,
          calculatedFromComponents: false,
          limitingComponents: []
        };
      }
      
      const componentLimits: {
        type: 'ingredient' | 'consumable';
        id: string;
        name: string;
        availableQuantity: number;
        requiredQuantity: number;
        maxProductsPossible: number;
      }[] = [];
      
      // Process ingredients
      if (ingredients.length > 0) {
        // Get current inventory quantities for ingredients
        const { data: ingredientQuantities } = await supabase
          .from('business_inventory_quantities')
          .select('item_id, quantity')
          .eq('business_id', businessUser.business_id)
          .eq('item_type', 'ingredient')
          .in('item_id', ingredients.map(ing => ing.ingredient_id));
        
        const ingredientQuantityMap: Record<string, number> = {};
        ingredientQuantities?.forEach(item => {
          ingredientQuantityMap[item.item_id] = item.quantity || 0;
        });
        
        // Calculate how many products can be made based on each ingredient
        ingredients.forEach(ingredient => {
          const availableQuantity = ingredientQuantityMap[ingredient.ingredient_id] || 0;
          const requiredQuantity = ingredient.quantity;
          
          // If requiredQuantity is 0 or negative, this ingredient doesn't limit production
          if (requiredQuantity <= 0) return;
          
          const maxProductsPossible = Math.floor(availableQuantity / requiredQuantity);
          
          componentLimits.push({
            type: 'ingredient',
            id: ingredient.ingredient_id,
            name: ingredient.ingredient?.name || 'Unknown Ingredient',
            availableQuantity,
            requiredQuantity,
            maxProductsPossible
          });
        });
      }
      
      // Process consumables
      if (consumables.length > 0) {
        // Get current inventory quantities for consumables
        const { data: consumableQuantities } = await supabase
          .from('business_inventory_quantities')
          .select('item_id, quantity')
          .eq('business_id', businessUser.business_id)
          .eq('item_type', 'consumable')
          .in('item_id', consumables.map(cons => cons.consumable_id));
        
        const consumableQuantityMap: Record<string, number> = {};
        consumableQuantities?.forEach(item => {
          consumableQuantityMap[item.item_id] = item.quantity || 0;
        });
        
        // Calculate how many products can be made based on each consumable
        consumables.forEach(consumable => {
          const availableQuantity = consumableQuantityMap[consumable.consumable_id] || 0;
          const requiredQuantity = consumable.quantity;
          
          // If requiredQuantity is 0 or negative, this consumable doesn't limit production
          if (requiredQuantity <= 0) return;
          
          const maxProductsPossible = Math.floor(availableQuantity / requiredQuantity);
          
          componentLimits.push({
            type: 'consumable',
            id: consumable.consumable_id,
            name: consumable.consumable?.name || 'Unknown Consumable',
            availableQuantity,
            requiredQuantity,
            maxProductsPossible
          });
        });
      }
      
      // Sort limiting components by maxProductsPossible (ascending)
      const sortedLimits = componentLimits.sort((a, b) => a.maxProductsPossible - b.maxProductsPossible);
      
      // Calculate max producible quantity
      let maxProducibleQuantity = Infinity;
      if (sortedLimits.length > 0) {
        // The most limiting component determines how many products can be made
        maxProducibleQuantity = sortedLimits[0].maxProductsPossible;
      }
      
      return {
        productId: product.id,
        maxProducibleQuantity: maxProducibleQuantity === Infinity ? 0 : maxProducibleQuantity,
        directQuantity: product.quantity || 0,
        calculatedFromComponents: sortedLimits.length > 0,
        limitingComponents: sortedLimits
      };
    },
    enabled: !!product?.id && !!businessUser?.business_id && (!!product?.has_ingredients || !!product?.has_consumables)
  });

  return {
    availability: query.data,
    isLoading: query.isLoading,
    error: query.error
  };
};

export default useProductAvailability;
