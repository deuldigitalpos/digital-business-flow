
import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSidebar } from '@/hooks/useSidebar';
import { useBusinessAuth } from '@/context/BusinessAuthContext';
import { 
  Users, 
  LayoutDashboard, 
  Package,
  ShoppingCart,
  Settings,
  LogOut,
  ChevronLeft,
  UserCog
} from 'lucide-react';

type SidebarNavItem = {
  title: string;
  icon: React.ElementType;
  href: string;
  end?: boolean;
};

const navItems: SidebarNavItem[] = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/business-dashboard",
    end: true
  },
  {
    title: "User Management",
    icon: Users,
    href: "/business-dashboard/users",
  },
  {
    title: "Roles",
    icon: UserCog,
    href: "/business-dashboard/roles",
  },
  {
    title: "Products",
    icon: Package,
    href: "/business-dashboard/products",
  },
  {
    title: "POS",
    icon: ShoppingCart,
    href: "/business-dashboard/pos",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/business-dashboard/settings",
  },
];

const BusinessSidebar = () => {
  const { isSidebarOpen, toggleSidebar, closeSidebar } = useSidebar();
  const { logout, business } = useBusinessAuth();

  return (
    <>
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={closeSidebar}
        />
      )}
      
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-primary text-primary-foreground shadow-lg transition-transform duration-300 md:sticky md:top-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0 md:w-16"
        )}
      >
        <div className="flex h-16 items-center justify-between px-4 py-4 border-b border-primary-foreground/10">
          <div className={cn("flex items-center gap-2", !isSidebarOpen && "md:hidden")}>
            {business?.logo_url ? (
              <img
                src={business.logo_url}
                alt={`${business.business_name} Logo`}
                className="h-8 w-auto"
              />
            ) : (
              <div className="h-8 w-8 rounded bg-primary-foreground/20 flex items-center justify-center text-primary-foreground font-bold">
                {business?.business_name?.[0] || 'B'}
              </div>
            )}
            <span className="font-bold text-lg">
              {business?.business_name || 'Business'}
            </span>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className="hidden md:flex text-primary-foreground hover:bg-primary-foreground/10"
          >
            <ChevronLeft 
              className={cn(
                "h-5 w-5 transition-transform", 
                !isSidebarOpen && "md:rotate-180"
              )} 
            />
          </Button>
        </div>
        
        <ScrollArea className="flex-1 py-4">
          <nav className="grid gap-1 px-2">
            {navItems.map((item, index) => (
              <NavLink
                key={index}
                to={item.href}
                end={item.end}
                onClick={closeSidebar}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-primary-foreground hover:bg-primary-foreground/20 transition-colors",
                    isActive && "bg-primary-foreground/10 font-medium"
                  )
                }
              >
                <item.icon className="h-5 w-5 shrink-0" />
                <span className={cn("text-sm", !isSidebarOpen && "md:hidden")}>
                  {item.title}
                </span>
              </NavLink>
            ))}
          </nav>
        </ScrollArea>

        <div className="mt-auto p-4 border-t border-primary-foreground/10">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start text-primary-foreground hover:bg-primary-foreground/20",
              !isSidebarOpen && "md:justify-center"
            )}
            onClick={logout}
          >
            <LogOut className="h-5 w-5 mr-2" />
            <span className={cn(!isSidebarOpen && "md:hidden")}>Logout</span>
          </Button>
        </div>
      </div>
    </>
  );
};

export default BusinessSidebar;
