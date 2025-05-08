
import React from 'react';
import { Mail, PhoneCall } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const BusinessDeactivationOverlay: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full bg-white shadow-xl">
        <CardHeader className="bg-orange-50">
          <CardTitle className="text-xl text-orange-700">Account Deactivated</CardTitle>
          <CardDescription className="text-orange-900/70">Your business account is currently inactive</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 pb-4">
          <div className="space-y-4">
            <p className="text-center font-medium text-lg">
              Please make payment and contact DeulDigital to activate your account.
            </p>
            <div className="flex flex-col gap-3 mt-6">
              <div className="flex items-center gap-2 text-sm">
                <PhoneCall className="h-4 w-4 text-orange-500" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-orange-500" />
                <span>support@deuldigital.com</span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-orange-50/50 flex justify-center">
          <p className="text-xs text-center text-muted-foreground">
            Your business dashboard is view-only until your account is reactivated
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default BusinessDeactivationOverlay;
