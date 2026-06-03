import type { AnalysisResult } from "@/components/ProblemAnalyzer";

const AI_TOOLS = [
  { id: "1", name: "ChatGPT", category: "Chatbot", pricing: "Freemium", tags: ["Chatbot", "Text Generation", "Code Assistant"] },
  { id: "2", name: "Midjourney", category: "Image Generation", pricing: "Paid", tags: ["Image Generation", "Design"] },
  { id: "3", name: "Claude", category: "Chatbot", pricing: "Freemium", tags: ["Chatbot", "Text Generation", "Research"] },
  { id: "4", name: "DALL·E 3", category: "Image Generation", pricing: "Paid", tags: ["Image Generation"] },
  { id: "5", name: "GitHub Copilot", category: "Code Assistant", pricing: "Paid", tags: ["Code Assistant", "Productivity"] },
  { id: "6", name: "Runway ML", category: "Video Generation", pricing: "Freemium", tags: ["Video Generation", "Design"] },
  { id: "7", name: "Jasper", category: "Writing Assistant", pricing: "Paid", tags: ["Writing Assistant", "Marketing"] },
  { id: "8", name: "Stable Diffusion", category: "Image Generation", pricing: "Open Source", tags: ["Image Generation", "Open Source"] },
  { id: "9", name: "ElevenLabs", category: "Audio & Music", pricing: "Freemium", tags: ["Audio & Music", "Text Generation"] },
  { id: "10", name: "Notion AI", category: "Productivity", pricing: "Paid", tags: ["Productivity", "Writing Assistant"] },
  { id: "11", name: "Perplexity", category: "Research", pricing: "Freemium", tags: ["Research", "Chatbot"] },
  { id: "12", name: "Suno", category: "Audio & Music", pricing: "Freemium", tags: ["Audio & Music"] },
  { id: "13", name: "Canva AI", category: "Design", pricing: "Freemium", tags: ["Design", "Image Generation", "Marketing"] },
  { id: "14", name: "Grammarly", category: "Writing Assistant", pricing: "Freemium", tags: ["Writing Assistant", "Productivity"] },
  { id: "15", name: "Synthesia", category: "Video Generation", pricing: "Paid", tags: ["Video Generation", "Marketing"] },
  { id: "16", name: "Cursor", category: "Code Assistant", pricing: "Freemium", tags: ["Code Assistant", "Productivity"] },
  { id: "17", name: "Gemini", category: "Chatbot", pricing: "Free", tags: ["Chatbot", "Text Generation", "Code Assistant"] },
  { id: "18", name: "Copy.ai", category: "Marketing", pricing: "Freemium", tags: ["Marketing", "Writing Assistant"] },
  { id: "19", name: "Hugging Face", category: "Research", pricing: "Open Source", tags: ["Research", "Code Assistant", "Open Source"] },
  { id: "20", name: "Descript", category: "Video Generation", pricing: "Freemium", tags: ["Video Generation", "Audio & Music", "Productivity"] },
  { id: "21", name: "Khan Academy Khanmigo", category: "Education", pricing: "Paid", tags: ["Education", "Chatbot"] },
  { id: "22", name: "Tableau AI", category: "Data Analysis", pricing: "Paid", tags: ["Data Analysis", "Productivity"] },
  { id: "23", name: "Lovable", category: "Code Assistant", pricing: "Freemium", tags: ["Code Assistant", "Design", "Productivity"] },
  { id: "24", name: "Otter.ai", category: "Productivity", pricing: "Freemium", tags: ["Productivity", "Audio & Music"] },
];

