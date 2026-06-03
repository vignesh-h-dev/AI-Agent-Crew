import { useState, useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Zap, Brain, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";

type ModelState = {
  id: string;
  label: string;
  content: string;
  status: "waiting" | "streaming" | "done" | "error";
  error?: string;
};

// Use one reliable model with different analysis perspectives
const ANALYSIS_PERSPECTIVES = [
  {
    id: "technical",
    label: "🔧 Technical Expert",
    model: "gemini-2.5-flash",
    prompt: `You are a senior technical architect analyzing a problem statement. Focus on:
1. **Technical Requirements**: What technologies/frameworks are needed
2. **Architecture**: Suggest a high-level system design
3. **AI Tools**: Recommend 3-5 specific AI tools with technical justification
4. **Implementation Roadmap**: 4-5 concrete technical steps
5. **Potential Pitfalls**: 2-3 technical risks to watch for

Be precise and technical. Use markdown formatting.`,
  },
  {
    id: "business",
    label: "💼 Business Strategist",
    model: "gemini-2.5-flash",
    prompt: `You are a business strategy consultant analyzing a problem statement. Focus on:
1. **Market Opportunity**: Assess the business potential
2. **Cost-Benefit Analysis**: Compare tool costs vs expected ROI
3. **AI Tools**: Recommend 3-5 AI tools based on value and pricing
4. **Go-to-Market Strategy**: 3-4 actionable business steps
5. **Competitive Edge**: How AI gives an advantage

Be business-focused and practical. Use markdown formatting.`,
  },
  {
    id: "creative",
    label: "🎨 Creative Director",
    model: "gemini-2.5-flash",
    prompt: `You are a creative director analyzing a problem statement. Focus on:
1. **Creative Vision**: How to make the solution stand out
2. **User Experience**: Design and UX considerations
3. **AI Tools**: Recommend 3-5 AI tools for creative execution
4. **Workflow**: A creative production pipeline
5. **Innovation Ideas**: 2-3 unique creative approaches

Be imaginative and design-focused. Use markdown formatting.`,
  },
];

const PERSPECTIVE_ICONS: Record<string, React.ReactNode> = {
  "technical": <Zap className="h-4 w-4" />,
  "business": <Brain className="h-4 w-4" />,
  "creative": <Sparkles className="h-4 w-4" />,
};

const PERSPECTIVE_COLORS: Record<string, string> = {
  "technical": "border-primary/40 bg-primary/5",
  "business": "border-accent/40 bg-accent/5",
  "creative": "border-destructive/40 bg-destructive/5",
};

const PERSPECTIVE_BADGE_COLORS: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  "technical": "default",
  "business": "secondary",
  "creative": "destructive",
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function callGeminiModel(
  modelName: string,
  problemStatement: string,
  apiKey: string,
  perspectivePrompt: string,
  onDelta: (text: string) => void
): Promise<void> {
  const MAX_RETRIES = 3;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:streamGenerateContent?alt=sse&key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: perspectivePrompt }],
          },
          contents: [
            {
              role: "user",
              parts: [
                { text: `Analyze this problem/idea:\n\n"${problemStatement.trim()}"` },
              ],
            },
          ],
        }),
      }
    );

    if (response.status === 429 || response.status === 503) {
      const waitTime = Math.pow(2, attempt + 1) * 2000; // 4s, 8s, 16s
      console.warn(`${response.status === 429 ? 'Rate limited' : 'Service unavailable'} on ${modelName}, retrying in ${waitTime}ms (attempt ${attempt + 1}/${MAX_RETRIES})`);
      await delay(waitTime);
      continue;
    }

    if (!response.ok) {
      throw new Error(`Model returned ${response.status}`);
    }

    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      let newlineIdx: number;
      while ((newlineIdx = buffer.indexOf("\n")) !== -1) {
        const line = buffer.slice(0, newlineIdx).trim();
        buffer = buffer.slice(newlineIdx + 1);
        if (!line.startsWith("data: ")) continue;
        const jsonStr = line.slice(6).trim();
        if (jsonStr === "[DONE]") continue;
        try {
          const parsed = JSON.parse(jsonStr);
          const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            onDelta(text);
          }
        } catch {
          // partial JSON, skip
        }
      }
    }

    return; // success, exit retry loop
  }

  throw new Error("API temporarily unavailable after retries. Please wait a moment and try again.");
}

