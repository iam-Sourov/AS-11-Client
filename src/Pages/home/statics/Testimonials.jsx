import React from 'react';
import { Star, Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Sarah Jenkins",
    role: "Book Club Lead",
    img: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    text: "The delivery speed is unmatched. I ordered a set for my book club and they arrived in pristine condition within 24 hours.",
    rating: 5
  },
  {
    name: "Michael Chen",
    role: "Student",
    img: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    text: "Finally, a platform that covers rural districts! I got my engineering textbooks delivered to my hometown without any hassle.",
    rating: 5
  },
  {
    name: "Emma Wilson",
    role: "Fiction Lover",
    img: "https://i.pravatar.cc/150?u=a04258114e29026302d",
    text: "The curated collection is amazing. I found rare editions here that weren't available on any other major e-commerce site.",
    rating: 4
  }
];

const Testimonials = () => {
  return (
    <section className="p-2">
      <div className="relative w-full overflow-hidden rounded-3xl bg-zinc-900 text-white shadow-xl">
        <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl" />
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mt-6 tracking-tight">Community Voices</h2>
          <p className="text-muted-foreground mt-2">What our 50,000+ happy readers are saying</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6">
          {testimonials.map((review, i) => (
            <Card key={i} className="relative w-full overflow-hidden rounded-3xl bg-zinc-900 text-white shadow-xl border-none hover:shadow-md transition-shadow">
              <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
              <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl" />
              <CardContent className="pt-12 px-8 pb-8">
                <div className="absolute top-6 left-8">
                  <Quote className="h-8 w-8  fill-primary/10 rotate-180" />
                </div>
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`}
                    />
                  ))}
                </div>
                <p className=" leading-relaxed mb-8 relative z-10">
                  "{review.text}"
                </p>
                <div className="flex items-center gap-4 border-t pt-6">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={review.img} />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-sm">{review.name}</h4>
                    <p className="text-xs ">{review.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;