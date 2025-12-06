import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const NewsLetter = () => {
  return (
    <section className="w-full flex flex-col items-center text-center gap-4 py-12 bg-linear-to-br from-purple-600 to-indigo-600 text-white rounded-2xl">
      <h2 className="text-3xl font-bold">Stay Updated</h2>
      <p className="max-w-xl text-sm opacity-90">Subscribe to our newsletter and never miss new arrivals or special discounts.</p>
      <div className="flex gap-2 mt-4">
        <Input className="px-4 py-2 rounded-xl" placeholder="Enter your email" />
        <Button variant="secondary">Subscribe</Button>
      </div>
    </section>
  );
};

export default NewsLetter;