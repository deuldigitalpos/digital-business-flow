
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BusinessProduct } from '@/types/business-product';
import { useBusinessAuth } from '@/context/BusinessAuthContext';
import { addDays, format } from 'date-fns';

export function useBusinessProducts() {
  const { business } = useBusinessAuth();

  return useQuery({
    queryKey: ['business-products', business?.id],
    queryFn: async () => {
      if (!business?.id) {
        return [];
      }

      const { data, error } = await supabase
        .from('business_products')
        .select('*, business_product_sizes(*)')
        .eq('business_id', business.id);

      if (error) {
        console.error('Error fetching products:', error);
        throw error;
      }

      // Add default values for properties that might be missing in the DB and cast to BusinessProduct
      return (data || []).map(product => ({
        ...product,
        unit_price: product.unit_price ?? 0,
        selling_price: product.selling_price ?? 0,
        has_recipe: product.has_recipe ?? false,
        has_modifiers: product.has_modifiers ?? false,
        has_consumables: product.has_consumables ?? false,
      })) as BusinessProduct[];
    },
    enabled: !!business?.id,
  });
}

export function useBusinessProduct(id: string | undefined) {
  const { business } = useBusinessAuth();

  return useQuery({
    queryKey: ['business-product', id],
    queryFn: async () => {
      if (!id || !business?.id) {
        throw new Error('Product ID or business ID is missing');
      }

      const { data, error } = await supabase
        .from('business_products')
        .select('*, business_product_sizes(*)')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching product details:', error);
        throw error;
      }

      // Add default values for properties that might be missing in the DB and cast to BusinessProduct
      return {
        ...data,
        unit_price: data.unit_price ?? 0,
        selling_price: data.selling_price ?? 0,
        has_recipe: data.has_recipe ?? false,
        has_modifiers: data.has_modifiers ?? false,
        has_consumables: data.has_consumables ?? false,
      } as unknown as BusinessProduct;
    },
    enabled: !!id && !!business?.id,
  });
}

export function useLowStockProducts() {
  const { business } = useBusinessAuth();

  return useQuery({
    queryKey: ['low-stock-products', business?.id],
    queryFn: async () => {
      if (!business?.id) {
        return [];
      }

      const { data, error } = await supabase
        .from('business_products')
        .select('*')
        .eq('business_id', business.id)
        .or('quantity_available.lt.alert_quantity,status.eq.Low Stock');

      if (error) {
        console.error('Error fetching low stock products:', error);
        throw error;
      }

      // Add default values for properties that might be missing in the DB and cast to BusinessProduct
      return (data || []).map(product => ({
        ...product,
        unit_price: product.unit_price ?? 0,
        selling_price: product.selling_price ?? 0,
        has_recipe: product.has_recipe ?? false,
        has_modifiers: product.has_modifiers ?? false,
        has_consumables: product.has_consumables ?? false,
      })) as unknown as BusinessProduct[];
    },
    enabled: !!business?.id,
  });
}

export function useExpiringProducts(daysThreshold: number = 30) {
  const { business } = useBusinessAuth();

  return useQuery({
    queryKey: ['expiring-products', business?.id, daysThreshold],
    queryFn: async () => {
      if (!business?.id) {
        return [];
      }

      // Calculate the date threshold
      const thresholdDate = addDays(new Date(), daysThreshold);
      const thresholdDateStr = format(thresholdDate, 'yyyy-MM-dd');

      const { data, error } = await supabase
        .from('business_products')
        .select('*')
        .eq('business_id', business.id)
        .not('expiration_date', 'is', null)
        .lte('expiration_date', thresholdDateStr);

      if (error) {
        console.error('Error fetching expiring products:', error);
        throw error;
      }

      // Add default values for properties that might be missing in the DB and cast to BusinessProduct
      return (data || []).map(product => ({
        ...product,
        unit_price: product.unit_price ?? 0,
        selling_price: product.selling_price ?? 0,
        has_recipe: product.has_recipe ?? false,
        has_modifiers: product.has_modifiers ?? false,
        has_consumables: product.has_consumables ?? false,
      })) as unknown as BusinessProduct[];
    },
    enabled: !!business?.id,
  });
}
