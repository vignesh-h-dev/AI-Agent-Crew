import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.99.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, url, description, category } = await req.json();

    if (!name?.trim() || !url?.trim() || !description?.trim() || !category?.trim()) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are an AI tool security and quality reviewer. Given an AI tool's name, URL, description, and category, evaluate it across these dimensions:

1. **Security** (1-10): How secure is this tool? Consider data handling, encryption, authentication practices.
2. **Privacy** (1-10): How well does it protect user data? Consider data collection, sharing, GDPR compliance.
3. **Accuracy** (1-10): How accurate/reliable is the tool at its stated purpose?
4. **Vulnerability** (1-10): How resilient is it to misuse, prompt injection, data leaks? (10 = very resilient)
5. **Overall** (1-10): Overall quality and trustworthiness.

Also provide a detailed review explaining your scores and any concerns.`;

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
          {
            role: "user",
            content: `Evaluate this AI tool:\n\nName: ${name.trim()}\nURL: ${url.trim()}\nDescription: ${description.trim()}\nCategory: ${category.trim()}`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "evaluate_tool",
              description: "Return structured evaluation scores for an AI tool",
              parameters: {
                type: "object",
                properties: {
                  security_score: { type: "number", description: "Security score 1-10" },
                  privacy_score: { type: "number", description: "Privacy score 1-10" },
                  accuracy_score: { type: "number", description: "Accuracy score 1-10" },
                  vulnerability_score: { type: "number", description: "Vulnerability resilience score 1-10" },
                  overall_score: { type: "number", description: "Overall score 1-10" },
                  review: { type: "string", description: "Detailed review text with explanations" },
                },
                required: ["security_score", "privacy_score", "accuracy_score", "vulnerability_score", "overall_score", "review"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "evaluate_tool" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please try again later." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No evaluation returned");

    const evaluation = JSON.parse(toolCall.function.arguments);

    // Save to database
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: inserted, error: dbError } = await supabase
      .from("tool_submissions")
      .insert({
        name: name.trim(),
        url: url.trim(),
        description: description.trim(),
        category: category.trim(),
        security_score: evaluation.security_score,
        privacy_score: evaluation.privacy_score,
        accuracy_score: evaluation.accuracy_score,
        vulnerability_score: evaluation.vulnerability_score,
        overall_score: evaluation.overall_score,
        ai_review: evaluation.review,
        status: evaluation.overall_score >= 6 ? "approved" : "pending",
      })
      .select()
      .single();

    if (dbError) {
      console.error("DB error:", dbError);
      throw new Error("Failed to save submission");
    }

    return new Response(JSON.stringify({ success: true, evaluation, submission: inserted }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("evaluate-tool error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
