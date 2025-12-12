import React, { useContext, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'; // Import useMutation and useQueryClient
import { toast } from 'sonner';
import {
  Search,
  ShoppingCart,
  X,
  BookOpen,
  Star,
  Heart
} from 'lucide-react';
import { Card } from '@/components/ui/card';
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
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { Separator } from '@/components/ui/separator';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { AuthContext } from '../../contexts/AuthContext';

const AllBooks = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const [selectedBook, setSelectedBook] = useState(null);
  const [orderBook, setOrderBook] = useState(null);
  const [search, setSearch] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isOrdering, setIsOrdering] = useState(false);

  const { data: books = [], isLoading, isError } = useQuery({
    queryKey: ['books'],
    queryFn: async () => {
      const res = await axiosSecure.get('/books');
      return res.data;
    }
  });

  const { data: wishlist = [] } = useQuery({
    queryKey: ['wishlist', user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/wishlist?email=${user.email}`);
      return res.data;
    }
  });

  const publishedBooks = books.filter(b => b.status === 'published');
  const displayedBooks = publishedBooks.filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.author.toLowerCase().includes(search.toLowerCase())
  );

  const addToWishlistMutation = useMutation({
    mutationFn: async (book) => {
      const wishlistItem = {
        bookId: book._id,
        title: book.title,
        image: book.image,
        author: book.author,
        price: book.price,
        category: book.category,
        rating: book.rating,
        userEmail: user.email,
        userName: user.displayName,
        addedDate: new Date().toISOString()
      }
      return await axiosSecure.post('/wishlist', wishlistItem);
    },
    onSuccess: () => {
      toast.success("Book added to wishlist!");
      queryClient.invalidateQueries(['wishlist']);
    },
    onError: (error) => {
      if (error.response && error.response.status === 409) {
        toast.error("This book is already in your wishlist.");
      } else {
        toast.error("Failed to add to wishlist.");
      }
    }
  });

  const handleAddToWishlist = (book) => {
    if (!user) {
      toast.error("Please login to add to wishlist");
      return;
    }
    addToWishlistMutation.mutate(book);
  };


  const handlePlaceOrder = async () => {
    if (!phone || !address) {
      toast.error("Please provide delivery details.");
      return;
    }

    setIsOrdering(true);
    const orderData = {
      name: user.displayName,
      email: user.email,
      phone,
      address,
      author: orderBook.author,
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
      } else {
        toast.success("Order placed successfully!");
        setOrderBook(null);
        setPhone('');
        setAddress('');
      }
    } catch (err) {
      toast.error("Failed to place order.");
    } finally {
      setIsOrdering(false);
    }
  };

  const openOrderModal = (book) => {
    setSelectedBook(null); // Close details if open
    setOrderBook(book);
  };

  if (isLoading) return (
    <div className="flex h-[80vh] w-full items-center justify-center">
      <Spinner size="lg" />
    </div>
  );

  if (isError) return (
    <div className="flex h-[50vh] flex-col items-center justify-center gap-2 text-destructive">
      <p>Failed to load library data.</p>
      <Button variant="outline" onClick={() => window.location.reload()}>Retry</Button>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Library Collection</h1>
          <p className="text-muted-foreground mt-1">Browse and discover your next read.</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search title or author..."
            className="pl-9 pr-9 bg-background"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 hover:text-foreground text-muted-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
      {displayedBooks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground border-2 border-dashed rounded-xl">
          <BookOpen className="h-10 w-10 mb-4 opacity-20" />
          <p>No books found matching "{search}"</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayedBooks.map((book) => (
            <Card
              key={book._id}
              className="group flex flex-col overflow-hidden border bg-card transition-all hover:shadow-lg hover:border-primary/20">
              <div className="relative aspect-4/5 overflow-hidden bg-muted">
                <img
                  src={book.image}
                  alt={book.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <Badge className="absolute top-3 right-3 shadow-sm bg-background/90 text-foreground hover:bg-background backdrop-blur-sm">
                  ${book.price}
                </Badge>
              </div>

              <div className="flex flex-1 flex-col p-5">
                <div className="flex justify-between items-start gap-2">
                  <div className="space-y-1">
                    <h3 className="font-semibold leading-tight line-clamp-1 group-hover:text-primary transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{book.author}</p>
                  </div>
                </div>

                <div className="mt-4 flex flex-1 items-end">
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={() => setSelectedBook(book)}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Book Details Modal */}
      <Dialog open={!!selectedBook} onOpenChange={(open) => !open && setSelectedBook(null)}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden gap-0">
          <div className="grid md:grid-cols-2 h-full">
            {selectedBook && (
              <>
                <div className="bg-muted h-64 md:h-full relative group">
                  <img
                    src={selectedBook.image}
                    alt={selectedBook.title}
                    className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent md:hidden" />
                </div>
                <div className="p-6 md:p-8 flex flex-col h-full">
                  <DialogHeader className="mb-4 text-left">
                    <div className="flex justify-between items-start">
                      <Badge variant="outline" className="mb-2">{selectedBook.category}</Badge>
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="text-sm font-medium text-foreground">{selectedBook.rating}</span>
                      </div>
                    </div>
                    <DialogTitle className="text-2xl md:text-3xl font-bold">{selectedBook.title}</DialogTitle>
                    <p className="text-muted-foreground text-lg">by {selectedBook.author}</p>
                  </DialogHeader>
                  <div className="flex-1 overflow-y-auto pr-2">
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {selectedBook.description}
                    </p>
                  </div>
                  <Separator className="my-6" />
                  <div className="flex items-center justify-between gap-4">
                    <div className="text-2xl font-bold">${selectedBook.price}</div>

                    <div className="flex gap-2">
                      {/* Wishlist Button */}
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleAddToWishlist(selectedBook)}
                        disabled={addToWishlistMutation.isPending}
                        title="Add to Wishlist"
                      >
                        {addToWishlistMutation.isPending ? (
                          <Spinner className="h-4 w-4" />
                        ) : (
                          <Heart className={`h-5 w-5 ${wishlist.some(item => item.bookId === selectedBook._id) ? "fill-red-500 text-red-500" : ""}`} />
                        )}
                      </Button>

                      <Button
                        size="lg"
                        className="px-8"
                        onClick={() => openOrderModal(selectedBook)}>
                        Buy Now
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Order Modal */}
      <Dialog open={!!orderBook} onOpenChange={(open) => !open && setOrderBook(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Checkout</DialogTitle>
            <DialogDescription>
              Complete your purchase for <span className="font-medium text-foreground">{orderBook?.title}</span>
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-5 py-4">
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Name</Label>
                  <div className="text-sm font-medium p-2 bg-muted rounded-md truncate">
                    {user?.displayName}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Email</Label>
                  <div className="text-sm font-medium p-2 bg-muted rounded-md truncate">
                    {user?.email}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+880..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Delivery Address</Label>
                <Textarea
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street, City, Zip"
                  className="resize-none min-h-20"
                />
              </div>
            </div>

            <div className="bg-muted/50 p-3 rounded-lg flex justify-between items-center text-sm">
              <span>Total to pay:</span>
              <span className="font-bold text-lg">${orderBook?.price}</span>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setOrderBook(null)}>
              Cancel
            </Button>
            <Button onClick={handlePlaceOrder} disabled={isOrdering} className="w-full sm:w-auto">
              {isOrdering ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" /> Processing
                </>
              ) : (
                <>
                  <ShoppingCart className="mr-2 h-4 w-4" /> Place Order
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AllBooks;