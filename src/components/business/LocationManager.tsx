
import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { MapPin, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useBusinessAuth } from '@/context/BusinessAuthContext';
import { toast } from 'sonner';
import LocationList from '@/components/business/LocationList';
import AddLocationForm from '@/components/business/AddLocationForm';
import EditLocationForm from '@/components/business/EditLocationForm';
import { BusinessLocation } from '@/types/business-location';

const LocationManager = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<BusinessLocation | null>(null);
  const { business } = useBusinessAuth();
  const queryClient = useQueryClient();
  
  // Fetch locations for the current business
  const { data: locations, isLoading } = useQuery({
    queryKey: ['business-locations', business?.id],
    queryFn: async () => {
      if (!business?.id) return [];
      
      const { data, error } = await supabase
        .from('business_locations')
        .select('*')
        .eq('business_id', business.id)
        .order('name', { ascending: true });
      
      if (error) {
        console.error('Error fetching locations:', error);
        toast.error('Failed to load business locations');
        throw error;
      }
      
      return data as BusinessLocation[];
    },
    enabled: !!business?.id,
  });

  const handleEditLocation = (location: BusinessLocation) => {
    setSelectedLocation(location);
    setIsEditModalOpen(true);
  };

  const handleDeleteLocation = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this location? This action cannot be undone.')) {
      return;
    }

    try {
      // First, delete any user location mappings
      const { error: mappingError } = await supabase
        .from('user_locations')
        .delete()
        .eq('location_id', id);
      
      if (mappingError) throw mappingError;

      // Then delete the location
      const { error } = await supabase
        .from('business_locations')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success('Location deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['business-locations'] });
    } catch (error) {
      console.error('Error deleting location:', error);
      toast.error('Failed to delete location');
    }
  };

  const handleToggleStatus = async (location: BusinessLocation) => {
    try {
      const newStatus = location.status === 'active' ? 'inactive' : 'active';
      
      const { error } = await supabase
        .from('business_locations')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', location.id);
      
      if (error) throw error;
      
      toast.success(`Location status changed to ${newStatus}`);
      queryClient.invalidateQueries({ queryKey: ['business-locations'] });
    } catch (error) {
      console.error('Error updating location status:', error);
      toast.error('Failed to update location status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Business Locations</h1>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700"
        >
          <Plus className="h-4 w-4" /> Add Location
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-orange-500" />
            Locations
          </CardTitle>
          <CardDescription>
            Manage your business locations or branches
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LocationList 
            locations={locations || []} 
            isLoading={isLoading}
            onEdit={handleEditLocation}
            onDelete={handleDeleteLocation}
            onToggleStatus={handleToggleStatus}
          />
        </CardContent>
      </Card>

      <AddLocationForm 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        businessId={business?.id || ''}
      />

      {selectedLocation && (
        <EditLocationForm
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          location={selectedLocation}
        />
      )}
    </div>
  );
};

export default LocationManager;
