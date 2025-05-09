
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Header = () => {
  return (
    <header className="flex h-16 items-center border-b px-4 md:px-6 bg-white">
      <div className="flex gap-2 items-center">
        <img src="/lovable-uploads/f3b18ce4-64cf-4c97-97d0-cfc5efae804e.png" alt="DeulDigital Logo" className="h-8 w-auto" />
        <span className="text-xl font-bold">DeulDigital <span className="text-orange-500">POS</span></span>
      </div>
      <nav className="ml-auto flex gap-2">
        <Button variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-50" asChild>
          <Link to="/login">Admin Login</Link>
        </Button>
        <Button variant="default" className="bg-orange-500 hover:bg-orange-600" asChild>
          <Link to="/business-login">Business Login</Link>
        </Button>
      </nav>
    </header>
  );
};

export default Header;
