
import React from 'react';

const Footer = () => {
  return (
    <footer className="border-t p-6 text-center text-sm text-muted-foreground bg-gray-50">
      <div className="container">
        <div className="md:flex md:justify-between md:items-center">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-4 md:mb-0">
            <img src="/lovable-uploads/1df1545d-8aea-4a95-8a04-a342cff67de7.png" alt="DeulDigital Logo" className="h-6 w-auto" />
            <span className="font-medium">DeulDigital POS</span>
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
