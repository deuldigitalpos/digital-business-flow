
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BusinessProduct, ProductFormValues } from '@/types/business-product';
import { toast } from 'sonner';
import { disableRLS, enableRLS, insertProductRecipes, insertProductConsumables } from './productMutationUtils';

export function useCreateProduct(businessId: string | undefined, businessUserId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productData: ProductFormValues) => {
      if (!businessId) {
        throw new Error('Business ID is required');
      }

      if (!businessUserId) {
        throw new Error('Business User ID is required for authentication');
      }

      // Process optional IDs, converting "none" to null
      const category_id = productData.category_id === "none" ? null : productData.category_id;
      const brand_id = productData.brand_id === "none" ? null : productData.brand_id;
      const warranty_id = productData.warranty_id === "none" ? null : productData.warranty_id;
      const location_id = productData.location_id === "none" ? null : productData.location_id;
      const unit_id = productData.unit_id === "none" ? null : productData.unit_id;

      // CRITICAL: Ensure alert_quantity is properly parsed to a number
      const alert_quantity = productData.alert_quantity ? Number(productData.alert_quantity) : 10;
      
      console.log("Creating product with data:", {
        ...productData,
        alert_quantity,
        business_id: businessId,
        businessUserId: businessUserId
      });

      console.log("alert_quantity type:", typeof alert_quantity);
      console.log("alert_quantity value:", alert_quantity);
      
      const productToCreate = {
        business_id: businessId,
        name: productData.name,
        sku: productData.sku || null,
        auto_generate_sku: productData.auto_generate_sku || false,
        description: productData.description || null,
        category_id: category_id,
        brand_id: brand_id,
        warranty_id: warranty_id,
        location_id: location_id,
        unit_id: unit_id,
        image_url: productData.image_url || null,
        alert_quantity: alert_quantity,
        unit_price: Number(productData.unit_price || 0),
        selling_price: Number(productData.selling_price || 0),
        has_recipe: productData.has_recipe || false,
        has_consumables: productData.has_consumables || false,
        quantity_available: 0,
        quantity_sold: 0
      };
      
      let accessToken: string | null = null;
      
      try {
        console.log("Disabling RLS with business user ID:", businessUserId);
        
        // Disable RLS
        accessToken = await disableRLS();
        console.log("RLS disabled, proceeding with product creation");
        
        // Log the exact object we're sending to the database
        console.log("Product object to insert into database:", JSON.stringify(productToCreate));
        
        // Create the product with explicit alert_quantity as a number
        const { data: newProduct, error: productError } = await supabase
          .from('business_products')
          .insert({
            ...productToCreate,
            alert_quantity: alert_quantity // Explicitly ensure this is a number
          })
          .select('*')
          .single();

        if (productError) {
          console.error('Error creating product:', productError);
          throw new Error(`Failed to create product: ${productError.message}`);
        }
        
        console.log("Product created successfully:", newProduct);

        // Create a properly typed product with defaults
        const typedProduct = {
          ...newProduct,
          unit_price: newProduct.unit_price ?? 0,
          selling_price: newProduct.selling_price ?? 0,
          has_recipe: newProduct.has_recipe ?? false,
          has_consumables: newProduct.has_consumables ?? false,
          auto_generate_sku: newProduct.auto_generate_sku ?? false,
          warning_flags: newProduct.warning_flags ?? null
        } as BusinessProduct;

        // Then, if there are sizes, add them
        if (productData.sizes && productData.sizes.length > 0 && newProduct) {
          console.log("Adding product sizes...");
          const sizesToInsert = productData.sizes.map(size => ({
            product_id: newProduct.id,
            size_name: size.size_name,
            price: Number(size.price)
          }));

          const { error: sizesError } = await supabase
            .from('business_product_sizes')
            .insert(sizesToInsert);

          if (sizesError) {
            console.error('Error creating product sizes:', sizesError);
            throw new Error(`Failed to create product sizes: ${sizesError.message}`);
          }
          console.log("Product sizes added successfully");
        }

        // If there's a recipe, add the recipe items
        if (productData.has_recipe && productData.recipe_items && productData.recipe_items.length > 0 && newProduct) {
          console.log("Adding recipe items...");
          const recipeItems = productData.recipe_items.map(item => ({
            product_id: newProduct.id,
            ingredient_id: item.ingredient_id,
            quantity: Number(item.quantity),
            unit_id: item.unit_id,
            cost: Number(item.cost)
          }));
          
          // Insert recipe items
          await insertProductRecipes(accessToken, recipeItems);
        }

        // If there are consumables, add them
        if (productData.has_consumables && productData.consumable_items && productData.consumable_items.length > 0 && newProduct) {
          console.log("Adding consumable items...");
          const consumableItems = productData.consumable_items.map(item => ({
            product_id: newProduct.id,
            consumable_id: item.consumable_id,
            quantity: Number(item.quantity),
            unit_id: item.unit_id,
            cost: Number(item.cost)
          }));
          
          // Insert consumables
          await insertProductConsumables(accessToken, consumableItems);
        }
        
        // Re-enable RLS
        if (accessToken) {
          await enableRLS(accessToken);
        }
        
        return typedProduct;
      } catch (error) {
        console.error('Error in createProduct mutation:', error);
        
        // Attempt to re-enable RLS even in case of error
        if (accessToken) {
          await enableRLS(accessToken);
        }
        
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-products', businessId] });
      toast.success('Product created successfully');
    },
    onError: (error) => {
      console.error('Failed to create product:', error);
      toast.error('Failed to create product: ' + (error as Error).message);
    }
  });
}
