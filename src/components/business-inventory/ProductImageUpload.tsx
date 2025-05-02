
import React, { useCallback, useState } from "react";
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UploadIcon, XIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ProductImageUploadProps {
  value: string | null;
  onChange: (url: string | null) => void;
  businessId: string;
}

const ProductImageUpload: React.FC<ProductImageUploadProps> = ({ value, onChange, businessId }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Reset state
    setUploadError(null);
    setIsUploading(true);
    
    try {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error("File size too large (max 5MB)");
      }
      
      // Check file type
      if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) {
        throw new Error("Invalid file type. Please upload an image (JPG, PNG, WEBP, GIF)");
      }
      
      // Create a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${businessId}/${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      
      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(fileName, file);
      
      if (error) throw error;
      
      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(data.path);
      
      onChange(publicUrlData.publicUrl);
    } catch (error: any) {
      console.error('Error uploading image:', error);
      setUploadError(error.message || 'Failed to upload image');
      onChange(null);
    } finally {
      setIsUploading(false);
    }
  }, [onChange, businessId]);

  const handleRemoveImage = useCallback(() => {
    onChange(null);
  }, [onChange]);

  return (
    <div className="space-y-4">
      {value ? (
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20 rounded-md border">
            <AvatarImage src={value} alt="Product image" />
            <AvatarFallback className="rounded-md">IMG</AvatarFallback>
          </Avatar>
          
          <div className="flex flex-col space-y-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={handleRemoveImage}
                  >
                    <XIcon className="h-4 w-4 mr-2" /> Remove Image
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Remove product image</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      ) : (
        <>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Input
              type="file"
              id="product-image"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="hidden"
            />
            <label
              htmlFor="product-image"
              className={`flex h-32 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed text-sm transition-colors ${
                isUploading ? "opacity-50" : "hover:bg-muted/50"
              }`}
            >
              <div className="flex flex-col items-center justify-center space-y-2 p-4 text-center">
                <UploadIcon className="h-8 w-8 text-muted-foreground" />
                <div className="text-xs text-muted-foreground">
                  {isUploading ? "Uploading..." : "Click to upload product image"}
                </div>
                <div className="text-xs text-muted-foreground">
                  JPG, PNG, WEBP or GIF (max 5MB)
                </div>
              </div>
            </label>
          </div>

          {uploadError && (
            <Alert variant="destructive">
              <AlertDescription>{uploadError}</AlertDescription>
            </Alert>
          )}
        </>
      )}
    </div>
  );
};

export default ProductImageUpload;
