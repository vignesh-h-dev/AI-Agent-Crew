import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { categories, tools } from "@/data/tools";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const Categories = () => {
  const categoryList = categories.filter((c) => c !== "All");

  const getCount = (cat: string) =>
    tools.filter((t) => t.category === cat || t.tags.includes(cat)).length;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-10">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          All <span className="text-primary">Categories</span>
        </h1>
        <p className="text-muted-foreground mb-10">
          Browse AI tools organized by category.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categoryList.map((cat, i) => (
            <motion.div
              key={cat}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Link
                to={`/category/${encodeURIComponent(cat)}`}
                className="group block rounded-xl border border-border bg-card p-6 hover:shadow-md hover:border-primary/30 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors text-lg">
                      {cat}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {getCount(cat)} tools
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;
