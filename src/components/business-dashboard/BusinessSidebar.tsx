
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSidebar } from '@/hooks/useSidebar';
import { useBusinessAuth } from '@/context/BusinessAuthContext';
import { LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { sidebarNavigation } from './sidebar-navigation';
import { NavLink } from 'react-router-dom';

const BusinessSidebar = () => {
  const { isSidebarOpen, toggleSidebar, closeSidebar } = useSidebar();
  const { businessUser, logout, hasPermission } = useBusinessAuth();

  // Filter sidebar items based on permissions
  const visibleNavItems = sidebarNavigation.flatMap(group => group.items).filter(item => {
    if (item.permission && !hasPermission(item.permission)) {
      return false;
    }
    
    // For items with children, include if at least one child is accessible
    if (item.children) {
      const hasVisibleChildren = item.children.some(child => 
        !child.permission || hasPermission(child.permission)
      );
      return hasVisibleChildren;
    }
    
    return true;
  });

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
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-[#1A1F2C] text-white shadow-lg transition-transform duration-300 md:sticky md:top-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0 md:w-16"
        )}
      >
        <div className="flex h-16 items-center justify-between px-4 py-4 border-b border-white/10">
          <div className={cn("flex items-center gap-2", !isSidebarOpen && "md:hidden")}>
            <img 
              src="/lovable-uploads/1df1545d-8aea-4a95-8a04-a342cff67de7.png" 
              alt="Logo"
              className="h-8 w-auto"
            />
            <span className="font-bold text-lg">DeulDigital</span>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className="hidden md:flex text-white hover:bg-white/10"
          >
            {isSidebarOpen ? (
              <ChevronLeft className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </Button>
        </div>
        
        <ScrollArea className="flex-1 py-4">
          <nav className="grid gap-1 px-2">
            {visibleNavItems.map((item) => (
              item.children ? (
                // Render flat menu items instead of collapsible sections
                item.children.map(child => {
                  if (child.permission && !hasPermission(child.permission)) {
                    return null;
                  }
                  
                  return (
                    <NavLink
                      key={`${item.title}-${child.title}`}
                      to={child.href || "#"}
                      onClick={closeSidebar}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-white hover:bg-[#f99b23] hover:text-[#1A1F2C] transition-colors",
                          isActive && "bg-white/10 font-medium"
                        )
                      }
                    >
                      {child.icon && <child.icon className="h-5 w-5 shrink-0" />}
                      <span className={cn("text-sm", !isSidebarOpen && "md:hidden")}>
                        {child.title}
                      </span>
                    </NavLink>
                  );
                })
              ) : (
                <NavLink
                  key={item.title}
                  to={item.href || "#"}
                  onClick={closeSidebar}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-white hover:bg-[#f99b23] hover:text-[#1A1F2C] transition-colors",
                      isActive && "bg-white/10 font-medium"
                    )
                  }
                >
                  {item.icon && <item.icon className="h-5 w-5 shrink-0" />}
                  <span className={cn("text-sm", !isSidebarOpen && "md:hidden")}>
                    {item.title}
                  </span>
                </NavLink>
              )
            ))}
          </nav>
        </ScrollArea>

        <div className="mt-auto p-4 border-t border-white/10">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start text-white hover:bg-[#f99b23] hover:text-[#1A1F2C]",
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
