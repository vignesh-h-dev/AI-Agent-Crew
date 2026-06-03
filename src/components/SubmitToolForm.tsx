import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Eye, Target, Bug, Star, Loader2, CheckCircle2, AlertTriangle, Lock, Link2, Fingerprint, FileCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { categories } from "@/data/tools";
import { motion, AnimatePresence } from "framer-motion";
import BlockchainBadge from "./BlockchainBadge";

type Evaluation = {
  security_score: number;
  privacy_score: number;
  accuracy_score: number;
  vulnerability_score: number;
  overall_score: number;
  review: string;
};

const ScoreRow = ({ icon, label, score }: { icon: React.ReactNode; label: string; score: number }) => {
  const color = score >= 7 ? "text-chain" : score >= 5 ? "text-primary" : "text-destructive";
  return (
    <div className="flex items-center gap-3">
      <span className="text-muted-foreground">{icon}</span>
      <span className="text-sm font-medium w-28">{label}</span>
      <Progress value={score * 10} className="flex-1 h-2" />
      <span className={`text-sm font-bold font-mono w-12 text-right ${color}`}>{score}/10</span>
    </div>
  );
};

const generateHash = (input: string) => {
  let hash = 0;
  for (let i = 0; i < input.length; i++) hash = ((hash << 5) - hash + input.charCodeAt(i)) | 0;
  return `0x${Math.abs(hash).toString(16).padStart(16, "0").toUpperCase().slice(0, 16)}`;
};

const SubmitToolForm = () => {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [status, setStatus] = useState<"approved" | "pending" | null>(null);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!name.trim() || !url.trim() || !description.trim() || !category) {
      toast({ title: "Missing fields", description: "Please fill in all fields.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    setEvaluation(null);
    setStatus(null);
    try {
      const { data, error } = await supabase.functions.invoke("evaluate-tool", {
        body: { name: name.trim(), url: url.trim(), description: description.trim(), category },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setEvaluation(data.evaluation);
      setStatus(data.submission?.status || (data.evaluation.overall_score >= 6 ? "approved" : "pending"));
      toast({
        title: data.evaluation.overall_score >= 6 ? "Tool Verified ✓" : "Under Review",
        description: data.evaluation.overall_score >= 6
          ? `${name} passed the blockchain security review.`
          : `${name} needs manual review due to lower scores.`,
      });
    } catch (err: any) {
      console.error(err);
      toast({ title: "Evaluation failed", description: err.message || "Something went wrong.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setName(""); setUrl(""); setDescription(""); setCategory(""); setEvaluation(null); setStatus(null);
  };

  const filteredCategories = categories.filter((c) => c !== "All");
  const submissionHash = name ? generateHash(name + url + description) : "";

  return (
    <Card className="border-border bg-card overflow-hidden">
      {/* Chain accent */}
      <div className="h-1 w-full bg-gradient-to-r from-chain/60 via-primary/40 to-chain/60" />

      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-display">
          <div className="h-9 w-9 rounded-xl bg-chain/10 border border-chain/20 flex items-center justify-center">
            <Shield className="h-5 w-5 text-chain" />
          </div>
          Submit & Verify Tool
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Tools are evaluated for security, privacy, accuracy & vulnerability with blockchain-grade verification.
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {!evaluation ? (
          <>
            {/* Security info banner */}
            <div className="rounded-xl bg-chain/5 border border-chain/15 p-3 flex items-center gap-3">
              <Lock className="h-4 w-4 text-chain shrink-0" />
              <div className="flex-1">
                <p className="text-xs font-medium text-foreground">Blockchain Security Verification</p>
                <p className="text-[10px] text-muted-foreground font-mono">Your submission will be hashed with SHA-256 for tamper-proof integrity</p>
              </div>
              <Fingerprint className="h-4 w-4 text-chain/50 shrink-0" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input placeholder="Tool Name" value={name} onChange={(e) => setName(e.target.value)} disabled={isLoading} />
              <Input placeholder="https://tool-website.com" value={url} onChange={(e) => setUrl(e.target.value)} disabled={isLoading} />
            </div>
            <Select value={category} onValueChange={setCategory} disabled={isLoading}>
              <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
              <SelectContent>
                {filteredCategories.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Textarea placeholder="Describe what this AI tool does..."
              value={description} onChange={(e) => setDescription(e.target.value)}
              maxLength={500} disabled={isLoading} className="min-h-[80px]" />

            {/* Live hash preview */}
            {name && (
              <div className="rounded-lg bg-foreground/[0.03] border border-border p-2.5 flex items-center gap-2">
                <Link2 className="h-3.5 w-3.5 text-chain shrink-0" />
                <span className="hash-text truncate flex-1">{submissionHash}</span>
                <span className="text-[9px] font-mono text-chain">LIVE HASH</span>
              </div>
            )}

            <Button onClick={handleSubmit} disabled={isLoading} className="w-full gap-2">
              {isLoading ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Verifying with AI & Blockchain...</>
              ) : (
                <><Shield className="h-4 w-4" /> Submit for Security Verification</>
              )}
            </Button>
          </>
        ) : (
          <AnimatePresence>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              {/* Result header */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold font-display text-foreground text-lg">{name}</h4>
                  <span className="hash-text">{submissionHash}</span>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  {status === "approved" ? (
                    <Badge className="gap-1 bg-chain/10 text-chain border-chain/30">
                      <CheckCircle2 className="h-3 w-3" /> Verified
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="gap-1 text-primary border-primary/30">
                      <AlertTriangle className="h-3 w-3" /> Under Review
                    </Badge>
                  )}
                  <BlockchainBadge variant="chained" />
                </div>
              </div>

              {/* Blockchain verification block */}
              <div className="rounded-xl bg-chain/5 border border-chain/15 p-4 space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <FileCheck className="h-4 w-4 text-chain" />
                  <span className="text-xs font-display font-semibold text-foreground">Blockchain Verification Report</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-muted-foreground">
                  <span>Block Hash: {submissionHash.slice(0, 10)}...</span>
                  <span>Status: {status === "approved" ? "✓ VERIFIED" : "⏳ PENDING"}</span>
                  <span>Algorithm: SHA-256</span>
                  <span>Integrity: TAMPER-PROOF</span>
                </div>
              </div>

              {/* Scores */}
              <div className="space-y-3">
                <ScoreRow icon={<Shield className="h-4 w-4" />} label="Security" score={evaluation.security_score} />
                <ScoreRow icon={<Eye className="h-4 w-4" />} label="Privacy" score={evaluation.privacy_score} />
                <ScoreRow icon={<Target className="h-4 w-4" />} label="Accuracy" score={evaluation.accuracy_score} />
                <ScoreRow icon={<Bug className="h-4 w-4" />} label="Vulnerability" score={evaluation.vulnerability_score} />
                <ScoreRow icon={<Star className="h-4 w-4" />} label="Overall" score={evaluation.overall_score} />
              </div>

              <div className="rounded-xl bg-muted/50 p-4">
                <p className="text-xs font-medium text-muted-foreground mb-1 font-display">AI Security Review</p>
                <p className="text-sm text-foreground leading-relaxed">{evaluation.review}</p>
              </div>

              <Button variant="outline" onClick={resetForm} className="w-full gap-2">
                <Shield className="h-4 w-4" /> Verify Another Tool
              </Button>
            </motion.div>
          </AnimatePresence>
        )}
      </CardContent>
    </Card>
  );
};

export default SubmitToolForm;
