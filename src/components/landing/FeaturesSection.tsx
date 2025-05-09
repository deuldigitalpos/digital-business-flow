
import React from 'react';
import FeatureCard from './FeatureCard';
import { BarChart, CreditCard, Package, Receipt, ShoppingCart, Tag, Users } from 'lucide-react';

const features = [
  {
    title: "Point of Sale",
    description: "Fast checkout process with an intuitive interface for your staff",
    icon: ShoppingCart
  },
  {
    title: "Inventory Management",
    description: "Track stock levels, set alerts, and manage products easily",
    icon: Package
  },
  {
    title: "Sales Analytics",
    description: "Detailed reports and insights to optimize your business",
    icon: BarChart
  },
  {
    title: "Customer Management",
    description: "Build relationships with customer profiles and purchase history",
    icon: Users
  },
  {
    title: "Payment Processing",
    description: "Accept multiple payment methods securely and efficiently",
    icon: CreditCard
  },
  {
    title: "Discounts & Promotions",
    description: "Create and manage special offers to boost sales",
    icon: Tag
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-16 px-4 md:py-24 bg-white">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Powerful Features for Every Business</h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            Everything you need to run and grow your business in one intuitive platform
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index} 
              title={feature.title} 
              description={feature.description} 
              icon={feature.icon} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
