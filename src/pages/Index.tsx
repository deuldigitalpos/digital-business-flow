
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  BarChart,
  CreditCard,
  Package,
  Receipt,
  ShoppingCart,
  Tag,
  Users,
} from 'lucide-react';

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

const testimonials = [
  {
    quote: "DeulDigital POS transformed how we run our retail business. The inventory management is outstanding!",
    author: "Sarah M., Boutique Owner"
  },
  {
    quote: "My restaurant staff loves how easy it is to process orders and manage tables with this system.",
    author: "Michael J., Restaurant Manager"
  },
  {
    quote: "The reporting features help me make data-driven decisions that have increased our revenue by 20%.",
    author: "Alex P., Store Owner"
  }
];

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col">
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

      {/* Hero Section */}
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

      {/* Features Section */}
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
              <Card key={index} className="transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 md:py-24 bg-gray-50">
        <div className="container">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Why Choose DeulDigital POS?</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <Receipt className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Easy to Use</h3>
                    <p className="text-muted-foreground">Intuitive interface that requires minimal training for your staff</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Package className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Cloud-Based</h3>
                    <p className="text-muted-foreground">Access your business data anytime, anywhere, from any device</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <Users className="h-5 w-5 text-purple-600" />
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
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 mix-blend-overlay"></div>
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

      {/* Testimonials Section */}
      <section className="py-16 px-4 md:py-24 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Join thousands of businesses that trust DeulDigital POS to power their operations
            </p>
          </div>
          
          <div className="px-10">
            <Carousel>
              <CarouselContent>
                {testimonials.map((testimonial, index) => (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                    <Card className="h-full">
                      <CardContent className="pt-6">
                        <div className="text-xl font-serif mb-4">"</div>
                        <p className="mb-6 italic">{testimonial.quote}</p>
                        <p className="text-sm font-semibold">{testimonial.author}</p>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex justify-center gap-2 mt-4">
                <CarouselPrevious />
                <CarouselNext />
              </div>
            </Carousel>
          </div>
        </div>
      </section>

      {/* CTA Section */}
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
    </div>
  );
};

export default Index;
