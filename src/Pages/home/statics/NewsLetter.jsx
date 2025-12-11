import React from 'react';
import { toast } from "sonner";
import { Mail, ArrowRight, BellRing } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const NewsLetter = () => {
  const handleSubscribe = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    if (email) {
      toast.success("Subscribed successfully!");
      e.target.reset();
    }
  };

  return (
    <section className="py-12 px-4 container mx-auto">
      <div className="relative w-full overflow-hidden rounded-3xl bg-zinc-900 text-white shadow-xl">
        <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl" />
        <div className="relative z-10 flex flex-col items-center justify-between gap-8 p-8 md:flex-row md:p-12 lg:gap-16">
          <div className="flex max-w-xl flex-col items-center text-center md:items-start md:text-left space-y-4">
            <div className="inline-flex items-center justify-center rounded-xl bg-white/10 p-3 shadow-inner ring-1 ring-white/10 mb-2">
              <Mail className="h-6 w-6 text-indigo-300" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Unlock Weekly Stories
            </h2>
            <p className="text-zinc-400 text-base leading-relaxed">
              Join 15,000+ readers. Get the latest book arrivals, exclusive author interviews, and hidden gems delivered to your inbox.
            </p>
          </div>
          <div className="w-full max-w-md space-y-3">
            <form onSubmit={handleSubscribe} className="flex flex-col gap-3 sm:flex-row">
              <Input
                name="email"
                type="email"
                required
                className="h-12 border-0 bg-white/10 text-white placeholder:text-zinc-500 focus-visible:ring-indigo-500 focus-visible:ring-offset-0"
                placeholder="Enter your email address" />
              <Button
                type="submit"
                size="lg"
                className="h-12 bg-white text-zinc-900 hover:bg-zinc-200 font-semibold sm:w-auto w-full">
                Subscribe
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
            <p className="text-xs text-zinc-500 text-center md:text-left flex items-center justify-center md:justify-start gap-2">
              <BellRing className="h-3 w-3" />
              No spam. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsLetter;