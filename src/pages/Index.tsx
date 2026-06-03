import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CategoryFilter from "@/components/CategoryFilter";
import PricingFilter from "@/components/PricingFilter";
import ToolCard from "@/components/ToolCard";
import { tools, categories, pricingFilters } from "@/data/tools";
import { LayoutGrid, ArrowRight, Sparkles, Shield, Bot, Network, Lock, Fingerprint, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const Index = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [pricing, setPricing] = useState("All");

  const filtered = useMemo(() => {
    return tools.filter((t) => {
      const matchesSearch =
        !search ||
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase()) ||
        t.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()));
      const matchesCategory = category === "All" || t.category === category || t.tags.includes(category);
      const matchesPricing = pricing === "All" || t.pricing === pricing;
      return matchesSearch && matchesCategory && matchesPricing;
    });
  }, [search, category, pricing]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container">
        <HeroSection searchQuery={search} onSearchChange={setSearch} totalTools={tools.length} />

        {/* Blockchain-themed quick access */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Link
              to="/analyzer"
              className="group relative block rounded-2xl border border-border bg-card p-6 hover:shadow-lg hover:border-chain/40 transition-all overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-chain/5 rounded-bl-[80px]" />
              <div className="relative">
                <div className="h-14 w-14 rounded-2xl bg-chain/10 border border-chain/20 flex items-center justify-center mb-4 glow-chain">
                  <Sparkles className="h-7 w-7 text-chain" />
                </div>
                <h3 className="font-bold font-display text-foreground text-lg group-hover:text-chain transition-colors">AI Matchmaker</h3>
                <p className="text-sm text-muted-foreground mt-1">Find the best AI tools for your problem with verified results</p>
                <div className="flex items-center gap-1.5 mt-3 text-xs font-mono text-chain">
                  Explore <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Link
              to="/categories"
              className="group relative block rounded-2xl border border-border bg-card p-6 hover:shadow-lg hover:border-primary/40 transition-all overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-[80px]" />
              <div className="relative">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 glow-primary">
                  <Bot className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-bold font-display text-foreground text-lg group-hover:text-primary transition-colors">Browse Agents</h3>
                <p className="text-sm text-muted-foreground mt-1">Explore all AI agent categories with security ratings</p>
                <div className="flex items-center gap-1.5 mt-3 text-xs font-mono text-primary">
                  Browse <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Link
              to="/submit"
              className="group relative block rounded-2xl border border-border bg-card p-6 hover:shadow-lg hover:border-chain/40 transition-all overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-chain/5 rounded-bl-[80px]" />
              <div className="relative">
                <div className="h-14 w-14 rounded-2xl bg-chain/10 border border-chain/20 flex items-center justify-center mb-4 glow-chain">
                  <Shield className="h-7 w-7 text-chain" />
                </div>
                <h3 className="font-bold font-display text-foreground text-lg group-hover:text-chain transition-colors">Submit & Verify</h3>
                <p className="text-sm text-muted-foreground mt-1">Submit tools with AI security review & blockchain verification</p>
                <div className="flex items-center gap-1.5 mt-3 text-xs font-mono text-chain">
                  Submit <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </motion.div>
        </div>

        {/* Security stats banner */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="rounded-2xl border border-chain/20 bg-chain/5 p-5 mb-10 blockchain-grid">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-chain/15 flex items-center justify-center">
                <Lock className="h-5 w-5 text-chain" />
              </div>
              <div>
                <h4 className="font-display font-semibold text-foreground text-sm">Blockchain Security Layer</h4>
                <p className="text-xs text-muted-foreground font-mono">All tools verified with SHA-256 hash integrity</p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-xs font-mono text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Fingerprint className="h-3.5 w-3.5 text-chain" /> {tools.length} Hashes
              </span>
              <span className="flex items-center gap-1.5">
                <Link2 className="h-3.5 w-3.5 text-chain" /> Chain Active
              </span>
              <span className="flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-chain" /> 100% Verified
              </span>
            </div>
          </div>
        </motion.div>

        <div className="space-y-6 pb-20">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-display text-foreground">Verified Tools</h2>
            <Link to="/categories">
              <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
                All Categories <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <CategoryFilter categories={categories} selected={category} onSelect={setCategory} />

          <div className="flex items-center justify-between">
            <PricingFilter options={pricingFilters} selected={pricing} onSelect={setPricing} />
            <span className="text-sm text-muted-foreground flex items-center gap-1.5 font-mono">
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
              <p className="text-lg text-muted-foreground">No tools found matching your criteria.</p>
              <button onClick={() => { setSearch(""); setCategory("All"); setPricing("All"); }} className="mt-3 text-primary font-medium hover:underline">
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
