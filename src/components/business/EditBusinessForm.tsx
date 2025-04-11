
import React, { useState } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { countries } from '@/lib/countries';
import { currencies } from '@/lib/currencies';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  business_name: z.string().min(2, "Business name must be at least 2 characters."),
  currency: z.string().min(1, "Currency is required."),
  country: z.string().min(1, "Country is required."),
  website: z.string().url("Invalid website URL.").optional().or(z.literal('')),
  contact_number: z.string().optional(),
  logo: z.instanceof(File).optional().nullable(),
});

type FormValues = z.infer<typeof formSchema>;

interface Business {
  id: string;
  business_name: string;
  currency: string;
  country: string;
  website: string | null;
  logo_url: string | null;
  contact_number: string | null;
  created_at: string;
  updated_at: string;
}

interface EditBusinessFormProps {
  isOpen: boolean;
  onClose: () => void;
  business: Business;
}

const EditBusinessForm: React.FC<EditBusinessFormProps> = ({ isOpen, onClose, business }) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      business_name: business?.business_name || '',
      currency: business?.currency || '',
      country: business?.country || '',
      website: business?.website || '',
      contact_number: business?.contact_number || '',
      logo: null,
    }
  });

  // Reset form when business changes
  React.useEffect(() => {
    if (business) {
      form.reset({
        business_name: business.business_name || '',
        currency: business.currency || '',
        country: business.country || '',
        website: business.website || '',
        contact_number: business.contact_number || '',
        logo: null,
      });
    }
  }, [business, form]);

  const updateBusiness = useMutation({
    mutationFn: async (values: FormValues) => {
      let logo_url = business.logo_url;
      
      // Upload logo if provided
      if (values.logo) {
        setIsUploading(true);
        
        // Create a unique file name
        const fileExt = values.logo.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `${fileName}`;
        
        // Upload the file
        const { data: fileData, error: uploadError } = await supabase.storage
          .from('business-logos')
          .upload(filePath, values.logo);
        
        if (uploadError) {
          setIsUploading(false);
          throw uploadError;
        }
        
        // Get the public URL
        const { data: urlData } = supabase.storage
          .from('business-logos')
          .getPublicUrl(filePath);
          
        logo_url = urlData.publicUrl;
        setIsUploading(false);
      }
      
      // Update business data
      const { data, error } = await supabase
        .from('businessdetails')
        .update({
          business_name: values.business_name,
          currency: values.currency,
          country: values.country,
          website: values.website || null,
          contact_number: values.contact_number || null,
          logo_url: logo_url,
          updated_at: new Date().toISOString(),
        })
        .eq('id', business.id)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businesses'] });
      toast({
        title: "Business Updated",
        description: "Your business has been successfully updated."
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update business: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  const onSubmit = (values: FormValues) => {
    updateBusiness.mutate(values);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] md:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Edit Business</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="business_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter business name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-[200px]">
                        {currencies.map(currency => (
                          <SelectItem key={currency.code} value={currency.code}>
                            {currency.code} - {currency.name} ({currency.symbol})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-[200px]">
                        {countries.map(country => (
                          <SelectItem key={country.code} value={country.name}>
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="contact_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter contact number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="logo"
              render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>Business Logo</FormLabel>
                  {business?.logo_url && (
                    <div className="mb-2">
                      <img 
                        src={business.logo_url} 
                        alt="Current logo" 
                        className="h-16 w-auto object-contain rounded-md border"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Current logo</p>
                    </div>
                  )}
                  <FormControl>
                    <Input 
                      type="file" 
                      accept="image/*"
                      {...field}
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        onChange(file);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
              <Button 
                type="submit"
                disabled={updateBusiness.isPending || isUploading}
              >
                {(updateBusiness.isPending || isUploading) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Update Business
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditBusinessForm;
