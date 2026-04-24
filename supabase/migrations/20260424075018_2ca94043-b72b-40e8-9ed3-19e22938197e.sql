-- ============================================================
-- Phase 1: Admin Hub backing tables (additive, non-destructive)
-- ============================================================

-- 1. opportunity_cards -----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.opportunity_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  status_label text,
  application_mode text NOT NULL,
  opportunity_slug text NOT NULL UNIQUE,
  opportunity_title text,
  button_label text DEFAULT 'Submit for Review',
  category_options jsonb,
  type_label text,
  featured boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  starts_at timestamptz,
  ends_at timestamptz,
  location text,
  contact_phone text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.opportunity_cards ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active opportunity cards" ON public.opportunity_cards;
CREATE POLICY "Public can view active opportunity cards"
  ON public.opportunity_cards FOR SELECT
  USING (is_active = true);

DROP POLICY IF EXISTS "Admins manage opportunity cards" ON public.opportunity_cards;
CREATE POLICY "Admins manage opportunity cards"
  ON public.opportunity_cards FOR ALL
  USING (public.is_privileged_user())
  WITH CHECK (public.is_privileged_user());

DROP TRIGGER IF EXISTS trg_opportunity_cards_updated_at ON public.opportunity_cards;
CREATE TRIGGER trg_opportunity_cards_updated_at
  BEFORE UPDATE ON public.opportunity_cards
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2. partner_inquiries ----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.partner_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inquiry_type text,
  name text,
  email text,
  phone text,
  company text,
  message text,
  status text NOT NULL DEFAULT 'new',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.partner_inquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can submit a partner inquiry" ON public.partner_inquiries;
CREATE POLICY "Anyone can submit a partner inquiry"
  ON public.partner_inquiries FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins read partner inquiries" ON public.partner_inquiries;
CREATE POLICY "Admins read partner inquiries"
  ON public.partner_inquiries FOR SELECT
  USING (public.is_privileged_user());

DROP POLICY IF EXISTS "Admins update partner inquiries" ON public.partner_inquiries;
CREATE POLICY "Admins update partner inquiries"
  ON public.partner_inquiries FOR UPDATE
  USING (public.is_privileged_user())
  WITH CHECK (public.is_privileged_user());

DROP POLICY IF EXISTS "Admins delete partner inquiries" ON public.partner_inquiries;
CREATE POLICY "Admins delete partner inquiries"
  ON public.partner_inquiries FOR DELETE
  USING (public.is_privileged_user());

DROP TRIGGER IF EXISTS trg_partner_inquiries_updated_at ON public.partner_inquiries;
CREATE TRIGGER trg_partner_inquiries_updated_at
  BEFORE UPDATE ON public.partner_inquiries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3. admin_activity_log ---------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id uuid,
  action text NOT NULL,
  entity_type text,
  entity_id uuid,
  details jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_activity_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins read activity log" ON public.admin_activity_log;
CREATE POLICY "Admins read activity log"
  ON public.admin_activity_log FOR SELECT
  USING (public.is_privileged_user());

DROP POLICY IF EXISTS "Admins insert activity log" ON public.admin_activity_log;
CREATE POLICY "Admins insert activity log"
  ON public.admin_activity_log FOR INSERT
  WITH CHECK (public.is_privileged_user());

CREATE INDEX IF NOT EXISTS idx_admin_activity_log_created_at
  ON public.admin_activity_log (created_at DESC);

