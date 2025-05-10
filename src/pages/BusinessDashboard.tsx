
import React, { useEffect, useState, useCallback } from 'react';
import { useBusinessAuth } from '@/context/BusinessAuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  Wallet, 
  TrendingUp, 
  TrendingDown,
  Loader2,
  Clock
} from 'lucide-react';
import { isBusinessActive } from '@/utils/business';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { useClockInOut } from '@/hooks/useClockInOut';

const BusinessDashboard = () => {
  const { businessUser, business, isLoading } = useBusinessAuth();
  const { openClockModal, isUserClockedIn } = useClockInOut();
  const [clockInTime, setClockInTime] = useState<Date | null>(null);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [elapsedTime, setElapsedTime] = useState<string>("00:00:00");

  const isActive = business ? isBusinessActive(business) : false;

  // Memoize the check for clock-in status to prevent re-renders
  const checkClockInStatus = useCallback(() => {
    const savedClockInTime = localStorage.getItem('clockInTime');
    if (savedClockInTime) {
      setClockInTime(new Date(savedClockInTime));
    } else {
      setClockInTime(null);
    }
  }, []);

  useEffect(() => {
    // Check clock-in status initially
    checkClockInStatus();
    
    // Setup interval for time updates
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      
      // Update elapsed time if clocked in
      const isClockedInNow = localStorage.getItem('isClockedIn') === 'true';
      const savedClockInTime = localStorage.getItem('clockInTime');
      
      if (isClockedInNow && savedClockInTime) {
        const clockInTimeDate = new Date(savedClockInTime);
        const diff = Math.floor((now.getTime() - clockInTimeDate.getTime()) / 1000);
        const hours = Math.floor(diff / 3600).toString().padStart(2, "0");
        const minutes = Math.floor((diff % 3600) / 60).toString().padStart(2, "0");
        const seconds = (diff % 60).toString().padStart(2, "0");
        setElapsedTime(`${hours}:${minutes}:${seconds}`);
      }
    }, 1000);
    
    // Setup storage event listener to detect changes in localStorage
    const handleStorageChange = () => {
      checkClockInStatus();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Clean up
    return () => {
      clearInterval(timer);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [checkClockInStatus]);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Welcome to {business?.business_name || 'Your Business'}!
        </h1>
        <p className="text-muted-foreground">
          Hello, {businessUser?.first_name} {businessUser?.last_name}. Here's your business dashboard.
        </p>
        {!isActive && (
          <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
            <p className="text-sm">
              Your business account is currently inactive. Please contact system administrator to activate it.
            </p>
          </div>
        )}
      </div>
      
      {/* Clock In/Out Status Card */}
      {isUserClockedIn() && clockInTime && (
        <Card className="border-t-4 border-t-orange-400">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Current Work Session</CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs bg-orange-100 hover:bg-orange-200 text-orange-800 border-orange-200"
              onClick={openClockModal}
            >
              Clock Out
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="bg-orange-100 p-2 sm:p-3 rounded-full">
                <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Clocked in at {clockInTime ? format(clockInTime, "hh:mm a") : "--"}
                </p>
                <p className="font-semibold text-base sm:text-lg">
                  {elapsedTime} <span className="text-xs text-muted-foreground">elapsed</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="border-t-4 border-t-orange-500">
          <CardHeader className="flex flex-row items-center justify-between p-3 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Sales</CardTitle>
            <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 text-orange-500" />
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:pt-0">
            <div className="text-lg sm:text-2xl font-bold">$24,435</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <span className="text-green-500 flex items-center mr-1">
                <TrendingUp className="h-3 w-3 mr-0.5" />
                12%
              </span>
              from last month
            </p>
          </CardContent>
        </Card>
        <Card className="border-t-4 border-t-orange-400">
          <CardHeader className="flex flex-row items-center justify-between p-3 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Inventory</CardTitle>
            <Package className="h-3 w-3 sm:h-4 sm:w-4 text-orange-400" />
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:pt-0">
            <div className="text-lg sm:text-2xl font-bold">$13,120</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <span className="text-green-500 flex items-center mr-1">
                <TrendingUp className="h-3 w-3 mr-0.5" />
                4%
              </span>
              from last month
            </p>
          </CardContent>
        </Card>
        <Card className="border-t-4 border-t-orange-300">
          <CardHeader className="flex flex-row items-center justify-between p-3 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Customers</CardTitle>
            <Users className="h-3 w-3 sm:h-4 sm:w-4 text-orange-300" />
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:pt-0">
            <div className="text-lg sm:text-2xl font-bold">134</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <span className="text-green-500 flex items-center mr-1">
                <TrendingUp className="h-3 w-3 mr-0.5" />
                8%
              </span>
              from last month
            </p>
          </CardContent>
        </Card>
        <Card className="border-t-4 border-t-orange-200">
          <CardHeader className="flex flex-row items-center justify-between p-3 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Expenses</CardTitle>
            <Wallet className="h-3 w-3 sm:h-4 sm:w-4 text-orange-200" />
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:pt-0">
            <div className="text-lg sm:text-2xl font-bold">$6,240</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <span className="text-red-500 flex items-center mr-1">
                <TrendingDown className="h-3 w-3 mr-0.5" />
                3%
              </span>
              from last month
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base sm:text-lg">Recent Orders</CardTitle>
            <CardDescription>Latest sales orders placed</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs sm:text-sm text-center py-6 sm:py-8 text-muted-foreground">
              No recent orders to display
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base sm:text-lg">Low Stock Items</CardTitle>
            <CardDescription>Products that need reordering</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs sm:text-sm text-center py-6 sm:py-8 text-muted-foreground">
              No low stock items to display
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Skeleton loader component for better loading experience
const DashboardSkeleton = () => {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-9 w-64 mb-2" />
        <Skeleton className="h-5 w-96" />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border-t-4 border-t-orange-400">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-7 w-28 mb-2" />
              <Skeleton className="h-4 w-36" />
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        {[1, 2].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-32 mb-1" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent>
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-orange-400" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BusinessDashboard;
