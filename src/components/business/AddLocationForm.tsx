
import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { useBusinessAuth } from '@/context/BusinessAuthContext';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface AddLocationFormProps {
  isOpen: boolean;
  onClose: () => void;
  businessId: string;
}

const AddLocationForm: React.FC<AddLocationFormProps> = ({ 
  isOpen, 
  onClose,
  businessId
}) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const queryClient = useQueryClient();
  const { businessUser } = useBusinessAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!name.trim() || !address.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!businessId) {
      toast.error('Business ID is required');
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Adding location with business ID:', businessId);
      
      // Make sure we're using the correct business ID from props
      const { data, error: insertError } = await supabase
        .from('business_locations')
        .insert({
          business_id: businessId,
          name: name.trim(),
          address: address.trim(),
          status: 'active', // Explicitly set status
          updated_at: new Date().toISOString() // Ensure timestamp is set
        })
        .select();
      
      if (insertError) {
        console.error('Error inserting location:', insertError);
        throw insertError;
      }
      
      console.log('Location added successfully:', data);
      toast.success('Location added successfully');
      queryClient.invalidateQueries({ queryKey: ['business-locations', businessId] });
      
      // Reset form
      setName('');
      setAddress('');
      onClose();
    } catch (error: any) {
      console.error('Error adding location:', error);
      setError(error.message || 'Failed to add location');
      toast.error('Failed to add location');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Location</DialogTitle>
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
              <Label htmlFor="name">Location/Branch Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Main Branch"
                disabled={isSubmitting}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="address">Address *</Label>
              <Textarea
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="1234 Main St, City, Country"
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
                  Adding...
                </>
              ) : 'Add Location'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddLocationForm;
