-- Add opportunity tracking columns to submissions (additive only)
ALTER TABLE public.submissions
  ADD COLUMN IF NOT EXISTS opportunity_slug text,
  ADD COLUMN IF NOT EXISTS opportunity_title text;

CREATE INDEX IF NOT EXISTS idx_submissions_opportunity_slug ON public.submissions(opportunity_slug);

-- Partnership inquiries table (separate from talent submissions)
CREATE TABLE IF NOT EXISTS public.partnership_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization text NOT NULL,
  contact_name text,
  email text NOT NULL,
  phone text,
  inquiry_type text NOT NULL,
  partnership_type_legacy text,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new',
  admin_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_partnership_inquiries_status ON public.partnership_inquiries(status);
CREATE INDEX IF NOT EXISTS idx_partnership_inquiries_inquiry_type ON public.partnership_inquiries(inquiry_type);
CREATE INDEX IF NOT EXISTS idx_partnership_inquiries_created_at ON public.partnership_inquiries(created_at DESC);

ALTER TABLE public.partnership_inquiries ENABLE ROW LEVEL SECURITY;

-- Anyone (including anonymous visitors) can submit a partnership inquiry
DROP POLICY IF EXISTS "Anyone can submit partnership inquiry" ON public.partnership_inquiries;
CREATE POLICY "Anyone can submit partnership inquiry"
  ON public.partnership_inquiries
  FOR INSERT
  WITH CHECK (true);

-- Only privileged users (admin/superadmin/founder) can read
DROP POLICY IF EXISTS "Privileged users can read partnership inquiries" ON public.partnership_inquiries;
CREATE POLICY "Privileged users can read partnership inquiries"
  ON public.partnership_inquiries
  FOR SELECT
  USING (public.is_privileged_user());

-- Only privileged users can update (status / notes)
DROP POLICY IF EXISTS "Privileged users can update partnership inquiries" ON public.partnership_inquiries;
CREATE POLICY "Privileged users can update partnership inquiries"
  ON public.partnership_inquiries
  FOR UPDATE
  USING (public.is_privileged_user());

-- Trigger to keep updated_at fresh
DROP TRIGGER IF EXISTS update_partnership_inquiries_updated_at ON public.partnership_inquiries;
CREATE TRIGGER update_partnership_inquiries_updated_at
  BEFORE UPDATE ON public.partnership_inquiries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();