// Models to try in order (fallback if rate limited or not available)
const MODELS = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite-001",
];

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function buildRequestBody(systemPrompt: string, problemStatement: string) {
  return {
    system_instruction: {
      parts: [{ text: systemPrompt }],
    },
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `Analyze this problem/idea and rate the best AI tools for it:\n\n"${problemStatement.trim()}"`,
          },
        ],
      },
    ],
    tools: [
      {
        function_declarations: [
          {
            name: "rate_tools",
            description: "Return rated AI tools for the given problem statement",
            parameters: {
              type: "object",
              properties: {
                analysis: {
                  type: "string",
                  description: "Brief analysis of the problem domain and what AI capabilities are needed",
                },
                domain: {
                  type: "string",
                  description: "The identified AI domain (e.g., 'Natural Language Processing', 'Computer Vision', 'Code Generation')",
                },
                ratings: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      toolId: { type: "string" },
                      toolName: { type: "string" },
                      relevance: { type: "number" },
                      speed: { type: "number" },
                      accuracy: { type: "number" },
                      costEfficiency: { type: "number" },
                      easeOfUse: { type: "number" },
                      overallScore: { type: "number" },
                      reason: { type: "string" },
                    },
                    required: ["toolId", "toolName", "relevance", "speed", "accuracy", "costEfficiency", "easeOfUse", "overallScore", "reason"],
                  },
                },
              },
              required: ["analysis", "domain", "ratings"],
            },
          },
        ],
      },
    ],
    tool_config: {
      function_calling_config: {
        mode: "ANY",
        allowed_function_names: ["rate_tools"],
      },
    },
  };
}

export async function analyzeProblemWithGemini(problemStatement: string): Promise<AnalysisResult> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY_HERE") {
    throw new Error("Please set your VITE_GEMINI_API_KEY in the .env file");
  }

  const toolsList = AI_TOOLS.map(
    (t) => `- ${t.name} (ID: ${t.id}, Category: ${t.category}, Pricing: ${t.pricing}, Tags: ${t.tags.join(", ")})`
  ).join("\n");

  const systemPrompt = `You are an AI tools expert analyst. Given a user's problem statement or project idea, analyze which AI tools from the provided list would be most relevant.

Available AI Tools:
${toolsList}

You MUST respond by calling the "rate_tools" function with your analysis. Rate the top 8 most relevant tools. For each tool provide:
- relevance: 1-10 score for how relevant to the problem
- speed: 1-10 estimated speed/efficiency
- accuracy: 1-10 estimated quality of output
- costEfficiency: 1-10 value for money
- easeOfUse: 1-10 how easy to get started
- reason: One sentence explaining why this tool fits
- overallScore: weighted average (relevance*0.3 + accuracy*0.25 + speed*0.15 + costEfficiency*0.15 + easeOfUse*0.15)`;

  const requestBody = buildRequestBody(systemPrompt, problemStatement);
  let lastError: Error | null = null;

  // Try each model, with retries per model
  for (const model of MODELS) {
    const MAX_RETRIES = 3;

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        console.log(`Trying model: ${model} (attempt ${attempt + 1}/${MAX_RETRIES})`);

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody),
          }
        );

        if (response.status === 429) {
          const waitTime = Math.pow(2, attempt + 1) * 1000; // 2s, 4s, 8s
          console.warn(`Rate limited on ${model}, waiting ${waitTime}ms before retry...`);
          await delay(waitTime);
          continue; // retry same model
        }

        if (response.status === 403) {
          throw new Error("Invalid Gemini API key. Please check your VITE_GEMINI_API_KEY in the .env file.");
        }

        if (response.status === 404) {
          console.warn(`Model ${model} not found (404), trying next model...`);
          break; // try next model
        }

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Gemini API error (${model}):`, response.status, errorText);
          throw new Error(`Gemini API error (${response.status})`);
        }

        const data = await response.json();

        // Gemini returns function calls in candidates[0].content.parts[0].functionCall
        const functionCall = data.candidates?.[0]?.content?.parts?.find(
          (part: any) => part.functionCall
        )?.functionCall;

        if (!functionCall || functionCall.name !== "rate_tools") {
          console.warn(`No valid function call from ${model}, trying next model...`);
          break; // try next model
        }

        const result: AnalysisResult = functionCall.args;

        // Sort by overallScore descending
        result.ratings.sort((a, b) => b.overallScore - a.overallScore);

        return result;
      } catch (err: any) {
        lastError = err;
        // If it's a fatal error (like invalid API key), throw immediately
        if (err.message?.includes("Invalid Gemini API key")) {
          throw err;
        }
        console.error(`Error with ${model} (attempt ${attempt + 1}):`, err.message);
      }
    }

    // If all retries for this model were rate-limited, try next model
    console.log(`Moving to next model after exhausting retries on ${model}`);
  }

  throw lastError || new Error("All models failed. Please wait a moment and try again.");
}
