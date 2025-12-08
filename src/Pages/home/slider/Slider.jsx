import React from "react";
import { Marquee } from "@/components/ui/marquee";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const Slider = () => {
  const axiosSecure = useAxiosSecure();
  const { data: books = [], isLoading, isError, error, refetch } = useQuery({
    queryKey: ['books'],
    queryFn: async () => {
      const res = await axiosSecure.get('/books');
      return res.data;
    }
  });
  if (isLoading) return <Spinner></Spinner>

  return (
    <section className="w-full py-12 overflow-hidden ">
      <h2 className="text-3xl font-bold text-center mb-8">
        Featured Books
      </h2>

      <Marquee pauseOnHover speed={20} className="space-x-4">
        {books.map((book, indx) => (
          <div
            key={indx}
            className="w-[350px] h-[270px]  shadow-lg rounded-2xl p-4 flex flex-col justify-between hover:scale-105 transition-all border"
          >
            <img
              src={book.image_url}
              alt={book.title}
              className="w-full h-40 object-cover rounded-xl"
            />

            <h3 className="font-bold text-lg mt-2">{book.title}</h3>
            <p className="text-sm text-gray-600 line-clamp-2">{book.description}</p>

            <Link to="/all-books">
              <Button className="w-full mt-3">Explore Books</Button>
            </Link>
          </div>
        ))}
      </Marquee>

      <Marquee pauseOnHover reverse speed={20} className="space-x-6 mt-10">
        {books.map((book, index) => (
          <div
            key={index + "reverse"}
            className="w-[350px] h-[270px] shadow-lg rounded-2xl p-4 flex flex-col justify-between hover:scale-105 transition-all border"
          >
            <img
              src={book.image_url}
              alt={book.title}
              className="w-full h-40 object-cover rounded-xl"
            />

            <h3 className="font-bold text-lg mt-2">{book.title}</h3>
            <p className="text-sm text-gray-600 line-clamp-2">{book.description}</p>

            <Link href="/all-books">
              <Button className="w-full mt-3">Explore Books</Button>
            </Link>
          </div>
        ))}
      </Marquee>
    </section>
  );
};

export default Slider;
