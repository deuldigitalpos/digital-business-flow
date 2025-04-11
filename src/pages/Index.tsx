
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-16 items-center border-b px-4 md:px-6">
        <div className="flex gap-2 items-center">
          <img 
            src="/lovable-uploads/1df1545d-8aea-4a95-8a04-a342cff67de7.png" 
            alt="DeulDigital Logo" 
            className="h-8 w-auto" 
          />
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
      <main className="flex-1 px-4 py-12 md:py-24">
        <div className="container grid items-center gap-6 md:gap-10 lg:grid-cols-2">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
              DeulDigital POS System
            </h1>
            <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              A comprehensive point of sale system for businesses of all sizes. 
              Manage your inventory, sales, and customers with ease.
            </p>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild>
                <Link to="/business-login">Login to Your Business</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/login">Admin Login</Link>
              </Button>
            </div>
          </div>
          <div className="flex justify-center">
            <img
              alt="Dashboard Preview"
              className="rounded-lg object-cover object-center sm:w-full"
              height={400}
              src="/placeholder.svg"
              width={600}
            />
          </div>
        </div>
      </main>
      <footer className="border-t p-6 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} DeulDigital POS. All rights reserved.
      </footer>
    </div>
  );
};

export default Index;
