
import React from 'react';
import { BusinessCustomer } from '@/types/business-customer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  FileBarChart,
  ShoppingBag, 
  FileClock, 
  FileEdit, 
  ActivitySquare 
} from 'lucide-react';

interface CustomerDetailsProps {
  customer: BusinessCustomer;
}

const CustomerDetails: React.FC<CustomerDetailsProps> = ({ customer }) => {
  return (
    <Tabs defaultValue="overview">
      <TabsList className="grid w-full grid-cols-6">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="sales">Sales</TabsTrigger>
        <TabsTrigger value="invoices">Invoices</TabsTrigger>
        <TabsTrigger value="ledger">Ledger</TabsTrigger>
        <TabsTrigger value="documents">Documents</TabsTrigger>
        <TabsTrigger value="activities">Activities</TabsTrigger>
      </TabsList>

      {/* Overview Tab */}
      <TabsContent value="overview" className="space-y-4 pt-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold">
              {customer.first_name} {customer.last_name}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className={
                customer.account_status === 'active' 
                  ? "bg-green-100 border-green-300 text-green-800" 
                  : "bg-gray-100"
              }>
                {customer.account_status.charAt(0).toUpperCase() + customer.account_status.slice(1)}
              </Badge>
              {customer.is_lead && (
                <Badge variant="outline" className="bg-blue-100 border-blue-300 text-blue-800">
                  Lead
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" className="gap-1" disabled>
              <FileBarChart className="h-4 w-4" />
              Reports
            </Button>
            <Button variant="default" className="gap-1" disabled>
              <ShoppingBag className="h-4 w-4" />
              New Sale
            </Button>
          </div>
        </div>

        <Separator />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium">Customer Details</CardTitle>
            </CardHeader>
            <CardContent className="py-1 space-y-2">
              <div className="grid grid-cols-2 gap-1">
                <div className="text-sm text-muted-foreground">ID:</div>
                <div className="text-sm font-medium">{customer.customer_id || '—'}</div>
                
                <div className="text-sm text-muted-foreground">Name:</div>
                <div className="text-sm font-medium">
                  {customer.first_name} {customer.last_name}
                </div>
                
                <div className="text-sm text-muted-foreground">Business:</div>
                <div className="text-sm font-medium">{customer.business_name || '—'}</div>

                <div className="text-sm text-muted-foreground">TIN Number:</div>
                <div className="text-sm font-medium">{customer.tin_number || '—'}</div>

                <div className="text-sm text-muted-foreground">Email:</div>
                <div className="text-sm font-medium">{customer.email || '—'}</div>

                <div className="text-sm text-muted-foreground">Phone:</div>
                <div className="text-sm font-medium">{customer.mobile_number || '—'}</div>

                <div className="text-sm text-muted-foreground">Address:</div>
                <div className="text-sm font-medium">{customer.address || '—'}</div>

                <div className="text-sm text-muted-foreground">Credit Limit:</div>
                <div className="text-sm font-medium">
                  {customer.credit_limit !== null ? `$${customer.credit_limit.toFixed(2)}` : '—'}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium">Financial Summary</CardTitle>
            </CardHeader>
            <CardContent className="py-1 space-y-2">
              <div className="grid grid-cols-2 gap-1">
                <div className="text-sm text-muted-foreground">Total Sales:</div>
                <div className="text-sm font-medium">
                  ${customer.total_sale?.toFixed(2) || '0.00'}
                </div>
                
                <div className="text-sm text-muted-foreground">Total Invoices:</div>
                <div className="text-sm font-medium">
                  {customer.total_invoices || '0'}
                </div>
                
                <div className="text-sm text-muted-foreground">Invoices Due:</div>
                <div className="text-sm font-medium">
                  {customer.total_invoices_due || '0'}
                </div>
                
                <div className="text-sm text-muted-foreground">Amount Due:</div>
                <div className="text-sm font-medium text-red-600">
                  ${customer.total_amount_invoices_due?.toFixed(2) || '0.00'}
                </div>
                
                <div className="text-sm text-muted-foreground">Returns Due:</div>
                <div className="text-sm font-medium">
                  ${customer.total_sell_return_due?.toFixed(2) || '0.00'}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="py-4">
              <div className="text-center text-muted-foreground text-sm">
                No recent activity
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      {/* Sales Tab */}
      <TabsContent value="sales" className="space-y-4 pt-4">
        <Card>
          <CardHeader>
            <CardTitle>Sales History</CardTitle>
            <CardDescription>View all sales made by this customer.</CardDescription>
          </CardHeader>
          <CardContent className="py-6 text-center">
            <div className="text-muted-foreground">
              No sales records found for this customer.
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Invoices Tab */}
      <TabsContent value="invoices" className="space-y-4 pt-4">
        <Card>
          <CardHeader>
            <CardTitle>Customer Invoices</CardTitle>
            <CardDescription>View all invoices for this customer.</CardDescription>
          </CardHeader>
          <CardContent className="py-6 text-center">
            <div className="text-muted-foreground">
              No invoices found for this customer.
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Ledger Tab */}
      <TabsContent value="ledger" className="space-y-4 pt-4">
        <Card>
          <CardHeader>
            <CardTitle>Customer Ledger</CardTitle>
            <CardDescription>View the financial ledger for this customer.</CardDescription>
          </CardHeader>
          <CardContent className="py-6 text-center">
            <div className="text-muted-foreground">
              No ledger entries found for this customer.
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Documents Tab */}
      <TabsContent value="documents" className="space-y-4 pt-4">
        <Card>
          <CardHeader>
            <CardTitle>Documents & Notes</CardTitle>
            <CardDescription>Manage documents and notes for this customer.</CardDescription>
          </CardHeader>
          <CardContent className="py-6 text-center">
            <div className="text-muted-foreground">
              No documents or notes found for this customer.
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Activities Tab */}
      <TabsContent value="activities" className="space-y-4 pt-4">
        <Card>
          <CardHeader>
            <CardTitle>Activity Log</CardTitle>
            <CardDescription>View all activities for this customer.</CardDescription>
          </CardHeader>
          <CardContent className="py-6 text-center">
            <div className="text-muted-foreground">
              No activities recorded for this customer.
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default CustomerDetails;
