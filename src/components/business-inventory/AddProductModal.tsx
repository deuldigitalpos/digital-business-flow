
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ProductFormValues } from "@/types/business-product";
import useBusinessProductMutations from "@/hooks/useBusinessProductMutations";
import ProductForm from "@/components/business-inventory/ProductForm";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const formSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().optional(),
  sku: z.string().optional(),
  category_id: z.string().optional(),
  unit_id: z.string().min(1, "Unit is required"),
  brand_id: z.string().optional(),
  warranty_id: z.string().optional(),
  image_url: z.string().optional(),
  cost_price: z.coerce.number().min(0, "Cost price must be positive"),
  selling_price: z.coerce.number().min(0, "Selling price must be positive"),
  has_ingredients: z.boolean().default(false),
  has_consumables: z.boolean().default(false),
  has_sizes: z.boolean().default(false),
  auto_generate_sku: z.boolean().default(true),
  is_active: z.boolean().default(true),
});

const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose }) => {
  const { createProduct } = useBusinessProductMutations();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
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
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await createProduct.mutateAsync({
        product: values as ProductFormValues,
        ingredients: [], 
        consumables: [],
        sizes: [],
      });
      
      onClose();
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
        
        <ProductForm 
          form={form}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddProductModal;
