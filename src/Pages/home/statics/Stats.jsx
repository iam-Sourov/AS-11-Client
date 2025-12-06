import React from 'react';
import { motion } from "framer-motion";

const Stats = () => {
  return (
    <section className=" w-full flex gap-4 justify-center items-center text-center m-10">
      {["10,000+ Books", "2,500+ Cities Covered", "50,000+ Happy Readers"].map((stat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="p-6 border-2 rounded-2xl shadow-lg text-xl font-bold"
        >
          {stat}
        </motion.div>
      ))}
    </section>
  );
};

export default Stats;