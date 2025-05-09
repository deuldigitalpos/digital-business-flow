
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Header = () => {
  return (
    <header className="flex h-16 items-center border-b px-4 md:px-6">
      <div className="flex gap-2 items-center">
        <img src="/lovable-uploads/1df1545d-8aea-4a95-8a04-a342cff67de7.png" alt="DeulDigital Logo" className="h-8 w-auto" />
        <span className="text-xl font-bold">DeulDigital POS</span>
      </div>
      <nav className="ml-auto flex gap-2">
        <Button variant="outline" asChild>
          <Link to="/login">Admin Login</Link>
        </Button>
        <Button variant="default" asChild>
          <Link to="/business-login">Business Login</Link>
        </Button>
      </nav>
    </header>
  );
};

export default Header;
