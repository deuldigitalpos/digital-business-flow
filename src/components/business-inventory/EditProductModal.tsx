
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { BusinessProduct, ProductConsumableInput, ProductIngredientInput, ProductSizeInput } from "@/types/business-product";
import useBusinessProductMutations from "@/hooks/useBusinessProductMutations";
import ProductForm from "@/components/business-inventory/ProductForm";
import useProductIngredients from "@/hooks/useProductIngredients";
import useProductConsumables from "@/hooks/useProductConsumables";
import useProductSizes from "@/hooks/useProductSizes";

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
});

const EditProductModal: React.FC<EditProductModalProps> = ({ product, isOpen, onClose }) => {
  const { updateProduct } = useBusinessProductMutations();
  const { ingredients: existingIngredients } = useProductIngredients(product?.id);
  const { consumables: existingConsumables } = useProductConsumables(product?.id);
  const { sizes: existingSizes } = useProductSizes(product?.id);
  
  const [ingredients, setIngredients] = useState<ProductIngredientInput[]>([]);
  const [consumables, setConsumables] = useState<ProductConsumableInput[]>([]);
  const [sizes, setSizes] = useState<ProductSizeInput[]>([]);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product.name,
      description: product.description || "",
      sku: product.sku || "",
      category_id: product.category_id || undefined,
      unit_id: product.unit_id || "",
      brand_id: product.brand_id || undefined,
      warranty_id: product.warranty_id || undefined,
      image_url: product.image_url || "",
      cost_price: product.cost_price,
      selling_price: product.selling_price,
      has_ingredients: product.has_ingredients,
      has_consumables: product.has_consumables,
      has_sizes: product.has_sizes,
      auto_generate_sku: product.auto_generate_sku,
    },
  });

  // Load existing data when the modal opens
  useEffect(() => {
    if (existingIngredients.length > 0) {
      const mappedIngredients = existingIngredients.map(item => ({
        ingredient_id: item.ingredient_id,
        quantity: item.quantity,
        unit_id: item.unit_id || "",
        cost: item.cost,
      }));
      setIngredients(mappedIngredients);
    }
    
    if (existingConsumables.length > 0) {
      const mappedConsumables = existingConsumables.map(item => ({
        consumable_id: item.consumable_id,
        quantity: item.quantity,
        unit_id: item.unit_id || "",
        cost: item.cost,
      }));
      setConsumables(mappedConsumables);
    }
    
    if (existingSizes.length > 0) {
      const mappedSizes = existingSizes.map(item => ({
        name: item.name,
        additional_price: item.additional_price,
      }));
      setSizes(mappedSizes);
    }
  }, [existingIngredients, existingConsumables, existingSizes]);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await updateProduct.mutateAsync({
        id: product.id,
        product: values,
        ingredients: values.has_ingredients ? ingredients : [],
        consumables: values.has_consumables ? consumables : [],
        sizes: values.has_sizes ? sizes : [],
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
        
        <ProductForm 
          form={form}
          onSubmit={handleSubmit}
          ingredients={ingredients}
          setIngredients={setIngredients}
          consumables={consumables}
          setConsumables={setConsumables}
          sizes={sizes}
          setSizes={setSizes}
          isEditMode={true}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditProductModal;