const LiveAIComparison = ({ problemStatement }: { problemStatement: string }) => {
  const [models, setModels] = useState<Record<string, ModelState>>({});
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const startComparison = useCallback(async () => {
    if (isRunning) return;

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY_HERE") {
      return;
    }

    setIsRunning(true);
    setIsComplete(false);
    setModels({});

    // Initialize all perspectives
    const initialModels: Record<string, ModelState> = {};
    for (const p of ANALYSIS_PERSPECTIVES) {
      initialModels[p.id] = {
        id: p.id,
        label: p.label,
        content: "",
        status: "streaming",
      };
    }
    setModels(initialModels);

    // Start perspective calls staggered (4s apart) to avoid rate limits
    const promises = ANALYSIS_PERSPECTIVES.map(async ({ id, model, label, prompt }, index) => {
      // Stagger requests to reduce rate limit pressure
      if (index > 0) await delay(index * 6000);

      try {
        await callGeminiModel(model, problemStatement, apiKey, prompt, (text) => {
          setModels((prev) => ({
            ...prev,
            [id]: {
              ...prev[id],
              content: (prev[id]?.content || "") + text,
            },
          }));
        });

        setModels((prev) => ({
          ...prev,
          [id]: { ...prev[id], status: "done" },
        }));
      } catch (err: any) {
        console.error(`${label} error:`, err);
        setModels((prev) => ({
          ...prev,
          [id]: {
            ...prev[id],
            status: "error",
            error: err.message || "Unknown error",
          },
        }));
      }
    });

    await Promise.all(promises);
    setIsRunning(false);
    setIsComplete(true);
  }, [problemStatement, isRunning]);

  useEffect(() => {
    startComparison();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const modelList = Object.values(models);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mt-8"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Live AI Comparison
        </h3>
        {isRunning && (
          <Badge variant="outline" className="animate-pulse gap-1.5">
            <Loader2 className="h-3 w-3 animate-spin" />
            Streaming...
          </Badge>
        )}
        {isComplete && !isRunning && (
          <Badge variant="secondary" className="gap-1.5">
            ✓ Complete
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {modelList.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className={`h-full flex flex-col ${PERSPECTIVE_COLORS[m.id] || "border-border"}`}>
                <CardHeader className="pb-2 pt-4 px-4">
                  <CardTitle className="text-sm flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      {PERSPECTIVE_ICONS[m.id]}
                      {m.label}
                    </span>
                    {m.status === "streaming" && (
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
                    )}
                    {m.status === "done" && (
                      <Badge variant={PERSPECTIVE_BADGE_COLORS[m.id] || "secondary"} className="text-[10px] px-1.5 py-0">
                        Done
                      </Badge>
                    )}
                    {m.status === "error" && (
                      <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                        Error
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4 flex-1 overflow-y-auto max-h-[500px] space-y-3">
                  {m.status === "error" ? (
                    <p className="text-sm text-destructive">{m.error}</p>
                  ) : m.content ? (
                    <div className="prose prose-sm dark:prose-invert max-w-none text-sm leading-relaxed [&_h1]:text-base [&_h2]:text-sm [&_h3]:text-sm [&_p]:text-muted-foreground [&_li]:text-muted-foreground [&_strong]:text-foreground">
                      <ReactMarkdown>{m.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Waiting for response...
                    </div>
                  )}
                  {m.status === "streaming" && m.content && (
                    <span className="inline-block w-1.5 h-4 bg-primary animate-pulse ml-0.5 align-text-bottom" />
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default LiveAIComparison;
