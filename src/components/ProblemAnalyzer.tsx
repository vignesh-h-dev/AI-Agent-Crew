import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { analyzeProblemWithGemini } from "@/lib/gemini";
import AnalysisResults from "./AnalysisResults";
import LiveAIComparison from "./LiveAIComparison";

export type ToolRating = {
  toolId: string;
  toolName: string;
  relevance: number;
  speed: number;
  accuracy: number;
  costEfficiency: number;
  easeOfUse: number;
  overallScore: number;
  reason: string;
};

export type AnalysisResult = {
  analysis: string;
  domain: string;
  ratings: ToolRating[];
};

const ProblemAnalyzer = () => {
  const [problem, setProblem] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!problem.trim()) {
      toast({ title: "Please enter a problem statement", variant: "destructive" });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const data = await analyzeProblemWithGemini(problem.trim());
      setResult(data);
    } catch (err: any) {
      console.error("Analysis error:", err);
      toast({
        title: "Something went wrong",
        description: err.message || "Failed to analyze. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-12" id="analyzer">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
          AI Tool <span className="text-primary">Matchmaker</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Describe your project idea or problem statement, and our AI will analyze it to find and rank the best AI tools for your needs.
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        <Textarea
          placeholder="Describe your project idea or problem... e.g., 'I want to build an app that generates marketing copy and images for social media campaigns automatically'"
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          className="min-h-[120px] bg-card border-border text-base resize-none"
          maxLength={1000}
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{problem.length}/1000</span>
          <Button
            onClick={handleAnalyze}
            disabled={loading || !problem.trim()}
            size="lg"
            className="gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Find Best AI Tools
              </>
            )}
          </Button>
        </div>
      </div>

      {result && (
        <>
          <AnalysisResults result={result} />
          <LiveAIComparison problemStatement={problem} />
        </>
      )}
    </section>
  );
};

export default ProblemAnalyzer;
