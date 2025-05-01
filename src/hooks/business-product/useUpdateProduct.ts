
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BusinessProduct, ProductFormValues } from '@/types/business-product';
import { toast } from 'sonner';
import { 
  deleteProductRecipes, 
  insertProductRecipes, 
  deleteProductConsumables, 
  insertProductConsumables 
} from './productMutationUtils';

export function useUpdateProduct(businessId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ProductFormValues }) => {
      // Process optional IDs, converting "none" to null
      const category_id = data.category_id === "none" ? null : data.category_id;
      const brand_id = data.brand_id === "none" ? null : data.brand_id;
      const warranty_id = data.warranty_id === "none" ? null : data.warranty_id;
      const location_id = data.location_id === "none" ? null : data.location_id;
      const unit_id = data.unit_id === "none" ? null : data.unit_id;
      
      // CRITICAL FIX: Ensure alert_quantity is properly converted to a number
      const alert_quantity = Number(data.alert_quantity || 10);
      
      // Get auth session for API calls
      const session = await supabase.auth.getSession();
      const accessToken = session.data.session?.access_token;
      
      if (!accessToken) {
        throw new Error('No valid access token found');
      }

      // First, update the product with explicit number conversion for alert_quantity
      const { data: updatedProduct, error: productError } = await supabase
        .from('business_products')
        .update({
          name: data.name,
          sku: data.sku || null,
          auto_generate_sku: data.auto_generate_sku || false,
          description: data.description || null,
          category_id: category_id,
          brand_id: brand_id,
          warranty_id: warranty_id,
          location_id: location_id,
          unit_id: unit_id,
          image_url: data.image_url || null,
          alert_quantity: alert_quantity, // Ensure this is a number
          unit_price: Number(data.unit_price || 0),
          selling_price: Number(data.selling_price || 0),
          has_recipe: data.has_recipe || false,
          has_consumables: data.has_consumables || false
        })
        .eq('id', id)
        .select()
        .single();

      if (productError) {
        console.error('Error updating product:', productError);
        throw productError;
      }

      // Handle product sizes update if provided
      if (data.sizes && data.sizes.length > 0) {
        // First, delete existing sizes
        const { error: deleteSizesError } = await supabase
          .from('business_product_sizes')
          .delete()
          .eq('product_id', id);

        if (deleteSizesError) {
          console.error('Error deleting product sizes:', deleteSizesError);
          throw deleteSizesError;
        }

        // Then, insert the new sizes
        const sizesToInsert = data.sizes.map(size => ({
          product_id: id,
          size_name: size.size_name,
          price: Number(size.price)
        }));

        const { error: insertSizesError } = await supabase
          .from('business_product_sizes')
          .insert(sizesToInsert);

        if (insertSizesError) {
          console.error('Error inserting product sizes:', insertSizesError);
          throw insertSizesError;
        }
      }

      // Handle recipe items if this product has a recipe
      if (data.has_recipe && data.recipe_items) {
        try {
          // Delete existing recipe items
          await deleteProductRecipes(accessToken, id);
          
          // Insert new recipe items if any
          if (data.recipe_items.length > 0) {
            const recipeItems = data.recipe_items.map(item => ({
              product_id: id,
              ingredient_id: item.ingredient_id,
              quantity: Number(item.quantity),
              unit_id: item.unit_id,
              cost: Number(item.cost)
            }));
            
            await insertProductRecipes(accessToken, recipeItems);
          }
        } catch (error) {
          console.error('Error handling recipe items:', error);
          throw error;
        }
      } else {
        // If product no longer has a recipe, delete any existing recipe items
        try {
          await deleteProductRecipes(accessToken, id);
        } catch (error) {
          console.error('Error deleting product recipe items:', error);
          // Non-fatal, continue execution
        }
      }

      // Handle consumable items if this product has consumables
      if (data.has_consumables && data.consumable_items) {
        try {
          // Delete existing consumable items
          await deleteProductConsumables(accessToken, id);
          
          // Insert new consumable items if any
          if (data.consumable_items.length > 0) {
            const consumableItems = data.consumable_items.map(item => ({
              product_id: id,
              consumable_id: item.consumable_id,
              quantity: Number(item.quantity),
              unit_id: item.unit_id,
              cost: Number(item.cost)
            }));
            
            await insertProductConsumables(accessToken, consumableItems);
          }
        } catch (error) {
          console.error('Error handling consumable items:', error);
          throw error;
        }
      } else {
        // If product no longer has consumables, delete any existing consumable items
        try {
          await deleteProductConsumables(accessToken, id);
        } catch (error) {
          console.error('Error deleting product consumable items:', error);
          // Non-fatal, continue execution
        }
      }

      // Create a properly typed product with defaults
      const typedProduct = {
        ...updatedProduct,
        unit_price: updatedProduct.unit_price ?? 0,
        selling_price: updatedProduct.selling_price ?? 0,
        has_recipe: updatedProduct.has_recipe ?? false,
        has_consumables: updatedProduct.has_consumables ?? false,
        auto_generate_sku: updatedProduct.auto_generate_sku ?? false,
        warning_flags: updatedProduct.warning_flags ?? null
      } as BusinessProduct;

      return typedProduct;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['business-products', businessId] });
      queryClient.invalidateQueries({ queryKey: ['business-product', variables.id] });
      toast.success('Product updated successfully');
    },
    onError: (error) => {
      console.error('Failed to update product:', error);
      toast.error('Failed to update product: ' + (error as Error).message);
    }
  });
}
