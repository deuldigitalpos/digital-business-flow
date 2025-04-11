
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Business } from '@/types/business';
import { isBusinessActive } from '@/utils/business';

interface BusinessDetailsProps {
  business: Business;
}

const BusinessDetails: React.FC<BusinessDetailsProps> = ({ business }) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Business Details</CardTitle>
        <CardDescription>Details for {business.business_name}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Business Name</h3>
            <p className="text-base">{business.business_name}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Country</h3>
            <p className="text-base">{business.country}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Currency</h3>
            <p className="text-base">{business.currency}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Website</h3>
            <p className="text-base">{business.website || '-'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Contact Number</h3>
            <p className="text-base">{business.contact_number || '-'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
            <p className={`text-base ${isBusinessActive(business) ? 'text-green-600' : 'text-red-600'}`}>
              {isBusinessActive(business) ? 'Active' : 'Inactive'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BusinessDetails;
