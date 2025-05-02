
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useBusinessAuth } from '@/context/BusinessAuthContext';
import { toast } from 'sonner';
import { ProductConsumableInput, ProductFormValues, ProductIngredientInput, ProductSizeInput } from '@/types/business-product';

export const useBusinessProductMutations = () => {
  const { businessUser } = useBusinessAuth();
  const queryClient = useQueryClient();

  const createProduct = useMutation({
    mutationFn: async ({
      product,
      ingredients,
      consumables,
      sizes
    }: {
      product: ProductFormValues;
      ingredients?: ProductIngredientInput[];
      consumables?: ProductConsumableInput[];
      sizes?: ProductSizeInput[];
    }) => {
      if (!businessUser?.business_id) {
        throw new Error('Business ID is missing');
      }

      // Step 1: Create the product
      const { data: createdProduct, error: productError } = await supabase
        .from('business_products')
        .insert([
          {
            ...product,
            business_id: businessUser.business_id,
            has_ingredients: !!ingredients?.length,
            has_consumables: !!consumables?.length,
            has_sizes: !!sizes?.length
          }
        ])
        .select('*')
        .single();

      if (productError) {
        console.error('Error creating product:', productError);
        throw new Error(productError.message);
      }

      if (!createdProduct) {
        throw new Error('Failed to create product');
      }

      // Step 2: Add ingredients if any
      if (ingredients && ingredients.length > 0) {
        const recipesData = ingredients.map(item => ({
          product_id: createdProduct.id,
          ingredient_id: item.ingredient_id,
          quantity: item.quantity,
          unit_id: item.unit_id,
          cost: item.cost
        }));

        try {
          await supabase.rpc('insert_product_recipes', { items: recipesData });
        } catch (error) {
          console.error('Error adding ingredients:', error);
          throw new Error('Failed to add ingredients');
        }
      }

      // Step 3: Add consumables if any
      if (consumables && consumables.length > 0) {
        const consumablesData = consumables.map(item => ({
          product_id: createdProduct.id,
          consumable_id: item.consumable_id,
          quantity: item.quantity,
          unit_id: item.unit_id,
          cost: item.cost
        }));

        try {
          await supabase.rpc('insert_product_consumables', { items: consumablesData });
        } catch (error) {
          console.error('Error adding consumables:', error);
          throw new Error('Failed to add consumables');
        }
      }

      // Step 4: Add sizes if any
      if (sizes && sizes.length > 0) {
        const sizesData = sizes.map(size => ({
          product_id: createdProduct.id,
          name: size.name,
          additional_price: size.additional_price
        }));

        const { error: sizesError } = await supabase
          .from('business_product_sizes')
          .insert(sizesData);

        if (sizesError) {
          console.error('Error adding sizes:', sizesError);
          throw new Error('Failed to add sizes');
        }
      }

      return createdProduct;
    },
    onSuccess: () => {
      toast.success('Product created successfully');
      queryClient.invalidateQueries({ queryKey: ['business-products'] });
    },
    onError: (error) => {
      toast.error(`Failed to create product: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });

  const updateProduct = useMutation({
    mutationFn: async ({
      id,
      product,
      ingredients,
      consumables,
      sizes
    }: {
      id: string;
      product: Partial<ProductFormValues>;
      ingredients?: ProductIngredientInput[];
      consumables?: ProductConsumableInput[];
      sizes?: ProductSizeInput[];
    }) => {
      if (!businessUser?.business_id) {
        throw new Error('Business ID is missing');
      }

      // Step 1: Update the product
      const updateData = {
        ...product,
        has_ingredients: ingredients !== undefined ? !!ingredients.length : undefined,
        has_consumables: consumables !== undefined ? !!consumables.length : undefined,
        has_sizes: sizes !== undefined ? !!sizes.length : undefined
      };

      const { data: updatedProduct, error: productError } = await supabase
        .from('business_products')
        .update(updateData)
        .eq('id', id)
        .eq('business_id', businessUser.business_id)
        .select('*')
        .single();

      if (productError) {
        console.error('Error updating product:', productError);
        throw new Error(productError.message);
      }

      // Step 2: Update ingredients if provided
      if (ingredients !== undefined) {
        try {
          // Delete existing ingredients
          await supabase.rpc('delete_product_recipes', { product_id_param: id });
          
          // Add new ingredients
          if (ingredients.length > 0) {
            const recipesData = ingredients.map(item => ({
              product_id: id,
              ingredient_id: item.ingredient_id,
              quantity: item.quantity,
              unit_id: item.unit_id,
              cost: item.cost
            }));

            await supabase.rpc('insert_product_recipes', { items: recipesData });
          }
        } catch (error) {
          console.error('Error updating ingredients:', error);
          throw new Error('Failed to update ingredients');
        }
      }

      // Step 3: Update consumables if provided
      if (consumables !== undefined) {
        try {
          // Delete existing consumables
          await supabase.rpc('delete_product_consumables', { product_id_param: id });
          
          // Add new consumables
          if (consumables.length > 0) {
            const consumablesData = consumables.map(item => ({
              product_id: id,
              consumable_id: item.consumable_id,
              quantity: item.quantity,
              unit_id: item.unit_id,
              cost: item.cost
            }));

            await supabase.rpc('insert_product_consumables', { items: consumablesData });
          }
        } catch (error) {
          console.error('Error updating consumables:', error);
          throw new Error('Failed to update consumables');
        }
      }

      // Step 4: Update sizes if provided
      if (sizes !== undefined) {
        try {
          // Delete existing sizes
          const { error: deleteSizesError } = await supabase
            .from('business_product_sizes')
            .delete()
            .eq('product_id', id);

          if (deleteSizesError) {
            throw deleteSizesError;
          }
          
          // Add new sizes
          if (sizes.length > 0) {
            const sizesData = sizes.map(size => ({
              product_id: id,
              name: size.name,
              additional_price: size.additional_price
            }));

            const { error: insertSizesError } = await supabase
              .from('business_product_sizes')
              .insert(sizesData);

            if (insertSizesError) {
              throw insertSizesError;
            }
          }
        } catch (error) {
          console.error('Error updating sizes:', error);
          throw new Error('Failed to update sizes');
        }
      }

      return updatedProduct;
    },
    onSuccess: () => {
      toast.success('Product updated successfully');
      queryClient.invalidateQueries({ queryKey: ['business-products'] });
    },
    onError: (error) => {
      toast.error(`Failed to update product: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });

  const deleteProduct = useMutation({
    mutationFn: async (id: string) => {
      // First delete related data
      try {
        // Delete ingredients
        await supabase.rpc('delete_product_recipes', { product_id_param: id });
        
        // Delete consumables
        await supabase.rpc('delete_product_consumables', { product_id_param: id });
        
        // Delete sizes
        await supabase
          .from('business_product_sizes')
          .delete()
          .eq('product_id', id);
      } catch (error) {
        console.error('Error deleting product relationships:', error);
      }

      // Then delete the product
      const { error } = await supabase
        .from('business_products')
        .delete()
        .eq('id', id)
        .eq('business_id', businessUser?.business_id);

      if (error) {
        console.error('Error deleting product:', error);
        throw new Error(error.message);
      }

      return id;
    },
    onSuccess: () => {
      toast.success('Product deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['business-products'] });
    },
    onError: (error) => {
      toast.error(`Failed to delete product: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });

  return {
    createProduct,
    updateProduct,
    deleteProduct
  };
};

export default useBusinessProductMutations;