-- 4. Seed approved opportunity cards (idempotent via slug) ----------------
INSERT INTO public.opportunity_cards (
  title, description, status_label, application_mode, opportunity_slug,
  opportunity_title, type_label, featured, sort_order, category_options
) VALUES
(
  'Featured Casting Call',
  'Submit for a featured casting opportunity. Selected applicants will receive date, time, location, and next-step details through Telegram.',
  'Upcoming', 'casting', 'featured_casting_call', 'Featured Casting Call', 'Featured Casting',
  true, 1,
  '["Model","Actor / Performer","Host / Media Personality","Voiceover / Narration","Influencer / Content Creator","Dancer","Comedian","Musician / Artist","Other Casting Talent"]'::jsonb
),
(
  'Ongoing Casting Call',
  'Submit for current and future casting opportunities across media, campaigns, productions, and live opportunities.',
  'Ongoing', 'casting', 'ongoing_casting_call', 'Ongoing Casting Call', 'Casting',
  false, 2,
  '["Model","Actor / Performer","Host / Media Personality","Voiceover / Narration","Influencer / Content Creator","Dancer","Comedian","Musician / Artist","Other Casting Talent"]'::jsonb
),
(
  'New Faces Talent Review',
  'Seeking fresh creative talent across categories for review, development, representation readiness, and future opportunities. Submission does not guarantee selection.',
  'Active', 'representation', 'new_faces_talent_review', 'New Faces Talent Review', 'Representation Review',
  false, 3,
  '["Model","Actor / Performer","Host / Media Personality","Voiceover / Narration","Singer / Music Artist","Rapper","DJ","Producer","Songwriter","Musician","Influencer / Content Creator","TikTok Creator","YouTuber","Podcaster","Livestream Personality","Photographer","Videographer","Video Editor","Graphic Designer","Creative Director","Stylist","Makeup Artist","Fashion Designer","Journalist / Interviewer","Event Host","Brand Ambassador","Entrepreneur with Media Potential","Other"]'::jsonb
),
(
  'Addis Creative Showcase',
  'A curated evening of live performance, industry introductions, and creative presentation in Addis Ababa.',
  'Upcoming', 'media_opportunity', 'creative_showcase', 'Addis Creative Showcase', 'Showcase',
  false, 4,
  '["Model","Actor / Performer","Singer / Music Artist","Rapper","DJ","Musician","Dancer","Photographer","Videographer","Fashion Designer","Stylist","Makeup Artist","Creative Director","Content Creator","Other Creative Talent"]'::jsonb
),
(
  'East Africa Media Fellowship',
  'A regional mentorship and exposure program for media-focused talent, developed with industry partners.',
  'Upcoming', 'media_opportunity', 'east_african_media_fellowship', 'East Africa Media Fellowship', 'Partner Opportunity',
  false, 5,
  '["Host / Media Personality","Journalist / Interviewer","Podcaster","Content Creator","YouTuber","Videographer","Video Editor","Producer","Creative Director","Other Media Talent"]'::jsonb
),
(
  'Brand Campaign — Spring 2026',
  'Internal casting for a major commercial campaign. Priority consideration for represented talent.',
  'Active', 'brand_campaign', 'brand_campaign_spring_2026', 'Brand Campaign — Spring 2026', 'Internal Casting',
  false, 6,
  '["Influencer / Content Creator","TikTok Creator","YouTuber","Livestream Personality","Model","Brand Ambassador","Photographer","Videographer","Creative Director","Stylist","Makeup Artist","Other Brand Campaign Talent"]'::jsonb
),
(
  'Program Spotlight Series',
  'Outstanding development program participants featured in our digital spotlight content across channels.',
  'Ongoing', 'media_opportunity', 'program_spotlight_series', 'Program Spotlight Series', 'Development-Linked',
  false, 7,
  '["Host / Media Personality","Podcaster","Journalist / Interviewer","Content Creator","Videographer","Video Editor","Producer","Creative Director","Entrepreneur with Media Potential","Other Program Talent"]'::jsonb
),
(
  'Monthly Creative Spotlight',
  'Each month, one emerging talent is featured across our channels and shared with partner networks.',
  'Ongoing', 'media_opportunity', 'monthly_creative_spotlight', 'Monthly Creative Spotlight', 'Talent Feature',
  false, 8,
  '["Model","Actor / Performer","Singer / Music Artist","Rapper","DJ","Musician","Photographer","Videographer","Graphic Designer","Creative Director","Fashion Designer","Stylist","Makeup Artist","Content Creator","Other Creative Talent"]'::jsonb
),
(
  'Music Talent Spotlight',
  'A dedicated feature surface for emerging musicians, vocalists, and producers ready for broader audience exposure.',
  'Ongoing', 'media_opportunity', 'music_talent_spotlight', 'Music Talent Spotlight', 'Music Feature',
  false, 9,
  '["Singer / Music Artist","Rapper","DJ","Producer","Songwriter","Musician","Performer","Other Music Talent"]'::jsonb
),
(
  'Visual Creators Opportunity',
  'For photographers, directors, and visual storytellers building portfolios for editorial, brand, and media partners.',
  'Active', 'media_opportunity', 'visual_creators_opportunity', 'Visual Creators Opportunity', 'Visual Creators',
  false, 10,
  '["Photographer","Videographer","Video Editor","Graphic Designer","Creative Director","Stylist","Makeup Artist","Fashion Designer","Other Visual Creative"]'::jsonb
),
(
  'Creator Campaigns',
  'Ongoing creator-led campaign opportunities with regional and international brand partners.',
  'Active', 'brand_campaign', 'creator_campaigns', 'Creator Campaigns', 'Brand Collaboration',
  false, 11,
  '["Influencer / Content Creator","TikTok Creator","YouTuber","Podcaster","Livestream Personality","Brand Ambassador","Model","Other Creator Talent"]'::jsonb
),
(
  'Training & Development Opportunities',
  'Structured preparation, positioning, and readiness-building pathways for talent committed to international standards.',
  'Ongoing', 'training_development', 'training_development_opportunities', 'Training & Development Opportunities', 'Development Pathway',
  false, 12,
  '["Model","Actor / Performer","Host / Media Personality","Voiceover / Narration","Singer / Music Artist","Rapper","DJ","Musician","Influencer / Content Creator","Photographer","Videographer","Brand Ambassador","Other"]'::jsonb
)
ON CONFLICT (opportunity_slug) DO NOTHING;