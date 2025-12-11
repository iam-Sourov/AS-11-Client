import React from 'react';
import { motion } from "framer-motion";
import { BookOpen, MapPin, Users } from "lucide-react";

const stats = [
  {
    icon: BookOpen,
    value: "10k+",
    label: "Books Available",
    desc: "From classics to bestsellers"
  },
  {
    icon: MapPin,
    value: "64",
    label: "Districts Covered",
    desc: "Nationwide delivery network"
  },
  {
    icon: Users,
    value: "50k+",
    label: "Happy Readers",
    desc: "Growing community everyday"
  }
];
const Stats = () => {
  return (
    <section className="w-full py-16 bg-muted/30 border-y border-border/50">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-border">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col items-center text-center px-4 py-4 md:py-0">
              <div className="mb-4 p-3 rounded-full bg-background shadow-sm border text-primary">
                <stat.icon className="w-6 h-6" strokeWidth={2} />
              </div>
              <h3 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
                {stat.value}
              </h3>
              <p className="text-base font-semibold text-foreground mt-2">
                {stat.label}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {stat.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;