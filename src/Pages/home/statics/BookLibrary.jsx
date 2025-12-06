import React from 'react';
import { motion } from "framer-motion";

const BookLibrary = () => {
  return (
    <section className="w-full px-4 py-10 rounded-2xl shadow-inner">
      <h2 className="text-3xl font-bold text-center mb-8">Why Choose BookCourier?</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          {
            title: "Fast Delivery",
            desc: "We ensure your books reach your doorstep quickly and safely.",
          },
          {
            title: "Huge Collection",
            desc: "Thousands of curated books available in all genres.",
          },
          {
            title: "Affordable Price",
            desc: "We guarantee the best prices with regular discounts.",
          },
        ].map((item, index) => (
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 border-2 rounded-xl m-4 shadow-lg text-center"
            key={index}
          >
            <h3 className="text-xl font-bold mb-3">{item.title}</h3>
            <p className="">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default BookLibrary;