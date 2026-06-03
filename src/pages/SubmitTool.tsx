import Header from "@/components/Header";
import SubmitToolForm from "@/components/SubmitToolForm";
import { Link } from "react-router-dom";
import { ArrowLeft, Shield, Fingerprint, Link2 } from "lucide-react";
import { motion } from "framer-motion";

const SubmitTool = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container max-w-2xl py-10">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-chain/10 border border-chain/20 mb-4">
            <Shield className="h-3.5 w-3.5 text-chain" />
            <span className="text-xs font-mono font-medium text-chain tracking-wide">BLOCKCHAIN VERIFIED</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold font-display text-foreground mb-3">
            Submit & <span className="text-primary">Verify</span> AI Tool
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Every submission undergoes AI security evaluation with blockchain-grade hash verification for tamper-proof integrity.
          </p>
          <div className="flex items-center justify-center gap-4 mt-4 text-xs font-mono text-muted-foreground">
            <span className="flex items-center gap-1"><Fingerprint className="h-3 w-3 text-chain" /> SHA-256</span>
            <span className="flex items-center gap-1"><Link2 className="h-3 w-3 text-chain" /> Chain Active</span>
            <span className="flex items-center gap-1"><Shield className="h-3 w-3 text-chain" /> AI Verified</span>
          </div>
        </motion.div>

        <SubmitToolForm />
      </div>
    </div>
  );
};

export default SubmitTool;
