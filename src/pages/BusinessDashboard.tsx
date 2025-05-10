
import React from 'react';
import { useBusinessAuth } from '@/context/BusinessAuthContext';
import { isBusinessActive } from '@/utils/business';
import { useClockInOut } from '@/hooks/useClockInOut';
import { useDashboardClock } from '@/hooks/useDashboardClock';

// Import refactored components
import DashboardHeader from '@/components/business-dashboard/dashboard/DashboardHeader';
import CurrentWorkSession from '@/components/business-dashboard/dashboard/CurrentWorkSession';
import StatCardsGrid from '@/components/business-dashboard/dashboard/StatCardsGrid';
import RecentActivityCards from '@/components/business-dashboard/dashboard/RecentActivityCards';
import DashboardSkeleton from '@/components/business-dashboard/dashboard/DashboardSkeleton';

const BusinessDashboard = () => {
  const { businessUser, business, isLoading } = useBusinessAuth();
  const { openClockModal, isUserClockedIn } = useClockInOut();
  const { clockInTime, elapsedTime } = useDashboardClock();

  // Check if business is active
  const isActive = business ? isBusinessActive(business) : false;

  // Show skeleton loader while loading
  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Dashboard Header */}
      <DashboardHeader 
        businessName={business?.business_name} 
        firstName={businessUser?.first_name}
        lastName={businessUser?.last_name}
        isActive={isActive}
      />
      
      {/* Clock In/Out Status Card */}
      {isUserClockedIn() && clockInTime && (
        <CurrentWorkSession
          clockInTime={clockInTime}
          elapsedTime={elapsedTime}
          openClockModal={openClockModal}
        />
      )}
      
      {/* Statistics Cards */}
      <StatCardsGrid />
      
      {/* Recent Activity Cards */}
      <RecentActivityCards />
    </div>
  );
};

export default BusinessDashboard;
