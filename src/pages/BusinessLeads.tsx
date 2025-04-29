import React, { useState, useEffect } from 'react';
import { useBusinessAuth } from '@/context/BusinessAuthContext';
import { Loader2, ShieldAlert, UserPlus, Search, Trash2, Edit, RefreshCw } from 'lucide-react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useBusinessLeadsMutations, BusinessLead } from '@/hooks/useBusinessLeadsMutations';
import { format } from 'date-fns';

const BusinessLeads = () => {
  const { business, isLoading, hasPermission, businessUser } = useBusinessAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newLeadName, setNewLeadName] = useState('');
  const [selectedLead, setSelectedLead] = useState<BusinessLead | null>(null);
  
  // Simple error boundary state
  const [hasError, setHasError] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  
  // Reset error state on mount
  useEffect(() => {
    setHasError(false);
  }, []);

  // Get our lead mutations and query
  const { createLead, updateLead, deleteLead, useBusinessLeads } = useBusinessLeadsMutations();
  
  // Fetch leads
  const { 
    data: leads, 
    isLoading: isLeadsLoading, 
    error,
    refetch 
  } = useBusinessLeads(business?.id);

  // Function to handle retry
  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      await refetch();
      setHasError(false); // Reset error state if refetch succeeds
    } catch (e) {
      console.error("Error during retry:", e);
      setHasError(true);
      toast.error("Failed to reload leads. Please try again later.");
    } finally {
      setIsRetrying(false);
    }
  };

  // Filter leads based on search query
  const filteredLeads = React.useMemo(() => {
    if (!leads) return [];
    if (!searchQuery.trim()) return leads;
    
    const lowerCaseQuery = searchQuery.toLowerCase().trim();
    return leads.filter(lead => 
      lead.name.toLowerCase().includes(lowerCaseQuery)
    );
  }, [leads, searchQuery]);
  
  // Error boundary wrapper
  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <div className="text-red-500 text-lg font-medium">
          Something went wrong loading the leads page.
        </div>
        <button
          className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
          onClick={() => {
            setHasError(false);
            window.location.reload();
          }}
        >
          Try again
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        <span className="ml-2 text-lg">Loading business leads...</span>
      </div>
    );
  }
  
  // Check for view permission but still show the page with limited content
  const canViewCustomers = hasPermission('customers');
  
  if (!canViewCustomers) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-orange-500" />
            Limited Access
          </CardTitle>
          <CardDescription>
            You have limited permissions for the Leads section
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            You don't have permission to manage leads.
            Contact your administrator for access.
          </p>
          
          {business && (
            <div className="mt-6 p-4 bg-muted/30 rounded-md">
              <h3 className="font-medium text-lg">{business.business_name}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {business.country} • {business.currency}
              </p>
              {business.contact_number && (
                <p className="text-sm mt-2">Contact: {business.contact_number}</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
  
  // Function to handle adding a new lead
  const handleAddLead = async () => {
    if (!newLeadName.trim() || !business?.id) {
      toast.error("Please enter a name for the lead source");
      return;
    }

    try {
      await createLead.mutateAsync({
        business_id: business.id,
        name: newLeadName.trim()
      });
      
      setNewLeadName('');
      setIsAddDialogOpen(false);
    } catch (error: any) {
      console.error('Error adding new lead:', error);
    }
  };

  // Function to handle updating a lead
  const handleEditLead = async () => {
    if (!selectedLead || !newLeadName.trim()) {
      toast.error("Please enter a name for the lead");
      return;
    }

    try {
      await updateLead.mutateAsync({
        id: selectedLead.id,
        name: newLeadName.trim()
      });
      
      setNewLeadName('');
      setSelectedLead(null);
      setIsEditDialogOpen(false);
    } catch (error: any) {
      console.error('Error updating lead:', error);
    }
  };

  // Function to handle editing a lead
  const handleOpenEditDialog = (lead: BusinessLead) => {
    setSelectedLead(lead);
    setNewLeadName(lead.name);
    setIsEditDialogOpen(true);
  };

  // Function to handle deleting a lead
  const handleDeleteLead = async (id: string) => {
    if (confirm("Are you sure you want to delete this lead? This action cannot be undone.")) {
      try {
        await deleteLead.mutateAsync(id);
      } catch (error: any) {
        console.error('Error deleting lead:', error);
      }
    }
  };

  if (isLeadsLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        <span className="ml-2 text-lg">Loading leads...</span>
      </div>
    );
  }

  // If there's an error, show a specific error message with retry option
  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Error loading leads:</AlertTitle>
            <AlertDescription>
              Authentication failed. Please try again.
            </AlertDescription>
          </Alert>
          <Button 
            onClick={handleRetry} 
            className="mt-4"
            variant="default"
            disabled={isRetrying}
          >
            {isRetrying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Retrying...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Lead Sources</h1>
            <p className="text-muted-foreground">
              Manage your business lead sources and track where customers come from.
            </p>
          </div>
          
          <Button 
            onClick={() => setIsAddDialogOpen(true)} 
            className="gap-2"
            variant="default"
          >
            <UserPlus className="h-4 w-4" />
            Add New Lead Source
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search lead sources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>

        {/* Lead List */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lead Source</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.length > 0 ? (
                  filteredLeads.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell>
                        <div className="font-medium">{lead.name}</div>
                      </TableCell>
                      <TableCell>
                        {format(new Date(lead.created_at), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => handleOpenEditDialog(lead)}
                            variant="ghost"
                            size="icon"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => handleDeleteLead(lead.id)}
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                      No leads found. Add your first lead source!
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Add Lead Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Add New Lead Source</DialogTitle>
            <DialogDescription>
              Enter the lead source name below (e.g. Facebook, Referral, Website).
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input 
              placeholder="Enter lead source name" 
              value={newLeadName}
              onChange={(e) => setNewLeadName(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddLead} disabled={createLead.isPending}>
              {createLead.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Lead Source'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Lead Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Edit Lead Source</DialogTitle>
            <DialogDescription>
              Update the lead source name.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input 
              placeholder="Enter lead source name" 
              value={newLeadName}
              onChange={(e) => setNewLeadName(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditLead} disabled={updateLead.isPending}>
              {updateLead.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BusinessLeads;
