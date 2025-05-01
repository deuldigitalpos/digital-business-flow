import React, { useState } from 'react';
import { useBusinessAuth } from '@/context/BusinessAuthContext';
import { useBusinessSuppliers } from '@/hooks/useBusinessSuppliers';
import { BusinessSupplier } from '@/types/business-supplier';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Plus, Search, FileText } from 'lucide-react';
import AddSupplierForm from './AddSupplierForm';
import EditSupplierForm from './EditSupplierForm';
import SupplierList from './SupplierList';
import SupplierDetails from './SupplierDetails';
import { Skeleton } from '@/components/ui/skeleton';
import { Business } from '@/types/business';

interface SupplierManagerProps {
  business: Business | null;
}

const SupplierManager: React.FC = () => {
  const { businessUser } = useBusinessAuth();
  const [activeTab, setActiveTab] = useState('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<BusinessSupplier | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { suppliers, isLoading, error } = useBusinessSuppliers();
  
  // Filter suppliers based on search term
  const filteredSuppliers = suppliers?.filter(supplier => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      supplier.first_name.toLowerCase().includes(searchLower) ||
      supplier.last_name.toLowerCase().includes(searchLower) ||
      (supplier.business_name && supplier.business_name.toLowerCase().includes(searchLower)) ||
      (supplier.email && supplier.email.toLowerCase().includes(searchLower)) ||
      (supplier.mobile_number && supplier.mobile_number.toLowerCase().includes(searchLower))
    );
  }) || [];
  
  const activeSuppliers = filteredSuppliers.filter(supplier => supplier.account_status === 'active');
  const inactiveSuppliers = filteredSuppliers.filter(supplier => supplier.account_status === 'inactive');
  
  const handleAddSupplier = () => {
    setShowAddDialog(true);
  };
  
  const handleViewSupplier = (supplier: BusinessSupplier) => {
    setSelectedSupplier(supplier);
    setShowDetailsDialog(true);
  };
  
  const handleEditSupplier = (supplier: BusinessSupplier) => {
    setSelectedSupplier(supplier);
    setShowEditDialog(true);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Skeleton className="h-8 w-8 rounded-full" />
        <span className="ml-2 text-lg">Loading suppliers...</span>
      </div>
    );
  }
  
  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <h3 className="text-lg font-medium text-red-600">Failed to load suppliers</h3>
          <p className="text-muted-foreground mt-1">
            There was an error fetching the supplier data. Please try again later.
          </p>
        </div>
      </Card>
    );
  }
  
  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Suppliers</h1>
            <p className="text-muted-foreground">
              Manage your business suppliers and track their activities.
            </p>
          </div>
          
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button 
              onClick={handleAddSupplier} 
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Supplier
            </Button>
            <Button variant="outline" className="gap-2">
              <FileText className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search suppliers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="all">
                All Suppliers ({filteredSuppliers.length})
              </TabsTrigger>
              <TabsTrigger value="active">
                Active ({activeSuppliers.length})
              </TabsTrigger>
              <TabsTrigger value="inactive">
                Inactive ({inactiveSuppliers.length})
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="all" className="pt-4">
            <SupplierList 
              suppliers={filteredSuppliers} 
              businessId={businessUser?.business_id || ''}
              onViewSupplier={handleViewSupplier}
              onEditSupplier={handleEditSupplier}
            />
          </TabsContent>
          
          <TabsContent value="active" className="pt-4">
            <SupplierList 
              suppliers={activeSuppliers} 
              businessId={businessUser?.business_id || ''}
              onViewSupplier={handleViewSupplier}
              onEditSupplier={handleEditSupplier}
            />
          </TabsContent>
          
          <TabsContent value="inactive" className="pt-4">
            <SupplierList 
              suppliers={inactiveSuppliers} 
              businessId={businessUser?.business_id || ''}
              onViewSupplier={handleViewSupplier}
              onEditSupplier={handleEditSupplier}
            />
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Add Supplier Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Supplier</DialogTitle>
            <DialogDescription>
              Enter supplier details below. Fields marked with * are required.
            </DialogDescription>
          </DialogHeader>
          <AddSupplierForm 
            onSuccess={() => setShowAddDialog(false)}
            onCancel={() => setShowAddDialog(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* View Supplier Dialog */}
      {selectedSupplier && (
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Supplier Details</DialogTitle>
            </DialogHeader>
            <SupplierDetails supplier={selectedSupplier} />
            <div className="flex justify-end gap-2 mt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowDetailsDialog(false)}
              >
                Close
              </Button>
              <Button onClick={() => {
                setShowDetailsDialog(false);
                setShowEditDialog(true);
              }}>
                Edit Supplier
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Edit Supplier Dialog */}
      {selectedSupplier && (
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Supplier</DialogTitle>
              <DialogDescription>
                Update supplier details below.
              </DialogDescription>
            </DialogHeader>
            <EditSupplierForm 
              supplier={selectedSupplier}
              onSuccess={() => setShowEditDialog(false)}
              onCancel={() => setShowEditDialog(false)}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default SupplierManager;
