import React from 'react';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';

// Components
import Map from './map/Map';
import LatestBooks from './latestBooks/LatestBooks';
import BookCourier from './statics/BookCourier';
import Stats from './statics/Stats';
import NewsLetter from './statics/NewsLetter';
import Slider from './slider/Slider';
import Categories from './statics/Categories';
import Testimonials from './statics/Testimonials';
import Container from '../../shared/container';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <section className="relative pt-24 pb-10 md:pt-40 md:pb-20 overflow-hidden">
        <div className="container mx-auto px-4 text-center z-10 relative">
          <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80 mb-6">
            New Arrivals In Stock
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-7xl mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
            Your Next Great Read <br className="hidden sm:block" />
            <span className="text-primary">Is Waiting For You.</span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg md:text-xl text-muted-foreground mb-10 leading-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            Discover a curated collection of thousands of books. From timeless classics
            to modern bestsellers, manage your library in one beautiful place.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-20 animate-in fade-in slide-in-from-bottom-10 duration-1000">
            <Button size="lg" className="h-12 px-8 rounded-full text-base" asChild>
              <Link to="/all-books">Start Exploring</Link>
            </Button>
          </div>
        </div>
        <div className="relative w-full opacity-90 hover:opacity-100 transition-opacity duration-500">
          <Slider />
        </div>
      </section>
      <div className="border-y bg-muted/20">
        <Container>
          <Stats />
        </Container>
      </div>
      <section className="py-16 md:py-24">
        <Container>
          <Categories />
        </Container>
      </section>
      <section className="pb-16 md:pb-24">
        <Container>
          <LatestBooks />
        </Container>
      </section>
      <section className="bg-muted/30 py-20 md:py-32">
        <Container>
          <BookCourier />
        </Container>
      </section>
      <section className="py-16 md:py-24">
        <Container>
          <div className="space-y-4 text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Nationwide Delivery</h2>
            <p className="text-lg text-muted-foreground">
              We deliver to every corner of the country. Check our coverage map below
              to see if your district is on our priority list.
            </p>
          </div>
          <Map />
        </Container>
      </section>
      <section className="py-16 md:py-24 bg-muted/10">
        <Container>
          <Testimonials />
        </Container>
      </section>
      <section className="py-16 md:py-24">
        <Container>
          <NewsLetter />
        </Container>
      </section>
    </div>
  );
};

export default Home;