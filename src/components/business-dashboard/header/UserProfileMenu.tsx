
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Settings } from 'lucide-react';
import { useBusinessAuth } from '@/context/BusinessAuthContext';
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

const UserProfileMenu = () => {
  const { businessUser, logout } = useBusinessAuth();
  const navigate = useNavigate();

  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  const handleLogout = () => {
    logout();
    navigate('/business-login');
  };

  return (
    <div className="flex items-center">
      <div className="hidden sm:block text-right mr-1 sm:mr-2">
        <p className="text-xs sm:text-sm font-medium">{businessUser?.first_name} {businessUser?.last_name}</p>
        <p className="text-xs text-gray-500 hidden sm:block">{businessUser?.role}</p>
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 sm:h-10 sm:w-10 rounded-full">
            <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
              <AvatarImage src="/placeholder.svg" alt={businessUser?.first_name || ''} />
              <AvatarFallback className="bg-orange-500 text-white text-xs sm:text-sm">
                {businessUser ? getInitials(businessUser.first_name) : 'U'}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="flex items-center gap-2 text-orange-700 focus:bg-orange-50 focus:text-orange-800">
            <Settings className="w-4 h-4" />
            <span>Profile Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center gap-2 text-orange-700 focus:bg-orange-50 focus:text-orange-800" onClick={handleLogout}>
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserProfileMenu;
