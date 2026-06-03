import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const { problemStatement, toolName } = await req.json();
    if (!problemStatement?.trim()) {
      return new Response(JSON.stringify({ error: "Problem statement required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const prompt = `Generate a clean, professional UI mockup/screenshot showing what the output would look like when using ${toolName || "an AI tool"} to solve this problem: "${problemStatement.trim()}". 
Show a realistic application interface with sample results, data visualizations, or generated content that would be produced. Make it look like an actual software screenshot with a modern dark UI theme.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3.1-flash-image-preview",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted" }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("Image gen error:", response.status, t);
      throw new Error(`Image generation failed: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    // The image model returns inline_data with base64
    const parts = data.choices?.[0]?.message?.parts || [];
    let imageBase64 = null;
    let mimeType = "image/png";

    for (const part of parts) {
      if (part.inline_data) {
        imageBase64 = part.inline_data.data;
        mimeType = part.inline_data.mime_type || "image/png";
        break;
      }
    }

    // Also check if content contains image data in markdown format
    if (!imageBase64 && content) {
      const imgMatch = content.match(/!\[.*?\]\((data:image\/[^;]+;base64,[^)]+)\)/);
      if (imgMatch) {
        const dataUrl = imgMatch[1];
        const [header, b64] = dataUrl.split(",");
        imageBase64 = b64;
        mimeType = header.split(":")[1]?.split(";")[0] || "image/png";
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        imageBase64, 
        mimeType,
        textContent: content || null 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("generate-mockup error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
