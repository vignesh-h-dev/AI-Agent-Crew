import Header from "@/components/Header";
import ProblemAnalyzer from "@/components/ProblemAnalyzer";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Analyzer = () => {
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

        <ProblemAnalyzer />
      </div>
    </div>
  );
};

export default Analyzer;
