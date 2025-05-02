
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { BusinessProduct } from "@/types/business-product";
import useBusinessProductMutations from "@/hooks/useBusinessProductMutations";
import ProductForm from "@/components/business-inventory/ProductForm";
import { ProductFormValues } from "./product-form/types";
import useProductIngredients from "@/hooks/useProductIngredients";
import useProductConsumables from "@/hooks/useProductConsumables";
import useProductSizes from "@/hooks/useProductSizes";
import { useEffect } from "react";
import { Form } from "@/components/ui/form";

interface EditProductModalProps {
  product: BusinessProduct;
  isOpen: boolean;
  onClose: () => void;
}

const formSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().optional(),
  sku: z.string().optional(),
  category_id: z.string().optional(),
  image_url: z.string().optional(),
  cost_price: z.coerce.number().min(0, "Cost price must be positive"),
  selling_price: z.coerce.number().min(0, "Selling price must be positive"),
  has_ingredients: z.boolean().default(false),
  has_consumables: z.boolean().default(false),
  has_sizes: z.boolean().default(false),
  auto_generate_sku: z.boolean().default(true),
  is_active: z.boolean().default(true),
  sizes: z.array(z.object({
    name: z.string(),
    additional_price: z.number(),
  })).optional().default([]),
  ingredients: z.array(z.object({
    ingredient_id: z.string(),
    quantity: z.number(),
    cost: z.number(),
  })).optional().default([]),
  consumables: z.array(z.object({
    consumable_id: z.string(),
    quantity: z.number(),
    cost: z.number(),
  })).optional().default([])
});

const EditProductModal: React.FC<EditProductModalProps> = ({ product, isOpen, onClose }) => {
  const { updateProduct } = useBusinessProductMutations();
  const { ingredients } = useProductIngredients(product.id);
  const { consumables } = useProductConsumables(product.id);
  const { sizes } = useProductSizes(product.id);
  
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product.name,
      description: product.description || "",
      sku: product.sku || "",
      category_id: product.category_id || undefined,
      image_url: product.image_url || "",
      cost_price: product.cost_price,
      selling_price: product.selling_price,
      has_ingredients: product.has_ingredients,
      has_consumables: product.has_consumables,
      has_sizes: product.has_sizes,
      auto_generate_sku: product.auto_generate_sku,
      is_active: true,
      sizes: [],
      ingredients: [],
      consumables: []
    },
  });

  // Load related data when available
  useEffect(() => {
    if (sizes && sizes.length > 0) {
      form.setValue('sizes', sizes.map(size => ({
        name: size.name,
        additional_price: size.additional_price
      })));
    }
    
    if (ingredients && ingredients.length > 0) {
      form.setValue('ingredients', ingredients.map(ing => ({
        ingredient_id: ing.ingredient_id,
        quantity: ing.quantity,
        cost: ing.cost
      })));
    }
    
    if (consumables && consumables.length > 0) {
      form.setValue('consumables', consumables.map(cons => ({
        consumable_id: cons.consumable_id,
        quantity: cons.quantity,
        cost: cons.cost
      })));
    }
  }, [sizes, ingredients, consumables, form]);

  const handleSubmit = async (values: ProductFormValues) => {
    try {
      await updateProduct.mutateAsync({
        id: product.id,
        product: values,
        ingredients: values.ingredients,
        consumables: values.consumables,
        sizes: values.sizes,
      });
      
      onClose();
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Product: {product.name}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <ProductForm 
              form={form}
              onSubmit={handleSubmit}
              isEditMode={true}
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProductModal;
