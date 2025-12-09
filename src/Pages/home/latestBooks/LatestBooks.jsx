import React from 'react';
import { Card, CardFooter, CardContent } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { Spinner } from '@/components/ui/spinner';
import { ShoppingCart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const LatestBooks = () => {
  const axiosSecure = useAxiosSecure();
  const { data: books = [], isLoading, isError, error } = useQuery({
    queryKey: ['books'],
    queryFn: async () => {
      const res = await axiosSecure.get('/books');
      return res.data;
    }

  });
  console.log(books)
  const latestBooks = books.sort((a, b) => new Date(b.rating) - new Date(a.rating)).slice(0, 8);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Spinner />
      </div>
    );
  }
  if (isError) {
    return <div className="text-red-500 text-center mt-10">Error: {error.message}</div>;
  }
  return (

    <section className=" py-12 px-4">
      <h2 className="text-3xl font-bold mb-8 text-center">Latest Books</h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 container mx-auto">
        {latestBooks.map((book) => (
          <Card key={book._id} className="flex flex-col h-full rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100">
            <div className="relative group overflow-hidden">
              <img
                src={book.image}
                alt={book.title}
                className="w-full rounded-2xl h-56 object-cover transition-transform duration-500 group-hover:scale-105" />
              
            </div>
            <CardContent className="p-5 grow">
              <Button size="sm" className="gap-2 mb-2 shadow-sm">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-sm font-semibold ">{book.rating}</span>
              </Button>
              <h3 className="font-bold text-lg leading-tight mb-1 line-clamp-1" title={book.title}>
                {book.title}
              </h3>
              <p className="text-sm text-gray-500 mb-1 font-medium">by {book.author}</p>
              <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                {book.medium_description}
              </p>
            </CardContent>
            <CardFooter className="p-5 pt-0 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xl font-bold text-primary">
                  ${book.price}
                </span>
              </div>
              <Button size="sm" className="gap-2 rounded-full px-4 shadow-sm">
                <ShoppingCart className="w-4 h-4" />
                Add
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default LatestBooks;