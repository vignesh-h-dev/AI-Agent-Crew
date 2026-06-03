CREATE TABLE public.tool_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  security_score NUMERIC,
  privacy_score NUMERIC,
  accuracy_score NUMERIC,
  vulnerability_score NUMERIC,
  overall_score NUMERIC,
  ai_review TEXT,
  reviewer_notes TEXT
);

ALTER TABLE public.tool_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit tools" ON public.tool_submissions
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can read approved tools" ON public.tool_submissions
  FOR SELECT TO anon, authenticated
  USING (true);