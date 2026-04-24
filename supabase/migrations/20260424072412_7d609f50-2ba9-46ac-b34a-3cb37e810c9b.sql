-- Banner messages table for admin-controlled rotating announcements
CREATE TABLE public.banner_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  text TEXT NOT NULL,
  featured BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  display_ms INTEGER NOT NULL DEFAULT 4500,
  link_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.banner_messages ENABLE ROW LEVEL SECURITY;

-- Public can read active messages
CREATE POLICY "Active banner messages are viewable by everyone"
ON public.banner_messages
FOR SELECT
USING (is_active = true OR public.is_privileged_user());

-- Only privileged users can manage
CREATE POLICY "Privileged users can insert banner messages"
ON public.banner_messages
FOR INSERT
WITH CHECK (public.is_privileged_user());

CREATE POLICY "Privileged users can update banner messages"
ON public.banner_messages
FOR UPDATE
USING (public.is_privileged_user());

CREATE POLICY "Privileged users can delete banner messages"
ON public.banner_messages
FOR DELETE
USING (public.is_privileged_user());

-- Auto-update updated_at
CREATE TRIGGER update_banner_messages_updated_at
BEFORE UPDATE ON public.banner_messages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Seed default messages (matching current static content)
INSERT INTO public.banner_messages (text, featured, sort_order, display_ms) VALUES
('Featured Casting Call Coming Soon — Submit for review and stay connected for details.', true, 1, 9000),
('Now reviewing talent across media, music, fashion, and creative industries.', false, 2, 4500),
('Ascend Elite is powered by Emerge Globally, New York City.', false, 3, 4500),
('Creative opportunities, casting updates, and brand campaigns available through Ascend Elite.', false, 4, 4500);

CREATE INDEX idx_banner_messages_active_order ON public.banner_messages (is_active, sort_order);