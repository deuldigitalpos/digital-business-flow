
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
import { BusinessUnit } from "@/types/business-unit";
import { formatDate } from "@/lib/utils";

interface UnitListProps {
  units: BusinessUnit[];
  onEdit: (unit: BusinessUnit) => void;
  onDelete: (unit: BusinessUnit) => void;
  isLoading?: boolean;
}

const UnitList: React.FC<UnitListProps> = ({
  units,
  onEdit,
  onDelete,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="w-full h-40 flex items-center justify-center">
        <p className="text-muted-foreground">Loading units...</p>
      </div>
    );
  }

  if (units.length === 0) {
    return (
      <div className="w-full h-40 flex flex-col items-center justify-center">
        <p className="text-muted-foreground">No units found</p>
        <p className="text-sm text-muted-foreground">
          Create a new unit to get started
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
            <TableHead>Short Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Default</TableHead>
            <TableHead>Date Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {units.map((unit) => (
            <TableRow key={unit.id}>
              <TableCell className="font-medium">{unit.name}</TableCell>
              <TableCell>{unit.short_name}</TableCell>
              <TableCell>{unit.description || "-"}</TableCell>
              <TableCell>{unit.is_default ? "Yes" : "No"}</TableCell>
              <TableCell>{formatDate(unit.created_at)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(unit)}
                    disabled={unit.is_default}
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(unit)}
                    disabled={unit.is_default}
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

export default UnitList;
