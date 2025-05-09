
import React from 'react';
import { Receipt, Package, Users } from 'lucide-react';

const BenefitsSection = () => {
  return (
    <section className="py-16 px-4 md:py-24 bg-orange-50">
      <div className="container">
        <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Why Choose <span className="text-orange-500">DeulDigital POS</span>?</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                  <Receipt className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Easy to Use</h3>
                  <p className="text-muted-foreground">Intuitive interface that requires minimal training for your staff</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                  <Package className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Cloud-Based</h3>
                  <p className="text-muted-foreground">Access your business data anytime, anywhere, from any device</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                  <Users className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Exceptional Support</h3>
                  <p className="text-muted-foreground">Dedicated team to help you set up and get the most out of your system</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-10 lg:mt-0">
            <div className="relative rounded-xl overflow-hidden shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-orange-300/20 mix-blend-overlay"></div>
              <img 
                src="/lovable-uploads/213a37fc-f8db-4c01-ac6b-7543f8087abf.png" 
                alt="POS System Interface"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
