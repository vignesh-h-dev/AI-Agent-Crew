export type AITool = {
  id: string;
  name: string;
  description: string;
  category: string;
  pricing: string;
  url: string;
  tags: string[];
  isNew?: boolean;
  isFeatured?: boolean;
};

export const categories = [
  "All",
  "Text Generation",
  "Image Generation",
  "Video Generation",
  "Audio & Music",
  "Code Assistant",
  "Chatbot",
  "Data Analysis",
  "Design",
  "Writing Assistant",
  "Productivity",
  "Research",
  "Marketing",
  "Education",
  "Healthcare",
] as const;

export const pricingFilters = ["All", "Free", "Freemium", "Paid", "Open Source"] as const;

export const tools: AITool[] = [
  { id: "1", name: "ChatGPT", description: "Advanced conversational AI for text generation, coding, analysis, and creative tasks.", category: "Chatbot", pricing: "Freemium", url: "https://chat.openai.com", tags: ["Chatbot", "Text Generation", "Code Assistant"], isFeatured: true },
  { id: "2", name: "Midjourney", description: "Create stunning, imaginative artwork from text descriptions using AI.", category: "Image Generation", pricing: "Paid", url: "https://midjourney.com", tags: ["Image Generation", "Design"], isFeatured: true },
  { id: "3", name: "Claude", description: "Anthropic's helpful, harmless AI assistant for thoughtful conversations.", category: "Chatbot", pricing: "Freemium", url: "https://claude.ai", tags: ["Chatbot", "Text Generation", "Research"], isNew: true },
  { id: "4", name: "DALL·E 3", description: "OpenAI's image generation model creating detailed images from text prompts.", category: "Image Generation", pricing: "Paid", url: "https://openai.com/dall-e-3", tags: ["Image Generation"], isFeatured: true },
  { id: "5", name: "GitHub Copilot", description: "AI-powered code completion and suggestion tool for developers.", category: "Code Assistant", pricing: "Paid", url: "https://github.com/features/copilot", tags: ["Code Assistant", "Productivity"] },
  { id: "6", name: "Runway ML", description: "AI-powered video generation and editing tools for creators.", category: "Video Generation", pricing: "Freemium", url: "https://runwayml.com", tags: ["Video Generation", "Design"], isNew: true },
  { id: "7", name: "Jasper", description: "AI content generation platform for marketing teams and businesses.", category: "Writing Assistant", pricing: "Paid", url: "https://jasper.ai", tags: ["Writing Assistant", "Marketing"] },
  { id: "8", name: "Stable Diffusion", description: "Open-source image generation model you can run locally.", category: "Image Generation", pricing: "Open Source", url: "https://stability.ai", tags: ["Image Generation", "Open Source"] },
  { id: "9", name: "ElevenLabs", description: "AI voice generation and cloning with natural-sounding speech.", category: "Audio & Music", pricing: "Freemium", url: "https://elevenlabs.io", tags: ["Audio & Music", "Text Generation"] },
  { id: "10", name: "Notion AI", description: "AI writing assistant integrated into the Notion workspace.", category: "Productivity", pricing: "Paid", url: "https://notion.so/product/ai", tags: ["Productivity", "Writing Assistant"] },
  { id: "11", name: "Perplexity", description: "AI-powered search engine that provides cited, accurate answers.", category: "Research", pricing: "Freemium", url: "https://perplexity.ai", tags: ["Research", "Chatbot"], isNew: true },
  { id: "12", name: "Suno", description: "Create original songs with vocals and instruments using AI.", category: "Audio & Music", pricing: "Freemium", url: "https://suno.com", tags: ["Audio & Music"], isNew: true },
  { id: "13", name: "Canva AI", description: "AI-powered design tools within Canva for quick visual creation.", category: "Design", pricing: "Freemium", url: "https://canva.com", tags: ["Design", "Image Generation", "Marketing"] },
  { id: "14", name: "Grammarly", description: "AI writing assistant for grammar, clarity, and tone improvement.", category: "Writing Assistant", pricing: "Freemium", url: "https://grammarly.com", tags: ["Writing Assistant", "Productivity"] },
  { id: "15", name: "Synthesia", description: "Create AI-generated videos with realistic digital avatars.", category: "Video Generation", pricing: "Paid", url: "https://synthesia.io", tags: ["Video Generation", "Marketing"] },
  { id: "16", name: "Cursor", description: "AI-first code editor built for pair programming with AI.", category: "Code Assistant", pricing: "Freemium", url: "https://cursor.sh", tags: ["Code Assistant", "Productivity"], isNew: true },
  { id: "17", name: "Gemini", description: "Google's multimodal AI model for text, image, and code tasks.", category: "Chatbot", pricing: "Free", url: "https://gemini.google.com", tags: ["Chatbot", "Text Generation", "Code Assistant"] },
  { id: "18", name: "Copy.ai", description: "AI-powered copywriting tool for marketing and sales content.", category: "Marketing", pricing: "Freemium", url: "https://copy.ai", tags: ["Marketing", "Writing Assistant"] },
  { id: "19", name: "Hugging Face", description: "Platform for sharing and deploying open-source ML models.", category: "Research", pricing: "Open Source", url: "https://huggingface.co", tags: ["Research", "Code Assistant", "Open Source"] },
  { id: "20", name: "Descript", description: "AI-powered audio and video editing through text-based editing.", category: "Video Generation", pricing: "Freemium", url: "https://descript.com", tags: ["Video Generation", "Audio & Music", "Productivity"] },
  { id: "21", name: "Khan Academy Khanmigo", description: "AI tutoring assistant for personalized learning experiences.", category: "Education", pricing: "Paid", url: "https://khanacademy.org", tags: ["Education", "Chatbot"] },
  { id: "22", name: "Tableau AI", description: "AI-powered data visualization and business intelligence insights.", category: "Data Analysis", pricing: "Paid", url: "https://tableau.com", tags: ["Data Analysis", "Productivity"] },
  { id: "23", name: "Lovable", description: "AI-powered full-stack web app builder from natural language prompts.", category: "Code Assistant", pricing: "Freemium", url: "https://lovable.dev", tags: ["Code Assistant", "Design", "Productivity"], isFeatured: true },
  { id: "24", name: "Otter.ai", description: "AI meeting transcription and note-taking assistant.", category: "Productivity", pricing: "Freemium", url: "https://otter.ai", tags: ["Productivity", "Audio & Music"] },
];
