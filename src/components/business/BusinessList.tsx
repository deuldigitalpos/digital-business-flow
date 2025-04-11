
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, CreditCard, Building2, ToggleLeft, ToggleRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BusinessListProps {
  businesses: any[];
  isLoading: boolean;
  selectedBusiness: any;
  onSelect: (business: any) => void;
  onEdit: (business: any) => void;
  onDelete: (id: string) => void;
  onManage: (business: any) => void;
  onAddSubscription: (business: any) => void;
  onToggleActive: (business: any, isActive: boolean) => void;
}

const BusinessList: React.FC<BusinessListProps> = ({
  businesses,
  isLoading,
  selectedBusiness,
  onSelect,
  onEdit,
  onDelete,
  onManage,
  onAddSubscription,
  onToggleActive
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
              <TableCell className="text-right space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onManage(business);
                  }}
                >
                  <Building2 className="w-4 h-4 mr-1" /> Manage
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddSubscription(business);
                  }}
                >
                  <CreditCard className="w-4 h-4 mr-1" /> Add Subscription
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    const isCurrentlyActive = business.is_active !== false; // Default to true if undefined
                    onToggleActive(business, !isCurrentlyActive);
                  }}
                >
                  {business.is_active !== false ? (
                    <><ToggleRight className="w-4 h-4 mr-1 text-green-500" /> Deactivate</>
                  ) : (
                    <><ToggleLeft className="w-4 h-4 mr-1 text-gray-500" /> Activate</>
                  )}
                </Button>
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
