
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { BusinessCategory } from "@/types/business-category";
import { formatDate } from "@/lib/utils";

interface CategoryListProps {
  categories: BusinessCategory[];
  onEdit: (category: BusinessCategory) => void;
  onDelete: (category: BusinessCategory) => void;
  isLoading?: boolean;
}

const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  onEdit,
  onDelete,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="w-full h-40 flex items-center justify-center">
        <p className="text-muted-foreground">Loading categories...</p>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="w-full h-40 flex flex-col items-center justify-center">
        <p className="text-muted-foreground">No categories found</p>
        <p className="text-sm text-muted-foreground">
          Create a new category to get started
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Date Created</TableHead>
            <TableHead className="text-right">Total Sales</TableHead>
            <TableHead className="text-right">Monthly Sales</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell className="font-medium">{category.name}</TableCell>
              <TableCell>{category.description || "-"}</TableCell>
              <TableCell>{formatDate(category.created_at)}</TableCell>
              <TableCell className="text-right">
                {category.total_sales ? `$${category.total_sales.toFixed(2)}` : "$0.00"}
              </TableCell>
              <TableCell className="text-right">
                {category.monthly_sales ? `$${category.monthly_sales.toFixed(2)}` : "$0.00"}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(category)}
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(category)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CategoryList;
