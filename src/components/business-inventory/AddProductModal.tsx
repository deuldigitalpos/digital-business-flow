
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useBusinessProductMutations from "@/hooks/useBusinessProductMutations";
import ProductForm from "@/components/business-inventory/ProductForm";
import { ProductFormValues, productFormSchema } from "./product-form/types";
import { Form } from "@/components/ui/form";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose }) => {
  const { createProduct } = useBusinessProductMutations();
  
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      description: "",
      sku: "",
      cost_price: 0,
      selling_price: 0,
      has_ingredients: false,
      has_consumables: false,
      has_sizes: false,
      is_active: true,
      auto_generate_sku: true,
      sizes: [],
      ingredients: [],
      consumables: []
    },
  });

  const handleSubmit = async (values: ProductFormValues) => {
    try {
      await createProduct.mutateAsync({
        product: values,
        ingredients: values.ingredients || [], 
        consumables: values.consumables || [],
        sizes: values.sizes || [],
      });
      
      onClose();
      form.reset();
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <ProductForm 
              form={form}
              onSubmit={handleSubmit}
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductModal;
