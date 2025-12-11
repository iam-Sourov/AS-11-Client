import React, { useContext, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';
import { Search } from 'lucide-react';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { AuthContext } from '../../contexts/AuthContext';

const AllBooks = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);

  const [selectedBook, setSelectedBook] = useState(null);
  const [orderBook, setOrderBook] = useState(null);

  const [search, setSearch] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isOrdering, setIsOrdering] = useState(false);

  // Fetch books
  const { data: books = [], isLoading, isError, error } = useQuery({
    queryKey: ['books'],
    queryFn: async () => {
      const res = await axiosSecure.get('/books');
      return res.data;
    }
  });

  const publishedBooks = books.filter(b => b.status === 'published');

  const displayedBooks = publishedBooks.filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.author.toLowerCase().includes(search.toLowerCase())
  );

  // PLACE ORDER FUNCTION
  const handlePlaceOrder = async () => {
    if (!phone || !address) {
      toast.error("Please fill in phone and address");
      return;
    }

    setIsOrdering(true);

    const orderData = {
      name: user.displayName,
      email: user.email,
      phone,
      address,
      author: orderBook.author,     // AUTHOR SENT CORRECTLY
      bookId: orderBook._id,
      bookTitle: orderBook.title,
      price: orderBook.price,
      status: 'pending',
      image: orderBook.image,
      payment_status: 'unpaid',
      date: new Date().toISOString()
    };

    try {
      const res = await axiosSecure.post('/orders', orderData);

      if (res.data.insertedId === null) {
        toast.error("You have already ordered this book.");
        setIsOrdering(false);
        return;
      }

      toast.success(`Order placed successfully for: ${orderBook.title}`);
      setOrderBook(null);
      setPhone('');
      setAddress('');

    } catch (err) {
      console.error(err);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsOrdering(false);
    }
  };

  if (isLoading)
    return <div className="p-8 flex items-center justify-center text-center"><Spinner /></div>;

  if (isError)
    return <div className="p-8 text-red-500 text-center">Error: {error.message}</div>;

  return (
    <div>
      <h1 className='text-3xl font-bold mt-6 mb-4 text-center'>All Books</h1>

      {/* SEARCH BAR */}
      <div className="flex justify-center mb-6">
        <div className="relative w-full max-w-md ">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search by title or author..."
            className="pl-9 rounded-full border border-gray-600 focus-visible:ring-offset-0"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* BOOK GRID */}
      <div className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayedBooks.map((b) => (
          <Card key={b._id} className="shadow-lg rounded-2xl overflow-hidden flex flex-col h-full hover:shadow-xl transition-shadow duration-300">
            <img src={b.image} alt={b.title} className="w-full h-52 object-cover" />
            <CardContent className="p-4 flex flex-col grow">
              <h2 className="font-bold text-xl line-clamp-1">{b.title}</h2>
              <p className="text-gray-600 text-sm mt-1">By {b.author}</p>
              <p className="text-gray-500 text-sm mt-2 line-clamp-2 grow">{b.description}</p>

              <div className="flex justify-between items-center mt-3">
                <span className="font-bold text-primary">{b.price}$</span>
                <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">{b.category}</span>
              </div>

              <Button className="mt-4 w-full" onClick={() => setSelectedBook(b)}>
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* DETAILS MODAL */}
      <Dialog open={!!selectedBook} onOpenChange={(open) => !open && setSelectedBook(null)}>
        <DialogContent className="rounded-2xl max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedBook && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">{selectedBook.title}</DialogTitle>
              </DialogHeader>

              <div className="flex flex-col md:flex-row gap-6 mt-4">
                <div className="w-full md:w-1/2">
                  <img src={selectedBook.image} className="w-full rounded-xl object-cover shadow-md" alt={selectedBook.title} />
                </div>

                <div className="flex-1 space-y-3 text-sm">
                  <p className="leading-relaxed text-gray-700">{selectedBook.description}</p>

                  <div className="pt-2 space-y-2">
                    <p><span className="font-semibold">Author:</span> {selectedBook.author}</p>
                    <p><span className="font-semibold">Category:</span> {selectedBook.category}</p>
                    <p><span className="font-semibold">Rating:</span> ⭐ {selectedBook.rating}</p>

                    <div className="flex items-center gap-2">
                      <span className="font-semibold">Price:</span>
                      <span className="text-xl font-bold text-green-600">${selectedBook.price}</span>
                    </div>
                  </div>

                  <Button
                    className="w-full mt-6"
                    onClick={() => {
                      setOrderBook(selectedBook);  // correctly set book
                      setSelectedBook(null);       // close details modal
                    }}
                  >
                    Order Now
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ORDER MODAL */}
      <Dialog open={!!orderBook} onOpenChange={(open) => !open && setOrderBook(null)}>
        <DialogContent className="rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Order</DialogTitle>
            <DialogDescription>
              Complete your purchase for <span className="font-semibold text-primary">{orderBook?.title}</span>.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input value={user?.displayName || ''} readOnly className="bg-gray-100 cursor-not-allowed" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input value={user?.email || ''} readOnly className="bg-gray-100 cursor-not-allowed" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="address">Delivery Address</Label>
              <Textarea
                id="address"
                placeholder="Enter full address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOrderBook(null)}>Cancel</Button>
            <Button onClick={handlePlaceOrder} disabled={isOrdering}>
              {isOrdering ? <Spinner className="mr-2 h-4 w-4" /> : "Place Order"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AllBooks;
