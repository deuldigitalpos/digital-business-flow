
import React from "react";
import { BusinessWarranty } from "@/types/business-warranty";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { format, isAfter, parseISO } from "date-fns";

interface WarrantyListProps {
  warranties: BusinessWarranty[];
  onEdit: (warranty: BusinessWarranty) => void;
  onDelete: (warranty: BusinessWarranty) => void;
  isLoading: boolean;
  productCounts?: Record<string, number>;
}

const WarrantyList: React.FC<WarrantyListProps> = ({
  warranties,
  onEdit,
  onDelete,
  isLoading,
  productCounts = {},
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-pulse text-center">
          <div className="h-6 bg-gray-200 rounded w-48 mb-4 mx-auto"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2.5"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2.5"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (warranties.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No warranties found</p>
      </div>
    );
  }

  const getExpirationStatusBadge = (warranty: BusinessWarranty) => {
    const today = new Date();
    const expirationDate = parseISO(warranty.expiration_date);
    
    if (isAfter(expirationDate, today)) {
      return <Badge variant="default" className="bg-green-500">Valid</Badge>;
    } else {
      return <Badge variant="destructive">Expired</Badge>;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Expiration Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Products Count</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {warranties.map((warranty) => (
            <TableRow key={warranty.id}>
              <TableCell className="font-medium">{warranty.name}</TableCell>
              <TableCell className="max-w-xs truncate">
                {warranty.description || "-"}
              </TableCell>
              <TableCell>
                {warranty.expiration_date ? format(new Date(warranty.expiration_date), "PP") : "-"}
              </TableCell>
              <TableCell>
                {warranty.is_active ? 
                  getExpirationStatusBadge(warranty) : 
                  <Badge variant="secondary">Inactive</Badge>
                }
              </TableCell>
              <TableCell>
                {productCounts[warranty.id] || 0}
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onEdit(warranty)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onDelete(warranty)}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default WarrantyList;
