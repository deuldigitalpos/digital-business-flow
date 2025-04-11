
import React from 'react';
import { MapPin, Edit, Trash2, ToggleRight, ToggleLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { BusinessLocation } from '@/types/business-location';

interface LocationListProps {
  locations: BusinessLocation[];
  isLoading: boolean;
  onEdit: (location: BusinessLocation) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (location: BusinessLocation) => void;
}

const LocationList: React.FC<LocationListProps> = ({ 
  locations, 
  isLoading, 
  onEdit, 
  onDelete,
  onToggleStatus
}) => {
  if (isLoading) {
    return (
      <div className="py-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent"></div>
        <p className="mt-2 text-muted-foreground">Loading locations...</p>
      </div>
    );
  }

  if (!locations.length) {
    return (
      <div className="py-12 text-center border rounded-md bg-muted/20">
        <MapPin className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
        <h3 className="mt-4 text-lg font-medium">No locations found</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Add your first location to manage your business across different branches.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden border rounded-md">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {locations.map((location) => (
            <TableRow key={location.id}>
              <TableCell className="font-medium">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-orange-500" />
                  {location.name}
                </div>
              </TableCell>
              <TableCell>{location.address}</TableCell>
              <TableCell>
                <Badge className={
                  location.status === 'active' 
                    ? "bg-green-100 text-green-800 hover:bg-green-100" 
                    : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                }>
                  {location.status === 'active' ? 'Active' : 'Inactive'}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex justify-end items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onToggleStatus(location)}
                    title={location.status === 'active' ? 'Deactivate' : 'Activate'}
                  >
                    {location.status === 'active' ? (
                      <ToggleRight className="h-4 w-4 text-green-600" />
                    ) : (
                      <ToggleLeft className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(location)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(location.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
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

export default LocationList;
