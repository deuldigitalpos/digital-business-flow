
import React from 'react';
import TestimonialCard from './TestimonialCard';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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

const TestimonialsSection = () => {
  return (
    <section className="py-16 px-4 md:py-24 bg-white">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What Our <span className="text-orange-500">Customers Say</span></h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Join thousands of businesses that trust DeulDigital POS to power their operations
          </p>
        </div>
        
        <div className="px-10">
          <Carousel>
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <TestimonialCard 
                    quote={testimonial.quote} 
                    author={testimonial.author} 
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center gap-2 mt-4">
              <CarouselPrevious className="border-orange-300 text-orange-500 hover:bg-orange-50" />
              <CarouselNext className="border-orange-300 text-orange-500 hover:bg-orange-50" />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
