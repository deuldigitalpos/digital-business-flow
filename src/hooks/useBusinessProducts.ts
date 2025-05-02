
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useBusinessAuth } from '@/context/BusinessAuthContext';
import { BusinessProduct } from '@/types/business-product';

export const useBusinessProducts = (filters: Record<string, any> = {}) => {
  const { businessUser } = useBusinessAuth();
  
  const query = useQuery({
    queryKey: ['business-products', filters],
    queryFn: async (): Promise<BusinessProduct[]> => {
      if (!businessUser?.business_id) {
        return [];
      }
      
      // First, fetch the products
      let queryBuilder = supabase
        .from('business_products')
        .select(`
          *,
          category:business_categories(id, name),
          unit:business_units(id, name, short_name),
          brand:business_brands(id, name),
          warranty:business_warranties(id, name)
        `)
        .eq('business_id', businessUser.business_id);
      
      // Apply filters
      if (filters.category_id) {
        queryBuilder = queryBuilder.eq('category_id', filters.category_id);
      }
      
      if (filters.brand_id) {
        queryBuilder = queryBuilder.eq('brand_id', filters.brand_id);
      }
      
      if (filters.search) {
        queryBuilder = queryBuilder.or(`name.ilike.%${filters.search}%,sku.ilike.%${filters.search}%,product_id.ilike.%${filters.search}%`);
      }
      
      const { data: products, error: productsError } = await queryBuilder;
      
      if (productsError) {
        console.error('Error fetching products:', productsError);
        throw productsError;
      }

      // Then get the quantities from inventory table
      const { data: quantities, error: quantitiesError } = await supabase
        .from('business_inventory_quantities')
        .select('*')
        .eq('business_id', businessUser.business_id)
        .eq('item_type', 'product');
      
      if (quantitiesError) {
        console.error('Error fetching quantities:', quantitiesError);
        throw quantitiesError;
      }

      // Merge the data
      const quantityMap: Record<string, any> = {};
      quantities?.forEach(item => {
        quantityMap[item.item_id] = item;
      });

      // Process the data to add quantities
      const processedProducts = products.map(product => {
        // Handle possible SelectQueryError for unit, brand, warranty
        const unitData = product.unit && !product.unit.error
          ? { id: product.unit.id, name: product.unit.name, short_name: product.unit.short_name }
          : null;
          
        const brandData = product.brand && !product.brand.error
          ? { id: product.brand.id, name: product.brand.name }
          : null;
          
        const warrantyData = product.warranty && !product.warranty.error
          ? { id: product.warranty.id, name: product.warranty.name }
          : null;
        
        // Calculate cost_margin and profit_margin
        const cost_margin = product.selling_price - product.cost_price;
        const profit_margin = product.cost_price > 0 ? (cost_margin / product.cost_price) * 100 : 0;
        
        // Get quantity
        const quantity = quantityMap[product.id]?.quantity || 0;
        
        // Basic stock status - will be potentially overridden later by component availability
        let stock_status = 'Out of Stock';
        if (quantity > 10) {
          stock_status = 'In Stock';
        } else if (quantity > 0) {
          stock_status = 'Low Stock';
        }
        
        return {
          ...product,
          unit: unitData,
          brand: brandData,
          warranty: warrantyData,
          quantity: quantity,
          cost_margin: cost_margin,
          profit_margin: profit_margin,
          stock_status: stock_status,
          total_value: quantity * product.cost_price
        };
      });

      return processedProducts as BusinessProduct[];
    },
    enabled: !!businessUser?.business_id
  });

  return {
    products: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch
  };
};

export default useBusinessProducts;
