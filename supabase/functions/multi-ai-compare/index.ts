import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

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

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { problemStatement } = await req.json();
    if (!problemStatement?.trim()) {
      return new Response(JSON.stringify({ error: "Problem statement is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is not configured");

    const encoder = new TextEncoder();

    const body = new ReadableStream({
      async start(controller) {
        const sendEvent = (data: object) => {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
        };

        // Start perspective calls staggered (4s apart) to avoid rate limits
        const promises = ANALYSIS_PERSPECTIVES.map(async ({ id, model, label, prompt }, index) => {
          // Stagger requests to reduce rate limit pressure
          if (index > 0) await delay(index * 6000);

          sendEvent({ type: "start", modelId: id, label });

          const MAX_RETRIES = 3;

          for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
            try {
              const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${GEMINI_API_KEY}`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    system_instruction: {
                      parts: [{ text: prompt }],
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
                console.warn(`${response.status === 429 ? 'Rate limited' : 'Service unavailable'} on ${model} (${id}), retrying in ${waitTime}ms (attempt ${attempt + 1}/${MAX_RETRIES})`);
                await delay(waitTime);
                continue;
              }

              if (!response.ok) {
                const errText = await response.text();
                console.error(`${model} (${id}) error:`, response.status, errText);
                sendEvent({ type: "error", modelId: id, error: `Model returned ${response.status}` });
                return;
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
                      sendEvent({ type: "delta", modelId: id, content: text });
                    }
                  } catch {
                    // partial JSON, skip
                  }
                }
              }

              sendEvent({ type: "done", modelId: id });
              return; // success, exit retry loop

            } catch (err) {
              if (attempt === MAX_RETRIES - 1) {
                console.error(`${model} (${id}) stream error after ${MAX_RETRIES} retries:`, err);
                sendEvent({
                  type: "error",
                  modelId: id,
                  error: err instanceof Error ? err.message : "Unknown error",
                });
              } else {
                const waitTime = Math.pow(2, attempt + 1) * 1500;
                console.warn(`${model} (${id}) error, retrying in ${waitTime}ms...`);
                await delay(waitTime);
              }
            }
          }
        });

        await Promise.all(promises);
        sendEvent({ type: "complete" });
        controller.close();
      },
    });

    return new Response(body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream", "Cache-Control": "no-cache" },
    });
  } catch (e) {
    console.error("multi-ai-compare error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
