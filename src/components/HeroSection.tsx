import { Search, Shield, Link2, Fingerprint } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalTools: number;
}

const HeroSection = ({ searchQuery, onSearchChange, totalTools }: HeroSectionProps) => {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden blockchain-grid">
      {/* Floating blockchain nodes */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-10 right-[15%] h-8 w-8 rounded-full border border-chain/30 bg-chain/5 flex items-center justify-center">
          <Link2 className="h-3.5 w-3.5 text-chain/60" />
        </motion.div>
        <motion.div animate={{ y: [0, 12, 0] }} transition={{ duration: 5, repeat: Infinity, delay: 1 }}
          className="absolute top-24 left-[10%] h-6 w-6 rounded-full border border-primary/30 bg-primary/5 flex items-center justify-center">
          <Shield className="h-3 w-3 text-primary/60" />
        </motion.div>
        <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
          className="absolute bottom-16 right-[25%] h-7 w-7 rounded-full border border-chain/20 bg-chain/5 flex items-center justify-center">
          <Fingerprint className="h-3.5 w-3.5 text-chain/50" />
        </motion.div>
      </div>

      <div className="relative text-center space-y-6 max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-chain/10 border border-chain/20 mb-4">
            <Shield className="h-3.5 w-3.5 text-chain" />
            <span className="text-xs font-mono font-medium text-chain tracking-wide">BLOCKCHAIN-VERIFIED SECURITY</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold font-display text-foreground leading-tight">
            Discover <span className="text-primary">Trusted</span> AI Tools
          </h1>
          <p className="text-lg text-muted-foreground mt-4 max-w-xl mx-auto">
            Every tool is AI-evaluated for security, privacy & accuracy with tamper-proof blockchain verification.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="relative max-w-lg mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search verified AI tools..."
            className="pl-12 pr-4 h-13 text-base rounded-xl border-border bg-card shadow-sm glow-primary"
          />
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-chain animate-pulse-chain" />
            <span className="font-mono text-xs">{totalTools} verified tools</span>
          </span>
          <span className="flex items-center gap-1.5 font-mono text-xs">
            <Fingerprint className="h-3.5 w-3.5" /> SHA-256 Secured
          </span>
          <span className="flex items-center gap-1.5 font-mono text-xs">
            <Link2 className="h-3.5 w-3.5" /> Chain Active
          </span>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
