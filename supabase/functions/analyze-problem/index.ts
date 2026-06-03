import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

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

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { problemStatement } = await req.json();
    if (!problemStatement || typeof problemStatement !== "string" || problemStatement.trim().length === 0) {
      return new Response(JSON.stringify({ error: "Problem statement is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
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

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Analyze this problem/idea and rate the best AI tools for it:\n\n"${problemStatement.trim()}"` },
        ],
        tools: [
          {
            type: "function",
            function: {
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
                      additionalProperties: false,
                    },
                  },
                },
                required: ["analysis", "domain", "ratings"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "rate_tools" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI usage limit reached. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      throw new Error("AI analysis failed");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall?.function?.arguments) {
      throw new Error("No tool call response from AI");
    }

    const result = JSON.parse(toolCall.function.arguments);
    // Sort by overallScore descending
    result.ratings.sort((a: any, b: any) => b.overallScore - a.overallScore);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-problem error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
