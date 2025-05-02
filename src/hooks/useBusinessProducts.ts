
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useBusinessAuth } from '@/context/BusinessAuthContext';
import { BusinessProduct } from '@/types/business-product';

const useBusinessProducts = (filters?: Record<string, any>) => {
  const { businessUser } = useBusinessAuth();

  const query = useQuery({
    queryKey: ['business-products', filters],
    queryFn: async (): Promise<BusinessProduct[]> => {
      if (!businessUser?.business_id) {
        return [];
      }

      // Start with a simple query to avoid the deep type nesting issue
      let productsQuery = supabase
        .from('business_products')
        .select(`
          *,
          category:business_categories(id, name)
        `)
        .eq('business_id', businessUser.business_id);

      // Apply filters if provided
      if (filters) {
        // Handle text search
        if (filters.search) {
          productsQuery = productsQuery.ilike('name', `%${filters.search}%`);
        }

        // Handle category filter
        if (filters.category) {
          productsQuery = productsQuery.eq('category_id', filters.category);
        }

        // Handle other filters as needed
        // ...
      }

      const { data: products, error } = await productsQuery;

      if (error) {
        console.error('Error fetching products:', error);
        throw error;
      }

      if (!products || products.length === 0) {
        return [];
      }

      // Get inventory quantities
      const { data: quantities } = await supabase
        .from('business_inventory_quantities')
        .select('*')
        .eq('business_id', businessUser.business_id)
        .eq('item_type', 'product');

      // Create a map for quick lookup
      const quantityMap: Record<string, any> = {};
      quantities?.forEach(item => {
        quantityMap[item.item_id] = item;
      });

      // Process the product data
      const processedProducts = products.map(product => {
        // Get quantity data
        const quantityData = quantityMap[product.id];
        const quantity = quantityData?.quantity || 0;

        // Calculate profit and cost margins
        const sellingPrice = parseFloat(product.selling_price.toString());
        const costPrice = parseFloat(product.cost_price.toString());
        
        const profit = sellingPrice - costPrice;
        const profitMargin = costPrice > 0 ? (profit / sellingPrice) * 100 : 0;
        const costMargin = sellingPrice > 0 ? (costPrice / sellingPrice) * 100 : 0;
        
        // Determine stock status
        let stockStatus = 'Out of Stock';
        if (quantity > 10) {
          stockStatus = 'In Stock';
        } else if (quantity > 0) {
          stockStatus = 'Low Stock';
        }

        return {
          ...product,
          quantity,
          cost_margin: parseFloat(costMargin.toFixed(2)),
          profit_margin: parseFloat(profitMargin.toFixed(2)),
          stock_status: stockStatus,
          total_value: quantityData?.total_value || 0,
          unit: null, // Set to null for now
          brand: null, // Set to null for now
          warranty: null // Set to null for now
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
