import React from 'react';
import { motion } from "framer-motion";
import { Truck, Library, Wallet, ShieldCheck, Clock, HeartHandshake } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Truck,
    title: "Express Delivery",
    desc: "Doorstep delivery within 24-48 hours. Real-time tracking included.",
  },
  {
    icon: Library,
    title: "Curated Collection",
    desc: "Access thousands of rare and popular titles across 50+ genres.",
  },
  {
    icon: Wallet,
    title: "Best Price Guarantee",
    desc: "Premium reads at student-friendly prices with seasonal discounts.",
  },
];
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const BookCourier = () => {
  return (
    <section className="w-full py-20 px-6 bg-background">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center  max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
            Why Readers Trust Us
          </h2>
          <p className="text-muted-foreground text-lg mb-2">
            We don't just sell books; we deliver stories with care, speed, and affordability.
          </p>
        </div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((item, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="h-full border border-border/50 bg-card/50 hover:bg-card hover:border-primary/50 transition-all duration-300 hover:shadow-lg group">
                <CardContent className="p-8 flex flex-col items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
                    <item.icon className="h-6 w-6" strokeWidth={2} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-foreground">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default BookCourier;