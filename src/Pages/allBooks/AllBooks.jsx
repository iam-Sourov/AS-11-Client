import React, { useContext, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Search, X, Star, Heart, MessageSquare, Filter } from 'lucide-react';
import { format } from 'date-fns';

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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

import useAxiosSecure from '../../hooks/useAxiosSecure';
import { AuthContext } from '../../contexts/AuthContext';

const AllBooks = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const [selectedBook, setSelectedBook] = useState(null);
  const [reviewBook, setReviewBook] = useState(null);
  const [orderBook, setOrderBook] = useState(null);
  const [search, setSearch] = useState('');
  const [phone, setPhone] = useState('');


  const [address, setAddress] = useState('');
  const [isOrdering, setIsOrdering] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');

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

  const { data: reviews = [], isLoading: reviewsLoading } = useQuery({
    queryKey: ['reviews', reviewBook?._id],
    enabled: !!reviewBook?._id,
    queryFn: async () => {
      const res = await axiosSecure.get(`/reviews/${reviewBook._id}`);
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
      toast.success("Added to wishlist");
      queryClient.invalidateQueries(['wishlist']);
    },
    onError: (error) => {
      if (error.response?.status === 409) {
        toast.error("Already in wishlist");
      } else {
        toast.error("Failed to add to wishlist");
      }
    }
  });

  const reviewMutation = useMutation({
    mutationFn: async (data) => {
      return await axiosSecure.post('/reviews', data);
    },
    onSuccess: () => {
      toast.success("Review posted successfully!");
      setReviewText('');
      setReviewRating(5);
      queryClient.invalidateQueries(['reviews']);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to post review");
    }
  });

  const handleAddToWishlist = (book) => {
    if (!user) return toast.error("Please login first");
    addToWishlistMutation.mutate(book);
  };

  const handlePostReview = () => {
    if (!user) return toast.error("Please login to review");

    const reviewData = {
      bookId: reviewBook._id,
      userEmail: user.email,
      userName: user.displayName,
      userPhoto: user.photoURL,
      rating: reviewRating,
      comment: reviewText
    };
    reviewMutation.mutate(reviewData);
  };

  const handlePlaceOrder = async () => {
    if (!phone || !address) {
      toast.error("Please provide details.");
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
      toast.error("Failed to place order.", err);
    } finally {
      setIsOrdering(false);
    }
  };

  const openReviewModal = (book) => {
    setSelectedBook(null);
    setReviewBook(book);
  };

  const openOrderModal = (book) => {
    setSelectedBook(null);
    setReviewBook(null);
    setOrderBook(book);
  };

  if (isLoading) return <div className="flex h-[80vh] items-center justify-center"><Spinner size="lg" /></div>;
  if (isError) return <div className="text-center py-20 text-destructive">Failed to load books.</div>;

  return (
    <div className="container mx-auto px-4 py-12 mt-8 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">Library Collection</h1>
          <p className="text-muted-foreground text-lg">Browse our curated list of books and discover your next read.</p>
        </div>
        <div className="relative w-full md:w-80 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search title or author..."
            className="pl-9 pr-9 bg-background h-11"
            value={search}
            onChange={(e) => setSearch(e.target.value)} />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
      {displayedBooks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed rounded-2xl bg-muted/10">
          <div className="bg-muted p-4 rounded-full mb-4">
            <Filter className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">No books found</h3>
          <p className="text-muted-foreground text-sm mt-1">Try adjusting your search terms.</p>
          <Button variant="link" onClick={() => setSearch('')} className="mt-2 text-primary">Clear Search</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
          {displayedBooks.map((book) => (
            <Card key={book._id} className="group flex flex-col overflow-hidden border bg-card hover:shadow-lg hover:border-primary/20 transition-all duration-300 h-full">
              <div className="relative aspect-3/4 overflow-hidden bg-muted">
                <img
                  src={book.image}
                  alt={book.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <Button size="sm" variant="secondary" onClick={() => setSelectedBook(book)} className="shadow-lg font-medium">
                    Quick View
                  </Button>
                </div>
                <Badge className="absolute top-3 right-3 shadow-md bg-background/95 text-foreground backdrop-blur-sm border-none px-3 py-1 text-sm font-bold">
                  ${book.price}
                </Badge>
              </div>
              <div className="flex flex-1 flex-col p-5 space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="outline" className="text-[10px] uppercase tracking-wider text-muted-foreground border-border/60">
                      {book.category}
                    </Badge>
                    <div className="flex items-center gap-1 text-amber-500 text-xs font-medium">
                      <Star className="h-3 w-3 fill-current" />
                      {book.rating}
                    </div>
                  </div>
                  <h3 className="font-bold text-lg leading-tight line-clamp-1 group-hover:text-primary transition-colors" title={book.title}>
                    {book.title}
                  </h3>
                  <p className="text-sm text-muted-foreground font-medium line-clamp-1">by {book.author}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      <Dialog open={!!selectedBook} onOpenChange={(open) => !open && setSelectedBook(null)}>
        <DialogContent className="max-w-4xl p-0 gap-0 overflow-hidden h-[90vh] md:h-auto border-none shadow-2xl sm:rounded-2xl">
          <div className="grid md:grid-cols-2 h-full">
            <div className="bg-muted relative hidden md:block h-full min-h-[500px]">
              {selectedBook && <img src={selectedBook.image} alt={selectedBook.title} className="absolute inset-0 w-full h-full object-cover" />}
            </div>

            {selectedBook && (
              <div className="flex flex-col h-full bg-background p-6 md:p-10 relative">
                <div className="absolute top-4 right-4 z-10 md:hidden">
                  <DialogTitle className="sr-only">Details</DialogTitle>
                </div>
                <div className="space-y-6 flex-1 overflow-y-auto pr-2">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="px-3 py-1">{selectedBook.category}</Badge>
                      <div className="flex items-center gap-1.5 text-amber-500 font-semibold bg-amber-50 px-2 py-1 rounded-md text-sm">
                        <Star className="h-4 w-4 fill-current" />
                        {selectedBook.rating}
                      </div>
                    </div>
                    <DialogTitle className="text-3xl md:text-4xl font-bold tracking-tight text-foreground leading-tight">
                      {selectedBook.title}
                    </DialogTitle>
                    <p className="text-lg text-muted-foreground font-medium">by {selectedBook.author}</p>
                  </div>
                  <Separator />
                  <div className="prose prose-sm text-muted-foreground leading-relaxed">
                    <p>{selectedBook.description}</p>
                  </div>
                </div>
                <div className="mt-8 pt-6 border-t space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Total Price</span>
                      <div className="text-3xl font-bold text-foreground">${selectedBook.price}</div>
                    </div>
                    <Button variant="ghost" onClick={() => openReviewModal(selectedBook)} className="gap-2 text-muted-foreground hover:text-foreground">
                      <MessageSquare className="w-4 h-4" />
                      Read Reviews
                    </Button>
                  </div>
                  <div className="grid grid-cols-[auto_1fr] gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-12 w-12 shrink-0 rounded-xl border-2"
                      onClick={() => handleAddToWishlist(selectedBook)}
                      disabled={addToWishlistMutation.isPending}>
                      <Heart className={`h-5 w-5 ${wishlist.some(item => item.bookId === selectedBook._id) ? "fill-red-500 text-red-500" : ""}`} />
                    </Button>
                    <Button size="lg" className="h-12 rounded-xl text-base font-semibold shadow-lg shadow-primary/20" onClick={() => openOrderModal(selectedBook)}>
                      Order Now
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={!!reviewBook} onOpenChange={(open) => !open && setReviewBook(null)}>
        <DialogContent className="sm:max-w-xl h-[80vh] flex flex-col p-0 gap-0 overflow-hidden sm:rounded-2xl">
          <div className="p-6 border-b bg-background/95 backdrop-blur z-10">
            <DialogHeader>
              <DialogTitle className="text-xl">Reviews for <span className="text-primary">{reviewBook?.title}</span></DialogTitle>
              <DialogDescription>Community feedback and ratings</DialogDescription>
            </DialogHeader>
          </div>
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-8">
              {user && (
                <div className="bg-muted/30 p-5 rounded-2xl border border-dashed border-border space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm">Rate your experience</h4>
                    <p className="text-xs text-muted-foreground mt-1">Share your thoughts with other readers</p>
                  </div>

                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="group focus:outline-none transition-transform active:scale-95">
                        <Star className={`h-7 w-7 transition-colors ${star <= reviewRating ? "fill-amber-400 text-amber-400 group-hover:fill-amber-500" : "text-muted-foreground/20 group-hover:text-amber-200"}`} />
                      </button>
                    ))}
                  </div>
                  <div className="space-y-3">
                    <Textarea
                      placeholder="What did you think about this book?"
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      className="min-h-[100px] resize-none bg-background border-none focus-visible:ring-1 shadow-sm" />
                    <div className="flex justify-end">
                      <Button
                        size="sm"
                        onClick={handlePostReview}
                        disabled={reviewMutation.isPending || !reviewText.trim()}
                        className="px-6">
                        {reviewMutation.isPending ? "Posting..." : "Post Review"}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    {reviews.length} Reviews
                  </h4>
                </div>
                {reviewsLoading ? (
                  <div className="flex justify-center py-12"><Spinner className="h-8 w-8 text-muted-foreground/30" /></div>
                ) : reviews.length > 0 ? (
                  reviews.map((review, i) => (
                    <div key={i} className="group animate-in fade-in slide-in-from-bottom-2 duration-500" style={{ animationDelay: `${i * 50}ms` }}>
                      <div className="flex gap-4">
                        <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                          <AvatarImage src={review.userPhoto} />
                          <AvatarFallback className="bg-primary/10 text-primary font-bold">{review.userName?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-sm text-foreground">{review.userName}</span>
                            <span className="text-xs text-muted-foreground font-medium">
                              {review.date ? format(new Date(review.date), 'MMM dd, yyyy') : 'N/A'}
                            </span>
                          </div>
                          <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`h-3.5 w-3.5 ${i < review.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/20"}`} />
                            ))}
                          </div>
                          <p className="text-sm text-foreground/80 leading-relaxed pt-1">
                            {review.comment}
                          </p>
                        </div>
                      </div>
                      {i < reviews.length - 1 && <Separator className="mt-6 bg-border/40" />}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-16 px-4 rounded-xl border border-dashed bg-muted/10">
                    <div className="bg-muted inline-flex p-3 rounded-full mb-3">
                      <MessageSquare className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="text-foreground font-medium">No reviews yet</p>
                    <p className="text-sm text-muted-foreground mt-1">Purchased this book? Be the first to share your thoughts.</p>
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>
          <div className="p-4 border-t bg-muted/10 flex justify-end">
            <Button variant="outline" onClick={() => { setReviewBook(null); setSelectedBook(reviewBook); }}>
              Back to Details
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={!!orderBook} onOpenChange={(open) => !open && setOrderBook(null)}>
        <DialogContent className="sm:max-w-[450px] p-6 sm:rounded-2xl">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl">Checkout</DialogTitle>
            <DialogDescription>
              Confirm details for <span className="font-medium text-foreground">{orderBook?.title}</span>
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-5">
            <div className="grid gap-2">
              <Label htmlFor="phone" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Contact Number</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+880 1234 567890"
                className="h-11"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Delivery Address</Label>
              <Textarea
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House No, Street, City, Zip Code"
                className="min-h-[100px] resize-none"
              />
            </div>

            <div className="bg-primary/5 p-4 rounded-xl flex items-center justify-between mt-2">
              <span className="text-sm font-medium">Total Payable</span>
              <span className="text-xl font-bold text-primary">${orderBook?.price}</span>
            </div>
          </div>

          <DialogFooter className="mt-6 gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setOrderBook(null)} className="h-11">
              Cancel
            </Button>
            <Button onClick={handlePlaceOrder} disabled={isOrdering} className="h-11 px-8 w-full sm:w-auto font-semibold">
              {isOrdering ? <Spinner className="mr-2 h-4 w-4" /> : "Confirm Order"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default AllBooks;