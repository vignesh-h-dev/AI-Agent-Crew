import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Trophy, Brain, Zap, Target, DollarSign, ThumbsUp, ExternalLink } from "lucide-react";
import { tools } from "@/data/tools";
import type { AnalysisResult } from "./ProblemAnalyzer";
import { motion } from "framer-motion";

const ScoreBar = ({ value, max = 10 }: { value: number; max?: number }) => {
  const pct = (value / max) * 100;
  const color =
    pct >= 80 ? "bg-accent" : pct >= 60 ? "bg-primary" : pct >= 40 ? "bg-yellow-500" : "bg-destructive";

  return (
    <div className="flex items-center gap-2 min-w-[100px]">
      <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all duration-700`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-mono text-muted-foreground w-6 text-right">{value.toFixed(1)}</span>
    </div>
  );
};

const RankBadge = ({ rank }: { rank: number }) => {
  if (rank === 1) return <span className="text-xl">🥇</span>;
  if (rank === 2) return <span className="text-xl">🥈</span>;
  if (rank === 3) return <span className="text-xl">🥉</span>;
  return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>;
};

const AnalysisResults = ({ result }: { result: AnalysisResult }) => {
  const bestTool = result.ratings[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-10 space-y-6"
    >
      {/* Domain & Analysis Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              AI Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">{result.analysis}</p>
          </CardContent>
        </Card>

        <Card className="border-primary/30 bg-primary/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Trophy className="h-5 w-5 text-accent" />
              Best Match
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-xl font-bold text-foreground">{bestTool.toolName}</p>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{result.domain}</Badge>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm text-muted-foreground">Score:</span>
              <span className="text-2xl font-bold text-primary">{bestTool.overallScore.toFixed(1)}</span>
              <span className="text-xs text-muted-foreground">/10</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Comparison Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Detailed Comparison
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Rank</TableHead>
                <TableHead>Tool</TableHead>
                <TableHead>
                  <span className="flex items-center gap-1"><Target className="h-3.5 w-3.5" /> Relevance</span>
                </TableHead>
                <TableHead>
                  <span className="flex items-center gap-1"><Zap className="h-3.5 w-3.5" /> Speed</span>
                </TableHead>
                <TableHead>
                  <span className="flex items-center gap-1"><ThumbsUp className="h-3.5 w-3.5" /> Accuracy</span>
                </TableHead>
                <TableHead>
                  <span className="flex items-center gap-1"><DollarSign className="h-3.5 w-3.5" /> Cost</span>
                </TableHead>
                <TableHead>Ease of Use</TableHead>
                <TableHead>Overall</TableHead>
                <TableHead className="min-w-[200px]">Why</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {result.ratings.map((r, i) => {
                const toolData = tools.find((t) => t.id === r.toolId);
                return (
                  <motion.tr
                    key={r.toolId}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="border-b border-border"
                  >
                    <TableCell><RankBadge rank={i + 1} /></TableCell>
                    <TableCell>
                      <div>
                        <p className="font-semibold text-foreground">{r.toolName}</p>
                        <p className="text-xs text-muted-foreground">{toolData?.pricing}</p>
                      </div>
                    </TableCell>
                    <TableCell><ScoreBar value={r.relevance} /></TableCell>
                    <TableCell><ScoreBar value={r.speed} /></TableCell>
                    <TableCell><ScoreBar value={r.accuracy} /></TableCell>
                    <TableCell><ScoreBar value={r.costEfficiency} /></TableCell>
                    <TableCell><ScoreBar value={r.easeOfUse} /></TableCell>
                    <TableCell>
                      <span className="font-bold text-primary text-lg">{r.overallScore.toFixed(1)}</span>
                    </TableCell>
                    <TableCell>
                      <p className="text-xs text-muted-foreground leading-relaxed">{r.reason}</p>
                    </TableCell>
                    <TableCell>
                      {toolData?.url && (
                        <a href={toolData.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </TableCell>
                  </motion.tr>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AnalysisResults;
