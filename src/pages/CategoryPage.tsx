import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import ToolCard from "@/components/ToolCard";
import PricingFilter from "@/components/PricingFilter";
import { tools, pricingFilters } from "@/data/tools";
import { ArrowLeft, LayoutGrid } from "lucide-react";
import { motion } from "framer-motion";

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const decodedCategory = decodeURIComponent(category || "");
  const [pricing, setPricing] = useState("All");

  const filtered = useMemo(() => {
    return tools.filter((t) => {
      const matchesCategory =
        t.category === decodedCategory || t.tags.includes(decodedCategory);
      const matchesPricing = pricing === "All" || t.pricing === pricing;
      return matchesCategory && matchesPricing;
    });
  }, [decodedCategory, pricing]);

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

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            {decodedCategory}
          </h1>
          <p className="text-muted-foreground mb-8">
            Explore the best AI tools in the {decodedCategory} category.
          </p>
        </motion.div>

        <div className="flex items-center justify-between mb-6">
          <PricingFilter options={pricingFilters} selected={pricing} onSelect={setPricing} />
          <span className="text-sm text-muted-foreground flex items-center gap-1.5">
            <LayoutGrid className="h-4 w-4" />
            {filtered.length} tools
          </span>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((tool, i) => (
              <ToolCard key={tool.id} tool={tool} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-lg text-muted-foreground">
              No tools found in this category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
