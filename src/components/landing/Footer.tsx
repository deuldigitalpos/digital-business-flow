
import React from 'react';

const Footer = () => {
  return (
    <footer className="border-t p-6 text-center text-sm text-muted-foreground bg-orange-50">
      <div className="container">
        <div className="md:flex md:justify-between md:items-center">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-4 md:mb-0">
            <img src="/lovable-uploads/f3b18ce4-64cf-4c97-97d0-cfc5efae804e.png" alt="DeulDigital Logo" className="h-6 w-auto" />
            <span className="font-medium">DeulDigital <span className="text-orange-500">POS</span></span>
          </div>
          <div>
            &copy; {new Date().getFullYear()} DeulDigital POS. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
