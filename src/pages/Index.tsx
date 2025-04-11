
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-100 py-4 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/1df1545d-8aea-4a95-8a04-a342cff67de7.png" 
              alt="DeulDigital Logo" 
              className="h-10 w-auto" 
            />
            <span className="text-xl font-bold text-primary">DeulDigital POS</span>
          </div>
          
          <Button 
            onClick={() => navigate('/login')}
            className="bg-primary hover:bg-primary/90 flex items-center gap-2"
          >
            <LogIn className="h-4 w-4" />
            Login / Signup
          </Button>
        </div>
      </header>

      <main className="flex-1">
        <section className="bg-gradient-to-b from-gray-50 to-white py-20 px-6">
          <div className="container mx-auto text-center max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-primary">
              DeulDigital POS
            </h1>
            <p className="text-lg md:text-xl mb-8 text-gray-600">
              A powerful, all-in-one point-of-sale system designed to streamline business operations
            </p>
            <Button 
              onClick={() => navigate('/login')}
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground text-lg px-8 py-6 h-auto"
              size="lg"
            >
              Access Dashboard
            </Button>
          </div>
        </section>
        
        <section className="py-16 px-6">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold mb-3">Sales Management</h3>
                <p className="text-gray-600">
                  Track total, net, and categorized sales with powerful analytics and reporting tools.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold mb-3">Inventory Control</h3>
                <p className="text-gray-600">
                  Get notified when stock levels are low and stay ahead of expiring products.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold mb-3">Financial Management</h3>
                <p className="text-gray-600">
                  Track outstanding payments and monitor business expenses in real time.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-primary text-primary-foreground py-8 px-6">
        <div className="container mx-auto text-center">
          <p>© 2025 DeulDigital POS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
