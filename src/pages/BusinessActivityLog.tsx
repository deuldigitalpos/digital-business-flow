
import React, { useState } from 'react';
import { useBusinessAuth } from '@/context/BusinessAuthContext';
import PermissionDenied from './PermissionDenied';
import { useBusinessActivityLogs } from '@/hooks/useBusinessActivityLogs';
import { formatDistanceToNow } from 'date-fns';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Loader2, Search, Filter, RefreshCw } from 'lucide-react';
import { ActivityLogFilters } from '@/types/business-activity';

const BusinessActivityLog: React.FC = () => {
  const { hasPermission } = useBusinessAuth();
  const hasAccess = hasPermission('activity_log');
  
  const [filters, setFilters] = useState<ActivityLogFilters>({});
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: activityLogs, isLoading, refetch } = useBusinessActivityLogs(filters);

  const handleFilterChange = (key: keyof ActivityLogFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === 'all' ? undefined : value
    }));
    setPage(1);
  };

  const handleSearch = () => {
    setFilters(prev => ({
      ...prev,
      item_name: searchTerm || undefined
    }));
    setPage(1);
  };

  const handleReset = () => {
    setFilters({});
    setSearchTerm('');
    setPage(1);
  };

  // Format the action type for display
  const formatActionType = (actionType: string) => {
    return actionType
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (!hasAccess) {
    return <PermissionDenied />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Activity Log</h1>
        <p className="text-muted-foreground">
          Track all activities and changes across your business
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Page</label>
              <Select
                value={filters.page || 'all'}
                onValueChange={(value) => handleFilterChange('page', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Pages" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Pages</SelectItem>
                  <SelectItem value="product">Products</SelectItem>
                  <SelectItem value="ingredient">Ingredients</SelectItem>
                  <SelectItem value="consumable">Consumables</SelectItem>
                  <SelectItem value="stock">Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Action Type</label>
              <Select
                value={filters.action_type || 'all'}
                onValueChange={(value) => handleFilterChange('action_type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Actions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="added">Added</SelectItem>
                  <SelectItem value="updated">Updated</SelectItem>
                  <SelectItem value="deleted">Deleted</SelectItem>
                  <SelectItem value="stock_increased">Stock Increased</SelectItem>
                  <SelectItem value="stock_decreased">Stock Decreased</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Search by Item Name</label>
              <div className="flex gap-2">
                <Input 
                  placeholder="Search..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button variant="outline" size="icon" onClick={handleSearch}>
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-end gap-2">
              <Button variant="outline" onClick={handleReset} className="flex gap-2">
                <RefreshCw className="h-4 w-4" />
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between">
            <span>Activity Records</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => refetch()}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              <span className="ml-2">Refresh</span>
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : !activityLogs || activityLogs.length === 0 ? (
            <div className="text-center p-8">
              <p className="text-muted-foreground">No activity logs found</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Page</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Updated By</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activityLogs.map(log => (
                    <TableRow key={log.id}>
                      <TableCell>
                        {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                      </TableCell>
                      <TableCell className="capitalize">{log.page}</TableCell>
                      <TableCell>{formatActionType(log.action_type)}</TableCell>
                      <TableCell>{log.item_name}</TableCell>
                      <TableCell>{log.user_name}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {activityLogs?.length || 0} records
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default BusinessActivityLog;
