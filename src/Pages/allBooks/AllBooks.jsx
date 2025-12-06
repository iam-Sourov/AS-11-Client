import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import useAxios from '../../hooks/useAxios';
import { toast } from 'sonner';

const AllBooks = () => {
  const [selectedBook, setSelectedBook] = useState(null);

  const { data: books = [], isLoading, isError, error } = useQuery({
    queryKey: ['books'],
    queryFn: async () => {
      const res = await useAxios.get('/books');
      return res.data;
    }
  });

  const handlePlaceOrder = () => {
    console.log("Order placed for book:", selectedBook);
    toast.success(`Ordered: ${selectedBook.title}`);


    setSelectedBook(null);
  };

  if (isLoading) return <div className="p-8 text-center">Loading books...</div>;
  if (isError) return <div className="p-8 text-red-500 text-center">Error: {error.message}</div>;

  return (
    <div>
      <h1 className='text-3xl font-bold mt-6 mb-4 text-center'>All Books</h1>
      <div className="p-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
        {books.map((b) => (
          <Card key={b._id} className="shadow-lg rounded-2xl overflow-hidden flex flex-col h-full">
            <img src={b.image_url} alt={b.title} className="w-full h-52 object-cover" />
            <CardContent className="p-4 flex flex-col grow">
              <h2 className="font-bold text-xl line-clamp-1">{b.title}</h2>
              <p className="text-gray-600 text-sm mt-1">By {b.author}</p>
              <p className="text-gray-500 text-sm mt-2 line-clamp-2 grow">{b.medium_description}</p>
              <Button className="mt-4 w-full" onClick={() => setSelectedBook(b)}>View Details</Button>
            </CardContent>
          </Card>
        ))}
        <Dialog open={!!selectedBook} onOpenChange={(open) => !open && setSelectedBook(null)}>
          <DialogContent className="rounded-2xl max-w-2xl max-h-[90vh] overflow-y-auto">
            {selectedBook && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">{selectedBook.title}</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col md:flex-row gap-6 mt-4">
                  <div className="w-full md:w-1/2">
                    <img
                      src={selectedBook.image_url}
                      className="w-full rounded-xl object-cover shadow-md"
                      alt={selectedBook.title}
                    />
                  </div>
                  <div className="flex-1 space-y-3 text-sm">
                    <p className="text-gray-700 leading-relaxed">{selectedBook.medium_description}</p>
                    <div className="pt-2 space-y-2">
                      <p><span className="font-semibold">Author:</span> {selectedBook.author}</p>
                      <p><span className="font-semibold">Publisher:</span> {selectedBook.publisher}</p>
                      <p><span className="font-semibold">Rating:</span> ⭐ {selectedBook.rating}</p>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">Price:</span>
                        <span className="text-gray-400 line-through">${selectedBook.price_USD}</span>
                        <span className="text-xl font-bold text-green-600">${selectedBook.discounted_price_USD}</span>
                      </div>
                    </div>
                    <Button className="w-full mt-6" onClick={handlePlaceOrder}>
                      Order Now
                    </Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AllBooks;