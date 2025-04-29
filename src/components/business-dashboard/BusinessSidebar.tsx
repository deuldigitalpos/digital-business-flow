
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSidebar } from '@/hooks/useSidebar';
import { useBusinessAuth } from '@/context/BusinessAuthContext';
import { LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { sidebarNavItems } from './sidebar-navigation';
import SidebarNavLink from './SidebarNavLink';
import SidebarCollapsibleSection from './SidebarCollapsibleSection';

const BusinessSidebar = () => {
  const { isSidebarOpen, toggleSidebar, closeSidebar } = useSidebar();
  const { businessUser, logout, hasPermission } = useBusinessAuth();
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({});

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Filter top-level sidebar items based on permissions
  const visibleNavItems = sidebarNavItems.filter(item => {
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
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-primary text-primary-foreground shadow-lg transition-transform duration-300 md:sticky md:top-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0 md:w-16"
        )}
      >
        <div className="flex h-16 items-center justify-between px-4 py-4 border-b border-primary-foreground/10">
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
            className="hidden md:flex text-primary-foreground hover:bg-primary-foreground/10"
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
                <SidebarCollapsibleSection
                  key={item.title}
                  item={item}
                  isOpen={!!openSections[item.title]}
                  onToggle={() => toggleSection(item.title)}
                  isSidebarOpen={isSidebarOpen}
                  onNavClick={closeSidebar}
                />
              ) : (
                <SidebarNavLink
                  key={item.title}
                  href={item.href || "#"}
                  icon={item.icon}
                  title={item.title}
                  permission={item.permission}
                  onClick={closeSidebar}
                  isSidebarOpen={isSidebarOpen}
                />
              )
            ))}
          </nav>
        </ScrollArea>

        <div className="mt-auto p-4 border-t border-primary-foreground/10">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start text-primary-foreground hover:bg-[#f99b23] hover:text-primary",
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
