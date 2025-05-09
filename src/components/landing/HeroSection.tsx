
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-b from-white to-gray-50 px-4 py-16 md:py-24">
      <div className="container grid items-center gap-6 md:gap-10 lg:grid-cols-2">
        <div className="space-y-6">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl/none">
            Transform Your Business with DeulDigital POS
          </h1>
          <p className="max-w-[600px] text-muted-foreground text-lg md:text-xl/relaxed">
            A complete point of sale system designed for businesses of all sizes. Streamline operations, boost sales, and delight customers with our powerful yet simple solution.
          </p>
          <div className="flex flex-col gap-3 min-[400px]:flex-row">
            <Button size="lg" asChild>
              <Link to="/business-login">Start Using POS Now</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/login">Admin Dashboard</Link>
            </Button>
          </div>
        </div>
        <div className="relative flex justify-center">
          <div className="absolute -z-10 h-full w-full bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl blur-2xl opacity-70"></div>
          <img 
            alt="Dashboard Preview" 
            className="rounded-lg object-cover object-center shadow-xl sm:w-full" 
            height={500} 
            width={700} 
            src="/lovable-uploads/213a37fc-f8db-4c01-ac6b-7543f8087abf.png" 
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
