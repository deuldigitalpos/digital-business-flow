
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const CtaSection = () => {
  return (
    <section className="py-16 px-4 md:py-24 bg-gradient-to-r from-orange-600 to-orange-500 text-white">
      <div className="container text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Streamline Your Business?</h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
          Join thousands of businesses already using DeulDigital POS to increase efficiency and boost profits
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" variant="default" asChild className="min-w-[180px] bg-white text-orange-600 hover:bg-orange-50">
            <Link to="/business-login">Get Started</Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="min-w-[180px] bg-transparent text-white border-white hover:bg-orange-600/30">
            <Link to="/login">Request Demo</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
