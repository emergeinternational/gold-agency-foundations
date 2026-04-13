
-- Create submissions table
CREATE TABLE public.submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  full_name TEXT,
  email TEXT,
  phone TEXT,
  country TEXT,
  city TEXT,
  category TEXT,
  instagram TEXT,
  tiktok TEXT,
  youtube TEXT,
  website TEXT,
  experience_level TEXT,
  portfolio_url TEXT,
  sample_url TEXT,
  status TEXT DEFAULT 'new',
  source TEXT DEFAULT 'ascend',
  notes TEXT
);

-- Create prequalification_results table
CREATE TABLE public.prequalification_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  submission_id UUID REFERENCES public.submissions(id) ON DELETE CASCADE,
  category TEXT,
  score INTEGER,
  critical_pass BOOLEAN,
  outcome TEXT,
  answers JSONB
);

-- Enable RLS on both tables
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prequalification_results ENABLE ROW LEVEL SECURITY;

-- Public insert policy for submissions (anonymous form submissions)
CREATE POLICY "Anyone can submit" ON public.submissions FOR INSERT WITH CHECK (true);

-- Only admins can read submissions
CREATE POLICY "Admins can read submissions" ON public.submissions FOR SELECT USING (public.is_privileged_user());

-- Only admins can update submissions
CREATE POLICY "Admins can update submissions" ON public.submissions FOR UPDATE USING (public.is_privileged_user());

-- Public insert for prequalification results (created alongside submissions)
CREATE POLICY "Anyone can insert prequalification results" ON public.prequalification_results FOR INSERT WITH CHECK (true);

-- Only admins can read prequalification results
CREATE POLICY "Admins can read prequalification results" ON public.prequalification_results FOR SELECT USING (public.is_privileged_user());

-- Only admins can update prequalification results
CREATE POLICY "Admins can update prequalification results" ON public.prequalification_results FOR UPDATE USING (public.is_privileged_user());
