
import React from 'react';
import { cn } from '@/lib/utils';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { SidebarNavItem } from './sidebar-navigation';
import { useBusinessAuth } from '@/context/BusinessAuthContext';

interface SidebarCollapsibleSectionProps {
  item: SidebarNavItem;
  isOpen: boolean;
  onToggle: () => void;
  isSidebarOpen: boolean;
  onNavClick: () => void;
}

const SidebarCollapsibleSection: React.FC<SidebarCollapsibleSectionProps> = ({
  item,
  isOpen,
  onToggle,
  isSidebarOpen,
  onNavClick
}) => {
  const { hasPermission } = useBusinessAuth();
  
  // Filter child items based on permissions
  const visibleChildren = item.children?.filter(child => {
    // Extract permission string from href if it exists
    const permission = child.permission || child.href?.split('/').pop();
    return !permission || hasPermission(permission);
  });
  
  // Don't render the section at all if there are no visible children
  if (visibleChildren && visibleChildren.length === 0) {
    return null;
  }
  
  return (
    <Collapsible 
      open={isOpen}
      onOpenChange={onToggle}
      className="w-full"
    >
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-between text-sm text-primary-foreground hover:bg-[#f99b23] hover:text-primary",
            !isSidebarOpen && "md:justify-center md:p-2"
          )}
        >
          <div className="flex items-center gap-3">
            <item.icon className="h-5 w-5" />
            {(isSidebarOpen || !item.children) && (
              <span className={cn(!isSidebarOpen && "md:hidden")}>
                {item.title}
              </span>
            )}
          </div>
          {(isSidebarOpen || !item.children) && (
            <ChevronDown 
              className={cn(
                "h-4 w-4 shrink-0 transition-transform duration-200",
                isOpen && "rotate-180",
                !isSidebarOpen && "md:hidden"
              )}
            />
          )}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className={cn(!isSidebarOpen && "md:hidden")}>
        <div className="ml-6 mt-1 flex flex-col gap-1 border-l-2 border-primary-foreground/10 pl-2">
          {visibleChildren?.map((child) => (
            <NavLink
              key={child.href}
              to={child.href || "#"}
              onClick={onNavClick}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-primary-foreground hover:bg-[#f99b23] hover:text-primary transition-colors",
                  isActive && "bg-primary-foreground/10 font-medium"
                )
              }
            >
              <child.icon className="h-4 w-4 shrink-0" />
              <span>{child.title}</span>
            </NavLink>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default SidebarCollapsibleSection;
