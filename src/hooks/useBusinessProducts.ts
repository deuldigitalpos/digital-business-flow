
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
          category:business_categories(id, name)
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

      // Fetch units, brands, and warranties separately to avoid join errors
      const unitIds = products
        .filter(p => p.unit_id)
        .map(p => p.unit_id);
      
      const brandIds = products
        .filter(p => p.brand_id)
        .map(p => p.brand_id);
        
      const warrantyIds = products
        .filter(p => p.warranty_id)
        .map(p => p.warranty_id);

      // Fetch units
      const unitMap: Record<string, { id: string; name: string; short_name: string }> = {};
      if (unitIds.length > 0) {
        const { data: units } = await supabase
          .from('business_units')
          .select('id, name, short_name')
          .in('id', unitIds);
          
        if (units) {
          units.forEach(unit => {
            unitMap[unit.id] = unit;
          });
        }
      }

      // Fetch brands
      const brandMap: Record<string, { id: string; name: string }> = {};
      if (brandIds.length > 0) {
        const { data: brands } = await supabase
          .from('business_brands')
          .select('id, name')
          .in('id', brandIds);
          
        if (brands) {
          brands.forEach(brand => {
            brandMap[brand.id] = brand;
          });
        }
      }

      // Fetch warranties
      const warrantyMap: Record<string, { id: string; name: string }> = {};
      if (warrantyIds.length > 0) {
        const { data: warranties } = await supabase
          .from('business_warranties')
          .select('id, name')
          .in('id', warrantyIds);
          
        if (warranties) {
          warranties.forEach(warranty => {
            warrantyMap[warranty.id] = warranty;
          });
        }
      }

      // Merge the data
      const quantityMap: Record<string, any> = {};
      quantities?.forEach(item => {
        quantityMap[item.item_id] = item;
      });

      // Process the data to add quantities
      const processedProducts = products.map(product => {
        // Resolve unit using our separate unit query
        const unitData = product.unit_id && unitMap[product.unit_id] 
          ? unitMap[product.unit_id] 
          : null;
          
        // Resolve brand using our separate brand query
        const brandData = product.brand_id && brandMap[product.brand_id] 
          ? brandMap[product.brand_id] 
          : null;
          
        // Resolve warranty using our separate warranty query
        const warrantyData = product.warranty_id && warrantyMap[product.warranty_id] 
          ? warrantyMap[product.warranty_id] 
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
