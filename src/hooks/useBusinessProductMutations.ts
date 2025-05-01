
import { useBusinessAuth } from '@/context/BusinessAuthContext';
import { useCreateProduct } from './business-product/useCreateProduct';
import { useUpdateProduct } from './business-product/useUpdateProduct';
import { useDeleteProduct } from './business-product/useDeleteProduct';

export function useBusinessProductMutations() {
  const { business, businessUser } = useBusinessAuth();
  
  // Ensure businessId is defined before creating hooks
  const businessId = business?.id;
  const businessUserId = businessUser?.id;
  
  const createProduct = useCreateProduct(businessId, businessUserId);
  const updateProduct = useUpdateProduct(businessId);
  const deleteProduct = useDeleteProduct(businessId);

  return {
    createProduct,
    updateProduct,
    deleteProduct
  };
}
