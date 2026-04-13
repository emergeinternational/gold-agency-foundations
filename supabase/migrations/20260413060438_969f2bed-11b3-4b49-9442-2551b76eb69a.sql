
CREATE TABLE public.admin_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  submission_id UUID REFERENCES public.submissions(id) ON DELETE CASCADE,
  note TEXT
);

ALTER TABLE public.admin_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read admin_notes" ON public.admin_notes FOR SELECT USING (public.is_privileged_user());
CREATE POLICY "Admins can insert admin_notes" ON public.admin_notes FOR INSERT WITH CHECK (public.is_privileged_user());
CREATE POLICY "Admins can update admin_notes" ON public.admin_notes FOR UPDATE USING (public.is_privileged_user());
CREATE POLICY "Admins can delete admin_notes" ON public.admin_notes FOR DELETE USING (public.is_privileged_user());
