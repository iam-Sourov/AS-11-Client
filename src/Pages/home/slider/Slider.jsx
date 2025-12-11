import React from "react";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { Marquee } from "@/components/ui/marquee";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const BookCard = ({ book }) => (
  <Link
    to="/all-books"
    className="group relative flex w-[280px] flex-col overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md hover:border-primary/50"
  >
    <div className="aspect-4/5 w-full overflow-hidden bg-muted">
      <img
        src={book.image}
        alt={book.title}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
    </div>
    <div className="flex flex-1 flex-col p-4">
      <h3 className="line-clamp-1 text-base font-medium tracking-tight">
        {book.title}
      </h3>
      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
        {book.description}
      </p>
    </div>
  </Link>
);

const Slider = () => {
  const axiosSecure = useAxiosSecure();

  const { data: books = [], isLoading, isError } = useQuery({
    queryKey: ["books"],
    queryFn: async () => {
      const res = await axiosSecure.get("/books");
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-64 w-full items-center justify-center bg-background">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-64 w-full items-center justify-center text-destructive bg-background">
        <p>Failed to load books.</p>
      </div>
    );
  }
  return (
    <section className="relative w-full overflow-hidden py-20 bg-background">
      <div className="container mx-auto px-4 mb-10 text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-foreground">
          Featured Books
        </h2>
        <p className="mt-2 text-muted-foreground">
          A selection of our most popular reads.
        </p>
      </div>
      <div className="relative flex w-full flex-col gap-6">
        <Marquee pauseOnHover className="[--duration:40s]">
          {books.map((book, idx) => (
            <div key={idx} className="mx-3">
              <BookCard book={book} />
            </div>
          ))}
        </Marquee>
        <Marquee pauseOnHover reverse className="[--duration:40s]">
          {books.map((book, idx) => (
            <div key={`${idx}-reverse`} className="mx-3">
              <BookCard book={book} />
            </div>
          ))}
        </Marquee>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-linear-to-r from-background to-transparent z-10"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-linear-to-l from-background to-transparent z-10"></div>
      </div>
    </section>
  );
};

export default Slider;