
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { 
  AlertCircle,
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye, 
  ImageIcon,
  PackagePlus, 
  TagIcon,
  ShieldIcon,
  RulerIcon
} from "lucide-react";
import useBusinessProducts from "@/hooks/useBusinessProducts";
import { Badge } from "@/components/ui/badge";
import { BusinessProduct } from "@/types/business-product";
import EditProductModal from "@/components/business-inventory/EditProductModal";
import ViewProductModal from "@/components/business-inventory/ViewProductModal";
import DeleteProductDialog from "@/components/business-inventory/DeleteProductDialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ProductsTableProps {
  filters: Record<string, any>;
}

const ProductsTable: React.FC<ProductsTableProps> = ({ filters }) => {
  const { products, isLoading } = useBusinessProducts(filters);
  const [editProduct, setEditProduct] = useState<BusinessProduct | null>(null);
  const [viewProduct, setViewProduct] = useState<BusinessProduct | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<BusinessProduct | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <p className="text-muted-foreground">Loading products...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-32">
        <p className="text-muted-foreground">No products found</p>
        <p className="text-sm text-muted-foreground">Try adjusting your filters or add your first product</p>
      </div>
    );
  }

  const getStockStatusBadge = (status?: string) => {
    switch (status) {
      case 'In Stock':
        return <Badge className="bg-green-500">In Stock</Badge>;
      case 'Low Stock':
        return <Badge variant="outline" className="text-amber-500 border-amber-500">Low Stock</Badge>;
      default:
        return <Badge variant="destructive">Out of Stock</Badge>;
    }
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Product ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Stock Status</TableHead>
              <TableHead className="text-right">Selling Price</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  {product.image_url ? (
                    <img 
                      src={product.image_url} 
                      alt={product.name} 
                      className="w-10 h-10 rounded object-cover" 
                    />
                  ) : (
                    <div className="w-10 h-10 bg-muted rounded flex items-center justify-center">
                      <ImageIcon className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">{product.product_id || product.sku}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {product.name}
                    {(product.has_ingredients || product.has_consumables) && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <PackagePlus className="h-4 w-4 text-blue-500" />
                          </TooltipTrigger>
                          <TooltipContent side="right">
                            <p>Made from ingredients/consumables</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </TableCell>
                <TableCell>{product.category?.name || '-'}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    {product.quantity || 0}
                    {(product.has_ingredients || product.has_consumables) && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <AlertCircle className="h-4 w-4 text-blue-500" />
                          </TooltipTrigger>
                          <TooltipContent side="right">
                            <p>Availability depends on components</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    {product.unit && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <RulerIcon className="h-4 w-4 text-blue-500" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Unit: {product.unit.name}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                    {product.brand && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <TagIcon className="h-4 w-4 text-green-500" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Brand: {product.brand.name}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                    {product.warranty && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <ShieldIcon className="h-4 w-4 text-purple-500" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Warranty: {product.warranty.name}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </TableCell>
                <TableCell>{getStockStatusBadge(product.stock_status)}</TableCell>
                <TableCell className="text-right">${product.selling_price.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setViewProduct(product)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setEditProduct(product)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => setDeleteProduct(product)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {editProduct && (
        <EditProductModal 
          product={editProduct}
          isOpen={!!editProduct}
          onClose={() => setEditProduct(null)}
        />
      )}

      {viewProduct && (
        <ViewProductModal 
          product={viewProduct}
          isOpen={!!viewProduct}
          onClose={() => setViewProduct(null)}
        />
      )}

      {deleteProduct && (
        <DeleteProductDialog
          product={deleteProduct}
          isOpen={!!deleteProduct}
          onClose={() => setDeleteProduct(null)}
        />
      )}
    </>
  );
};

export default ProductsTable;
