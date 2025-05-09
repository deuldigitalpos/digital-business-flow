
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const CtaSection = () => {
  return (
    <section className="py-16 px-4 md:py-24 bg-primary text-primary-foreground">
      <div className="container text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Streamline Your Business?</h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
          Join thousands of businesses already using DeulDigital POS to increase efficiency and boost profits
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" variant="secondary" asChild className="min-w-[180px]">
            <Link to="/business-login">Get Started</Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="min-w-[180px] bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground/10">
            <Link to="/login">Request Demo</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
