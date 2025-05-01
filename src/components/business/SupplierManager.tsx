
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { 
  Dialog,
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
} from '@/components/ui/dialog';
import { useBusinessAuth } from '@/context/BusinessAuthContext';
import { useBusinessSuppliers } from '@/hooks/useBusinessSuppliers';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import SupplierList from './SupplierList';
import { BusinessSupplier } from '@/types/business-supplier';
import AddSupplierForm from './AddSupplierForm';
import EditSupplierForm from './EditSupplierForm';
import SupplierDetails from './SupplierDetails';

const SupplierManager: React.FC = () => {
  const { business } = useBusinessAuth();
  const { suppliers, isLoading, error, refetch } = useBusinessSuppliers();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<BusinessSupplier | null>(null);

  const handleViewSupplier = (supplier: BusinessSupplier) => {
    setSelectedSupplier(supplier);
    setIsViewDialogOpen(true);
  };

  const handleEditSupplier = (supplier: BusinessSupplier) => {
    setSelectedSupplier(supplier);
    setIsEditDialogOpen(true);
  };

  // Error handling
  if (error) {
    console.error("Error loading suppliers:", error);
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>Could not load suppliers</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">
            {error instanceof Error ? error.message : 'An unknown error occurred'}
          </p>
          <Button onClick={() => refetch()} className="mt-4">Try Again</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Supplier Management</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Supplier
          </Button>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Supplier</DialogTitle>
              <DialogDescription>
                Fill out the form below to add a new supplier to your business.
              </DialogDescription>
            </DialogHeader>
            <AddSupplierForm 
              onSuccess={() => {
                setIsAddDialogOpen(false);
                refetch();
              }} 
              onCancel={() => setIsAddDialogOpen(false)} 
            />
          </DialogContent>
        </Dialog>
      </div>

      {business && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>{business.business_name}</CardTitle>
            <CardDescription>
              {business.country} • {business.currency}
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      <SupplierList 
        suppliers={suppliers} 
        businessId={business?.id || ''} 
        onViewSupplier={handleViewSupplier}
        onEditSupplier={handleEditSupplier}
      />

      {/* View Supplier Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Supplier Details</DialogTitle>
          </DialogHeader>
          {selectedSupplier && (
            <SupplierDetails supplier={selectedSupplier} />
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Supplier Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Supplier</DialogTitle>
            <DialogDescription>
              Update the supplier information below.
            </DialogDescription>
          </DialogHeader>
          {selectedSupplier && (
            <EditSupplierForm 
              supplier={selectedSupplier}
              onSuccess={() => {
                setIsEditDialogOpen(false);
                refetch();
              }}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SupplierManager;
