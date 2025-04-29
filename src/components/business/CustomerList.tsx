import React, { useState } from 'react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Eye, Edit, Trash, FileText, ShoppingBag, CreditCard, FileClock, FileEdit, ActivitySquare, CheckCircle, XCircle } from 'lucide-react';
import { BusinessCustomer } from '@/types/business-customer';
import { useBusinessCustomerMutations } from '@/hooks/useBusinessCustomerMutations';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { useBusinessAuth } from '@/context/BusinessAuthContext';

interface CustomerListProps {
  customers: BusinessCustomer[];
  businessId: string;
  onViewCustomer: (customer: BusinessCustomer) => void;
  onEditCustomer: (customer: BusinessCustomer) => void;
}

const CustomerList: React.FC<CustomerListProps> = ({
  customers,
  businessId,
  onViewCustomer,
  onEditCustomer
}) => {
  const [customerToDelete, setCustomerToDelete] = useState<BusinessCustomer | null>(null);
  const { hasPermission } = useBusinessAuth();
  const {
    deleteCustomer,
    toggleCustomerStatus
  } = useBusinessCustomerMutations();
  
  const handleConfirmDelete = async () => {
    if (customerToDelete) {
      await deleteCustomer.mutateAsync(customerToDelete.id);
      setCustomerToDelete(null);
    }
  };
  
  const handleToggleStatus = async (id: string, currentStatus: string) => {
    await toggleCustomerStatus.mutateAsync({
      id,
      isActive: currentStatus !== 'active'
    });
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="outline" className="bg-green-100 border-green-300 text-green-800">Active</Badge>;
      case 'inactive':
        return <Badge variant="outline" className="bg-gray-100 border-gray-300 text-gray-800">Inactive</Badge>;
      case 'suspended':
        return <Badge variant="outline" className="bg-yellow-100 border-yellow-300 text-yellow-800">Suspended</Badge>;
      case 'blocked':
        return <Badge variant="outline" className="bg-red-100 border-red-300 text-red-800">Blocked</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-blue-100 border-blue-300 text-blue-800">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  if (!customers || customers.length === 0) {
    return <div className="rounded-lg border border-dashed p-8 text-center">
        <h3 className="text-lg font-medium">No customers found</h3>
        <p className="text-muted-foreground mt-1">
          Add your first customer to get started.
        </p>
      </div>;
  }
  
  return <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Business</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map(customer => <TableRow key={customer.id}>
                <TableCell className="font-medium">
                  {customer.customer_id || '—'}
                </TableCell>
                <TableCell>
                  {customer.first_name} {customer.last_name}
                </TableCell>
                <TableCell>
                  {customer.business_name || '—'}
                </TableCell>
                <TableCell>
                  {customer.email || '—'}
                </TableCell>
                <TableCell>
                  {customer.mobile_number || '—'}
                </TableCell>
                <TableCell>
                  {getStatusBadge(customer.account_status)}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      
                      <DropdownMenuItem onClick={() => onViewCustomer(customer)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem onClick={() => onEditCustomer(customer)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      
                      <DropdownMenuSeparator />
                      
                      <DropdownMenuItem onClick={() => handleToggleStatus(customer.id, customer.account_status)}>
                        {customer.account_status === 'active' ? <>
                            <XCircle className="mr-2 h-4 w-4" />
                            Deactivate
                          </> : <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Activate
                          </>}
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem onClick={() => setCustomerToDelete(customer)}>
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                      
                      <DropdownMenuSeparator />
                      
                      <DropdownMenuItem disabled>
                        <CreditCard className="mr-2 h-4 w-4" />
                        Pay
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem disabled>
                        <FileText className="mr-2 h-4 w-4" />
                        Ledger
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem disabled>
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        Sales
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem disabled>
                        <FileClock className="mr-2 h-4 w-4" />
                        Invoices
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem disabled>
                        <FileEdit className="mr-2 h-4 w-4" />
                        Documents & Notes
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem disabled>
                        <ActivitySquare className="mr-2 h-4 w-4" />
                        Activities
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>)}
          </TableBody>
        </Table>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!customerToDelete} onOpenChange={() => setCustomerToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the customer
              {customerToDelete && <strong> {customerToDelete.first_name} {customerToDelete.last_name}</strong>} and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>;
};

export default CustomerList;
