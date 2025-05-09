
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface TestimonialCardProps {
  quote: string;
  author: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ quote, author }) => {
  return (
    <Card className="h-full border-orange-100 hover:border-orange-200 transition-all">
      <CardContent className="pt-6">
        <div className="text-xl font-serif mb-4 text-orange-500">"</div>
        <p className="mb-6 italic">{quote}</p>
        <p className="text-sm font-semibold text-orange-700">{author}</p>
      </CardContent>
    </Card>
  );
};

export default TestimonialCard;
