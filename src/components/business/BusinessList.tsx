
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BusinessListProps {
  businesses: any[];
  isLoading: boolean;
  selectedBusiness: any;
  onSelect: (business: any) => void;
  onEdit: (business: any) => void;
  onDelete: (id: string) => void;
}

const BusinessList: React.FC<BusinessListProps> = ({
  businesses,
  isLoading,
  selectedBusiness,
  onSelect,
  onEdit,
  onDelete
}) => {
  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Loading businesses...</div>;
  }

  if (businesses.length === 0) {
    return (
      <div className="text-center p-8 border rounded-md bg-muted/20">
        <p className="text-muted-foreground">No businesses found. Add your first business to get started.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Business Name</TableHead>
            <TableHead>Country</TableHead>
            <TableHead>Currency</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {businesses.map((business) => (
            <TableRow 
              key={business.id}
              className={cn(
                "cursor-pointer hover:bg-muted/50",
                selectedBusiness?.id === business.id && "bg-muted"
              )}
              onClick={() => onSelect(business)}
            >
              <TableCell className="font-medium">{business.business_name}</TableCell>
              <TableCell>{business.country}</TableCell>
              <TableCell>{business.currency}</TableCell>
              <TableCell>{business.contact_number || '-'}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(business);
                  }}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(business.id);
                  }}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default BusinessList;
