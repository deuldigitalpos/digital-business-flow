
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BusinessProduct, ProductFormValues, BusinessProductSize } from '@/types/business-product';
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

      // First, create the product
      const { data: newProduct, error: productError } = await supabase
        .from('business_products')
        .insert({
          business_id: business.id,
          name: productData.name,
          sku: productData.sku,
          description: productData.description,
          category_id: productData.category_id,
          brand_id: productData.brand_id,
          warranty_id: productData.warranty_id,
          location_id: productData.location_id,
          image_url: productData.image_url,
          expiration_date: expiration_date,
          alert_quantity: productData.alert_quantity || 10,
          is_raw_ingredient: productData.is_raw_ingredient || false,
          is_consumable: productData.is_consumable || false,
          ingredient_id: productData.ingredient_id,
          consumable_id: productData.consumable_id,
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

      // First, update the product
      const { data: updatedProduct, error: productError } = await supabase
        .from('business_products')
        .update({
          name: data.name,
          sku: data.sku,
          description: data.description,
          category_id: data.category_id,
          brand_id: data.brand_id,
          warranty_id: data.warranty_id,
          location_id: data.location_id,
          image_url: data.image_url,
          expiration_date: expiration_date,
          alert_quantity: data.alert_quantity,
          is_raw_ingredient: data.is_raw_ingredient,
          is_consumable: data.is_consumable,
          ingredient_id: data.ingredient_id,
          consumable_id: data.consumable_id
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
      // Delete will cascade to product sizes due to the foreign key constraint
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
