
import { useState } from 'react';
import { useBusinessAuth } from '@/context/BusinessAuthContext';
import { useBusinessSuppliers } from '@/hooks/useBusinessSuppliers';
import { BusinessSupplier } from '@/types/business-supplier';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import AddSupplierForm from './AddSupplierForm';
import EditSupplierForm from './EditSupplierForm';
import SupplierList from './SupplierList';
import SupplierDetails from './SupplierDetails';
import { Skeleton } from '@/components/ui/skeleton';

const SupplierManager = () => {
  const { businessUser } = useBusinessAuth();
  const [activeTab, setActiveTab] = useState('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<BusinessSupplier | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: suppliers, isLoading, isError } = useBusinessSuppliers();
  
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
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Card>
          <Skeleton className="h-[500px] w-full" />
        </Card>
      </div>
    );
  }
  
  if (isError) {
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
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Suppliers</h2>
        <Button onClick={handleAddSupplier}>
          <Plus className="mr-2 h-4 w-4" />
          Add Supplier
        </Button>
      </div>

      {/* Search and filter */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search suppliers..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
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
    </div>
  );
};

export default SupplierManager;
