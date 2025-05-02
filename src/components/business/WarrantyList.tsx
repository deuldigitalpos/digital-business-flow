
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
import { BusinessWarranty } from "@/types/business-warranty";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface WarrantyListProps {
  warranties: BusinessWarranty[];
  onEdit: (warranty: BusinessWarranty) => void;
  onDelete: (warranty: BusinessWarranty) => void;
  isLoading?: boolean;
}

const WarrantyList: React.FC<WarrantyListProps> = ({
  warranties,
  onEdit,
  onDelete,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Expiration</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 3 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                <TableCell><Skeleton className="h-9 w-20 ml-auto" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (warranties.length === 0) {
    return (
      <div className="w-full h-40 flex flex-col items-center justify-center rounded-md border">
        <p className="text-muted-foreground">No warranties found</p>
        <p className="text-sm text-muted-foreground">
          Create a new warranty to get started
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
            <TableHead>Expiration</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {warranties.map((warranty) => (
            <TableRow key={warranty.id}>
              <TableCell className="font-medium">{warranty.name}</TableCell>
              <TableCell>{warranty.description || "-"}</TableCell>
              <TableCell>
                {warranty.expiration_date ? 
                  format(new Date(warranty.expiration_date), "MMM d, yyyy") : 
                  `${warranty.duration} ${warranty.duration_unit}`
                }
              </TableCell>
              <TableCell>
                <Badge variant={warranty.is_active ? "success" : "secondary"}>
                  {warranty.is_active ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(warranty)}
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(warranty)}
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

export default WarrantyList;
