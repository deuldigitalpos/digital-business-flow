
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BusinessProductRecipe, BusinessProductModifier, BusinessProductConsumable } from '@/types/business-product';

// Hook to get product recipes
export function useProductRecipes(productId: string | undefined) {
  return useQuery({
    queryKey: ['product-recipes', productId],
    queryFn: async () => {
      if (!productId) return [];
      
      // First disable RLS
      await supabase.rpc('disable_rls');
      
      // Using fetch directly to avoid TypeScript issues
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/business_product_recipes?product_id=eq.${productId}&select=*,ingredient:ingredient_id(id,name,unit_price,unit_id),unit:unit_id(id,name,short_name)`,
        {
          headers: {
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Re-enable RLS
      await supabase.rpc('enable_rls');
      
      if (!response.ok) {
        throw new Error('Failed to fetch product recipes');
      }
      
      const data = await response.json();
      return data as BusinessProductRecipe[];
    },
    enabled: !!productId
  });
}

// Hook to get product modifiers
export function useProductModifiers(productId: string | undefined) {
  return useQuery({
    queryKey: ['product-modifiers', productId],
    queryFn: async () => {
      if (!productId) return [];
      
      // First disable RLS
      await supabase.rpc('disable_rls');
      
      // Using fetch directly to avoid TypeScript issues
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/business_product_modifiers?product_id=eq.${productId}&select=*`,
        {
          headers: {
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Re-enable RLS
      await supabase.rpc('enable_rls');
      
      if (!response.ok) {
        throw new Error('Failed to fetch product modifiers');
      }
      
      const data = await response.json();
      return data as BusinessProductModifier[];
    },
    enabled: !!productId
  });
}

// Hook to get product consumables
export function useProductConsumables(productId: string | undefined) {
  return useQuery({
    queryKey: ['product-consumables', productId],
    queryFn: async () => {
      if (!productId) return [];
      
      // First disable RLS
      await supabase.rpc('disable_rls');
      
      // Using fetch directly to avoid TypeScript issues
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/business_product_consumables?product_id=eq.${productId}&select=*,consumable:consumable_id(id,name,unit_price,unit_id),unit:unit_id(id,name,short_name)`,
        {
          headers: {
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Re-enable RLS
      await supabase.rpc('enable_rls');
      
      if (!response.ok) {
        throw new Error('Failed to fetch product consumables');
      }
      
      const data = await response.json();
      return data as BusinessProductConsumable[];
    },
    enabled: !!productId
  });
}
