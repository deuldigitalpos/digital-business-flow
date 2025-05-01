import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BusinessProduct, ProductFormValues } from '@/types/business-product';
import { useBusinessAuth } from '@/context/BusinessAuthContext';
import { toast } from 'sonner';

export function useBusinessProductMutations() {
  const queryClient = useQueryClient();
  const { business } = useBusinessAuth();

  const createProduct = useMutation({
    mutationFn: async (productData: ProductFormValues) => {
      if (!business?.id) {
        throw new Error('Business ID is required');
      }

      // Process optional IDs, converting "none" to null
      const category_id = productData.category_id === "none" ? null : productData.category_id;
      const brand_id = productData.brand_id === "none" ? null : productData.brand_id;
      const warranty_id = productData.warranty_id === "none" ? null : productData.warranty_id;
      const location_id = productData.location_id === "none" ? null : productData.location_id;
      const unit_id = productData.unit_id === "none" ? null : productData.unit_id;

      // CRITICAL FIX: Ensure alert_quantity is a number, not a string
      const alert_quantity = productData.alert_quantity ? Number(productData.alert_quantity) : 10;
      
      try {
        // First, disable RLS to perform the operation
        await supabase.rpc('disable_rls');

        // Create the product
        const { data: newProduct, error: productError } = await supabase
          .from('business_products')
          .insert({
            business_id: business.id,
            name: productData.name,
            sku: productData.sku,
            auto_generate_sku: productData.auto_generate_sku || false,
            description: productData.description,
            category_id: category_id,
            brand_id: brand_id,
            warranty_id: warranty_id,
            location_id: location_id,
            unit_id: unit_id,
            image_url: productData.image_url,
            alert_quantity: alert_quantity, // Use the numeric version
            unit_price: productData.unit_price || 0,
            selling_price: productData.selling_price || 0,
            has_recipe: productData.has_recipe || false,
            has_consumables: productData.has_consumables || false,
            quantity_available: 0, // Initial stock is 0
            quantity_sold: 0
          })
          .select()
          .single();

        if (productError) {
          console.error('Error creating product:', productError);
          throw productError;
        }

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
          const sizesToInsert = productData.sizes.map(size => ({
            product_id: newProduct.id,
            size_name: size.size_name,
            price: size.price
          }));

          const { error: sizesError } = await supabase
            .from('business_product_sizes')
            .insert(sizesToInsert);

          if (sizesError) {
            console.error('Error creating product sizes:', sizesError);
            throw sizesError;
          }
        }

        // If there's a recipe, add the recipe items
        if (productData.has_recipe && productData.recipe_items && productData.recipe_items.length > 0 && newProduct) {
          const recipeItems = productData.recipe_items.map(item => ({
            product_id: newProduct.id,
            ingredient_id: item.ingredient_id,
            quantity: item.quantity,
            unit_id: item.unit_id,
            cost: item.cost
          }));
          
          // Using fetch API directly to insert recipe items
          const recipeResponse = await fetch(
            `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/business_product_recipes`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
                'Prefer': 'return=minimal'
              },
              body: JSON.stringify(recipeItems)
            }
          );
          
          if (!recipeResponse.ok) {
            const error = new Error(`Failed to insert recipe items: ${recipeResponse.statusText}`);
            console.error('Error creating product recipe items:', error);
            throw error;
          }
        }

        // If there are consumables, add them
        if (productData.has_consumables && productData.consumable_items && productData.consumable_items.length > 0 && newProduct) {
          const consumableItems = productData.consumable_items.map(item => ({
            product_id: newProduct.id,
            consumable_id: item.consumable_id,
            quantity: item.quantity,
            unit_id: item.unit_id,
            cost: item.cost
          }));
          
          // Using fetch API directly to insert consumable items
          const consumablesResponse = await fetch(
            `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/business_product_consumables`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
                'Prefer': 'return=minimal'
              },
              body: JSON.stringify(consumableItems)
            }
          );
          
          if (!consumablesResponse.ok) {
            const error = new Error(`Failed to insert consumable items: ${consumablesResponse.statusText}`);
            console.error('Error creating product consumables:', error);
            throw error;
          }
        }
        
        return typedProduct;
      } finally {
        // Always re-enable RLS when done, even if there was an error
        await supabase.rpc('enable_rls');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-products', business?.id] });
      toast.success('Product created successfully');
    },
    onError: (error) => {
      console.error('Failed to create product:', error);
      toast.error('Failed to create product: ' + (error as Error).message);
    }
  });

  const updateProduct = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ProductFormValues }) => {
      // Process optional IDs, converting "none" to null
      const category_id = data.category_id === "none" ? null : data.category_id;
      const brand_id = data.brand_id === "none" ? null : data.brand_id;
      const warranty_id = data.warranty_id === "none" ? null : data.warranty_id;
      const location_id = data.location_id === "none" ? null : data.location_id;
      const unit_id = data.unit_id === "none" ? null : data.unit_id;
      
      // CRITICAL FIX: Ensure alert_quantity is a number, not a string
      const alert_quantity = data.alert_quantity ? Number(data.alert_quantity) : 10;

      // First, update the product
      const { data: updatedProduct, error: productError } = await supabase
        .from('business_products')
        .update({
          name: data.name,
          sku: data.sku,
          auto_generate_sku: data.auto_generate_sku || false,
          description: data.description,
          category_id: category_id,
          brand_id: brand_id,
          warranty_id: warranty_id,
          location_id: location_id,
          unit_id: unit_id,
          image_url: data.image_url,
          alert_quantity: alert_quantity, // Use the numeric version
          unit_price: data.unit_price || 0,
          selling_price: data.selling_price || 0,
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
          price: size.price
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
        // Disable RLS for the operation
        await supabase.rpc('disable_rls');
        
        // Delete existing recipe items using fetch API
        const deleteRecipeResponse = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/business_product_recipes?product_id=eq.${id}`,
          {
            method: 'DELETE',
            headers: {
              'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
              'Prefer': 'return=minimal'
            }
          }
        );

        if (!deleteRecipeResponse.ok) {
          const deleteRecipeError = new Error(`Failed to delete recipe items: ${deleteRecipeResponse.statusText}`);
          console.error('Error deleting product recipe items:', deleteRecipeError);
          
          // Re-enable RLS before throwing error
          await supabase.rpc('enable_rls');
          throw deleteRecipeError;
        }

        // Insert new recipe items if any
        if (data.recipe_items.length > 0) {
          const recipeItems = data.recipe_items.map(item => ({
            product_id: id,
            ingredient_id: item.ingredient_id,
            quantity: item.quantity,
            unit_id: item.unit_id,
            cost: item.cost
          }));

          const insertRecipeResponse = await fetch(
            `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/business_product_recipes`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
                'Prefer': 'return=minimal'
              },
              body: JSON.stringify(recipeItems)
            }
          );
          
          // Re-enable RLS
          await supabase.rpc('enable_rls');

          if (!insertRecipeResponse.ok) {
            const insertRecipeError = new Error(`Failed to insert recipe items: ${insertRecipeResponse.statusText}`);
            console.error('Error inserting product recipe items:', insertRecipeError);
            throw insertRecipeError;
          }
        } else {
          // Re-enable RLS if no items to insert
          await supabase.rpc('enable_rls');
        }
      } else {
        // If product no longer has a recipe, delete any existing recipe items
        await supabase.rpc('disable_rls');
        
        const deleteRecipeResponse = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/business_product_recipes?product_id=eq.${id}`,
          {
            method: 'DELETE',
            headers: {
              'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
              'Prefer': 'return=minimal'
            }
          }
        );
        
        await supabase.rpc('enable_rls');

        if (!deleteRecipeResponse.ok) {
          console.error('Error deleting product recipe items:', deleteRecipeResponse.statusText);
          // Non-fatal, continue execution
        }
      }

      // Handle consumable items if this product has consumables
      if (data.has_consumables && data.consumable_items) {
        // Disable RLS for the operation
        await supabase.rpc('disable_rls');
        
        // Delete existing consumable items using fetch API
        const deleteConsumablesResponse = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/business_product_consumables?product_id=eq.${id}`,
          {
            method: 'DELETE',
            headers: {
              'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
              'Prefer': 'return=minimal'
            }
          }
        );

        if (!deleteConsumablesResponse.ok) {
          const deleteConsumablesError = new Error(`Failed to delete consumable items: ${deleteConsumablesResponse.statusText}`);
          console.error('Error deleting product consumable items:', deleteConsumablesError);
          
          // Re-enable RLS before throwing error
          await supabase.rpc('enable_rls');
          throw deleteConsumablesError;
        }

        // Insert new consumable items if any
        if (data.consumable_items.length > 0) {
          const consumableItems = data.consumable_items.map(item => ({
            product_id: id,
            consumable_id: item.consumable_id,
            quantity: item.quantity,
            unit_id: item.unit_id,
            cost: item.cost
          }));

          const insertConsumablesResponse = await fetch(
            `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/business_product_consumables`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
                'Prefer': 'return=minimal'
              },
              body: JSON.stringify(consumableItems)
            }
          );
          
          // Re-enable RLS
          await supabase.rpc('enable_rls');

          if (!insertConsumablesResponse.ok) {
            const insertConsumablesError = new Error(`Failed to insert consumable items: ${insertConsumablesResponse.statusText}`);
            console.error('Error inserting product consumable items:', insertConsumablesError);
            throw insertConsumablesError;
          }
        } else {
          // Re-enable RLS if no items to insert
          await supabase.rpc('enable_rls');
        }
      } else {
        // If product no longer has consumables, delete any existing consumable items
        await supabase.rpc('disable_rls');
        
        const deleteConsumablesResponse = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/business_product_consumables?product_id=eq.${id}`,
          {
            method: 'DELETE',
            headers: {
              'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
              'Prefer': 'return=minimal'
            }
          }
        );
        
        await supabase.rpc('enable_rls');

        if (!deleteConsumablesResponse.ok) {
          console.error('Error deleting product consumable items:', deleteConsumablesResponse.statusText);
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
      queryClient.invalidateQueries({ queryKey: ['business-products', business?.id] });
      queryClient.invalidateQueries({ queryKey: ['business-product', variables.id] });
      toast.success('Product updated successfully');
    },
    onError: (error) => {
      console.error('Failed to update product:', error);
      toast.error('Failed to update product');
    }
  });

  const deleteProduct = useMutation({
    mutationFn: async (id: string) => {
      // Delete will cascade to product sizes, recipes, and modifiers due to foreign key constraints
      const { error } = await supabase
        .from('business_products')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting product:', error);
        throw error;
      }

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-products', business?.id] });
      toast.success('Product deleted successfully');
    },
    onError: (error) => {
      console.error('Failed to delete product:', error);
      toast.error('Failed to delete product');
    }
  });

  return {
    createProduct,
    updateProduct,
    deleteProduct
  };
}
