
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Menu, Settings, LogOut } from 'lucide-react';
import { useSidebar } from '@/hooks/useSidebar';

const DashboardHeader = () => {
  const { user, logout } = useAuth();
  const { toggleSidebar } = useSidebar();

  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center bg-gradient-to-r from-orange-50 to-orange-100 border-b border-orange-200 px-4 md:px-6 shadow-sm">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-primary hover:bg-orange-200"
          onClick={toggleSidebar}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
        
        <div className="flex-1 flex items-center gap-2">
          <img 
            src="/lovable-uploads/1df1545d-8aea-4a95-8a04-a342cff67de7.png" 
            alt="DeulDigital Logo"
            className="h-8 w-auto"
          />
          <span className="font-semibold text-lg text-primary hidden md:inline">DeulDigital POS</span>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-4">
        <div className="hidden md:block text-right mr-2">
          <p className="text-sm font-medium">{user?.username}</p>
          <p className="text-xs text-gray-500">Administrator</p>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-orange-200">
              <Avatar>
                <AvatarImage src="/placeholder.svg" alt={user?.username || ''} />
                <AvatarFallback className="bg-secondary text-primary">
                  {user ? getInitials(user.username) : 'U'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 border border-orange-200" align="end" forceMount>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-orange-200" />
            <DropdownMenuItem className="flex items-center gap-2 hover:bg-orange-100">
              <Settings className="w-4 h-4 text-orange-500" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2 hover:bg-orange-100" onClick={logout}>
              <LogOut className="w-4 h-4 text-orange-500" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default DashboardHeader;
