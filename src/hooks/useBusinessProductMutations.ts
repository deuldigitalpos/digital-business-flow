
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BusinessProduct, ProductFormValues, BusinessProductSize, RecipeItem, ModifierItem } from '@/types/business-product';
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

      // Ensure expiration_date is converted to string if it's a Date object
      const expiration_date = productData.expiration_date instanceof Date 
        ? productData.expiration_date.toISOString() 
        : productData.expiration_date;

      // Process optional IDs, converting "none" to null
      const category_id = productData.category_id === "none" ? null : productData.category_id;
      const brand_id = productData.brand_id === "none" ? null : productData.brand_id;
      const warranty_id = productData.warranty_id === "none" ? null : productData.warranty_id;
      const location_id = productData.location_id === "none" ? null : productData.location_id;
      const ingredient_id = productData.ingredient_id === "none" ? null : productData.ingredient_id;
      const consumable_id = productData.consumable_id === "none" ? null : productData.consumable_id;

      // First, create the product
      const { data: newProduct, error: productError } = await supabase
        .from('business_products')
        .insert({
          business_id: business.id,
          name: productData.name,
          sku: productData.sku,
          description: productData.description,
          category_id: category_id,
          brand_id: brand_id,
          warranty_id: warranty_id,
          location_id: location_id,
          image_url: productData.image_url,
          expiration_date: expiration_date,
          alert_quantity: productData.alert_quantity || 10,
          is_raw_ingredient: productData.is_raw_ingredient || false,
          is_consumable: productData.is_consumable || false,
          ingredient_id: ingredient_id,
          consumable_id: consumable_id,
          unit_price: productData.unit_price || 0,
          selling_price: productData.selling_price || 0,
          has_recipe: productData.has_recipe || false,
          has_modifiers: productData.has_modifiers || false,
          quantity_available: 0, // Initial stock is 0
          quantity_sold: 0
        })
        .select()
        .single();

      if (productError) {
        console.error('Error creating product:', productError);
        throw productError;
      }

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

        // Disable RLS to perform the operation
        await supabase.rpc('disable_rls');
        
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

        // Re-enable RLS
        await supabase.rpc('enable_rls');
        
        if (!recipeResponse.ok) {
          const error = new Error(`Failed to insert recipe items: ${recipeResponse.statusText}`);
          console.error('Error creating product recipe items:', error);
          throw error;
        }
      }

      // If there are modifiers, add them
      if (productData.has_modifiers && productData.modifier_items && productData.modifier_items.length > 0 && newProduct) {
        const modifierItems = productData.modifier_items.map(item => ({
          product_id: newProduct.id,
          name: item.name,
          size_regular_price: item.size_regular_price,
          size_medium_price: item.size_medium_price,
          size_large_price: item.size_large_price,
          size_xl_price: item.size_xl_price
        }));

        // Disable RLS for the operation
        await supabase.rpc('disable_rls');
        
        // Using fetch API directly to insert modifier items
        const modifiersResponse = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/business_product_modifiers`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
              'Prefer': 'return=minimal'
            },
            body: JSON.stringify(modifierItems)
          }
        );

        // Re-enable RLS
        await supabase.rpc('enable_rls');
        
        if (!modifiersResponse.ok) {
          const error = new Error(`Failed to insert modifier items: ${modifiersResponse.statusText}`);
          console.error('Error creating product modifiers:', error);
          throw error;
        }
      }

      return newProduct;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-products', business?.id] });
      toast.success('Product created successfully');
    },
    onError: (error) => {
      console.error('Failed to create product:', error);
      toast.error('Failed to create product');
    }
  });

  const updateProduct = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ProductFormValues }) => {
      // Ensure expiration_date is converted to string if it's a Date object
      const expiration_date = data.expiration_date instanceof Date 
        ? data.expiration_date.toISOString() 
        : data.expiration_date;

      // Process optional IDs, converting "none" to null
      const category_id = data.category_id === "none" ? null : data.category_id;
      const brand_id = data.brand_id === "none" ? null : data.brand_id;
      const warranty_id = data.warranty_id === "none" ? null : data.warranty_id;
      const location_id = data.location_id === "none" ? null : data.location_id;
      const ingredient_id = data.ingredient_id === "none" ? null : data.ingredient_id;
      const consumable_id = data.consumable_id === "none" ? null : data.consumable_id;

      // First, update the product
      const { data: updatedProduct, error: productError } = await supabase
        .from('business_products')
        .update({
          name: data.name,
          sku: data.sku,
          description: data.description,
          category_id: category_id,
          brand_id: brand_id,
          warranty_id: warranty_id,
          location_id: location_id,
          image_url: data.image_url,
          expiration_date: expiration_date,
          alert_quantity: data.alert_quantity,
          is_raw_ingredient: data.is_raw_ingredient,
          is_consumable: data.is_consumable,
          ingredient_id: ingredient_id,
          consumable_id: consumable_id,
          unit_price: data.unit_price || 0,
          selling_price: data.selling_price || 0,
          has_recipe: data.has_recipe || false,
          has_modifiers: data.has_modifiers || false
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

      // Handle modifiers if this product has modifiers
      if (data.has_modifiers && data.modifier_items) {
        // Disable RLS for the operation
        await supabase.rpc('disable_rls');
        
        // Delete existing modifiers
        const deleteModifiersResponse = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/business_product_modifiers?product_id=eq.${id}`,
          {
            method: 'DELETE',
            headers: {
              'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
              'Prefer': 'return=minimal'
            }
          }
        );

        if (!deleteModifiersResponse.ok) {
          const deleteModifiersError = new Error(`Failed to delete modifiers: ${deleteModifiersResponse.statusText}`);
          console.error('Error deleting product modifiers:', deleteModifiersError);
          
          // Re-enable RLS before throwing error
          await supabase.rpc('enable_rls');
          throw deleteModifiersError;
        }

        // Insert new modifiers if any
        if (data.modifier_items.length > 0) {
          const modifierItems = data.modifier_items.map(item => ({
            product_id: id,
            name: item.name,
            size_regular_price: item.size_regular_price,
            size_medium_price: item.size_medium_price,
            size_large_price: item.size_large_price,
            size_xl_price: item.size_xl_price
          }));

          const insertModifiersResponse = await fetch(
            `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/business_product_modifiers`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
                'Prefer': 'return=minimal'
              },
              body: JSON.stringify(modifierItems)
            }
          );
          
          // Re-enable RLS
          await supabase.rpc('enable_rls');

          if (!insertModifiersResponse.ok) {
            const insertModifiersError = new Error(`Failed to insert modifiers: ${insertModifiersResponse.statusText}`);
            console.error('Error inserting product modifiers:', insertModifiersError);
            throw insertModifiersError;
          }
        } else {
          // Re-enable RLS if no items to insert
          await supabase.rpc('enable_rls');
        }
      } else {
        // If product no longer has modifiers, delete any existing modifiers
        await supabase.rpc('disable_rls');
        
        const deleteModifiersResponse = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/business_product_modifiers?product_id=eq.${id}`,
          {
            method: 'DELETE',
            headers: {
              'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
              'Prefer': 'return=minimal'
            }
          }
        );
        
        await supabase.rpc('enable_rls');

        if (!deleteModifiersResponse.ok) {
          console.error('Error deleting product modifiers:', deleteModifiersResponse.statusText);
          // Non-fatal, continue execution
        }
      }

      return updatedProduct as BusinessProduct;
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
