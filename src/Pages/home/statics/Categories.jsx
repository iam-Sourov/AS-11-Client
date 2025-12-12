import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Compass, Book, Rocket, Heart, Brain, Zap, Coffee, Ghost } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const categories = [
  { name: "Fiction", icon: Book, color: "text-blue-500", bg: "bg-blue-500/10" },
  { name: "Sci-Fi", icon: Rocket, color: "text-purple-500", bg: "bg-purple-500/10" },
  { name: "Romance", icon: Heart, color: "text-rose-500", bg: "bg-rose-500/10" },
  { name: "Self Help", icon: Brain, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { name: "Thriller", icon: Zap, color: "text-yellow-500", bg: "bg-yellow-500/10" },
  { name: "History", icon: Compass, color: "text-amber-600", bg: "bg-amber-600/10" },
  { name: "Lifestyle", icon: Coffee, color: "text-pink-500", bg: "bg-pink-500/10" },
  { name: "Horror", icon: Ghost, color: "text-slate-500", bg: "bg-slate-500/10" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const Categories = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight">Explore by Genre</h2>
        <p className="text-muted-foreground mt-2">Dive into your favorite worlds</p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-2 md:grid-cols-4 gap-6"
      >
        {categories.map((cat, idx) => (
          <motion.div key={idx} variants={itemVariants}>
            <Card className="cursor-pointer group hover:border-primary/50 transition-colors border-dashed">
              <CardContent className="flex flex-col items-center justify-center p-6 gap-4">
                <div className={`p-4 rounded-full ${cat.bg} group-hover:scale-110 transition-transform duration-300`}>
                  <cat.icon className={`h-8 w-8 ${cat.color}`} />
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {cat.name}
                  </h3>
                  <span className="text-xs text-muted-foreground flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity mt-1">
                    Explore <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default Categories;