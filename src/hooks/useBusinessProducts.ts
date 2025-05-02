
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
        // Calculate cost_margin and profit_margin
        const cost_margin = product.selling_price - product.cost_price;
        const profit_margin = product.cost_price > 0 ? (cost_margin / product.cost_price) * 100 : 0;
        
        // Determine stock status based on quantity
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
          quantity: quantity,
          cost_margin: cost_margin,
          profit_margin: profit_margin,
          stock_status: stock_status
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
