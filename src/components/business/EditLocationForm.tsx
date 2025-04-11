
import React, { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { BusinessLocation } from '@/types/business-location';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useBusinessAuth } from '@/context/BusinessAuthContext';

interface EditLocationFormProps {
  isOpen: boolean;
  onClose: () => void;
  location: BusinessLocation;
}

const EditLocationForm: React.FC<EditLocationFormProps> = ({ 
  isOpen, 
  onClose,
  location 
}) => {
  const [name, setName] = useState(location.name);
  const [address, setAddress] = useState(location.address);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const queryClient = useQueryClient();
  const { business } = useBusinessAuth();

  // Update form when location changes
  useEffect(() => {
    if (location) {
      setName(location.name);
      setAddress(location.address);
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!name.trim() || !address.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Updating location:', location.id);
      
      const { error } = await supabase
        .from('business_locations')
        .update({
          name: name.trim(),
          address: address.trim(),
          updated_at: new Date().toISOString()
        })
        .eq('id', location.id);
      
      if (error) {
        console.error('Error updating location:', error);
        throw new Error(error.message || 'Failed to update location');
      }
      
      console.log('Location updated successfully');
      toast.success('Location updated successfully');
      queryClient.invalidateQueries({ queryKey: ['business-locations', business?.id] });
      onClose();
    } catch (error: any) {
      console.error('Error updating location:', error);
      setError(error.message || 'Failed to update location');
      toast.error('Failed to update location');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Location</DialogTitle>
        </DialogHeader>
        
        {error && (
          <Alert variant="destructive" className="mt-2">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Location/Branch Name *</Label>
              <Input
                id="edit-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-address">Address *</Label>
              <Textarea
                id="edit-address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
                disabled={isSubmitting}
                required
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-orange-600 hover:bg-orange-700" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : 'Update Location'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditLocationForm;
