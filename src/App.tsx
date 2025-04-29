
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { BusinessAuthProvider } from "@/context/BusinessAuthContext";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import BusinessLogin from "./pages/BusinessLogin";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import UserManagement from "./pages/UserManagement";
import BusinessManagement from "./pages/BusinessManagement";
import PackageManagement from "./pages/PackageManagement";
import DiscountManagement from "./pages/DiscountManagement";
import ReferralManagement from "./pages/ReferralManagement";
import Settings from "./pages/Settings";
import BusinessDashboard from "./pages/BusinessDashboard";
import BusinessRoles from "./pages/BusinessRoles";
import BusinessLocations from "./pages/BusinessLocations";
import BusinessUsers from "./pages/BusinessUsers";

// Layout
import DashboardLayout from "./components/DashboardLayout";
import BusinessDashboardLayout from "./components/BusinessDashboardLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <BusinessAuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/business-login" element={<BusinessLogin />} />
              
              {/* Admin Dashboard Routes */}
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="business" element={<BusinessManagement />} />
                <Route path="packages" element={<PackageManagement />} />
                <Route path="discounts" element={<DiscountManagement />} />
                <Route path="referrals" element={<ReferralManagement />} />
                <Route path="settings" element={<Settings />} />
              </Route>

              {/* Business Dashboard Routes */}
              <Route path="/business-dashboard" element={<BusinessDashboardLayout />}>
                <Route index element={<BusinessDashboard />} />
                <Route path="roles" element={<BusinessRoles />} />
                <Route path="locations" element={<BusinessLocations />} />
                <Route path="users" element={<BusinessUsers />} />
                {/* More business dashboard routes will be added here as needed */}
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BusinessAuthProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
