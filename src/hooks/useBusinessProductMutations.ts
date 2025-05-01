
import { useBusinessAuth } from '@/context/BusinessAuthContext';
import { useCreateProduct } from './business-product/useCreateProduct';
import { useUpdateProduct } from './business-product/useUpdateProduct';
import { useDeleteProduct } from './business-product/useDeleteProduct';

export function useBusinessProductMutations() {
  const { business, businessUser } = useBusinessAuth();
  
  const createProduct = useCreateProduct(business?.id, businessUser?.id);
  const updateProduct = useUpdateProduct(business?.id);
  const deleteProduct = useDeleteProduct(business?.id);

  return {
    createProduct,
    updateProduct,
    deleteProduct
  };
}
