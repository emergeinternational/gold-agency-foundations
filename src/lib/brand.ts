// Centralized brand configuration — change the flagship name here and it updates everywhere
export const BRAND = {
  name: "Ascend Elite Agency",
  tagline: "Development-Stage Talent Representation",
  poweredBy: "Emerge Globally",
  poweredByUrl: "https://emergeglobally.com",
  poweredByLine: "Development Division of Emerge Globally",
  legalEntity: "Casa Noir LLC",
  legalRelationship: "Ascend Elite Agency operates as a development division of Emerge Globally, a New York–based company.",
  // Headquarters / international base
  headquarters: "New York City",
  // On-the-ground partnership / creative activity location (not HQ)
  locationPrimary: "Addis Ababa",
  locationVision: "New York City",
  // Approved positioning statements
  positioningLong:
    "Ascend Elite is an international talent and media platform based in New York City, with on-the-ground partnerships and creative activity across Africa, including Addis Ababa, Ethiopia.",
  positioningShort:
    "International talent and media platform based in New York City, with on-the-ground partnerships across Africa.",
  email: "info@ascendeliteagency.com",
  phone: "+251 000 000 000",
  // Only verified, active social accounts. Inactive handles are intentionally
  // omitted so we never link to placeholder or incorrect accounts.
  socialLinks: {
    instagram: "https://www.instagram.com/ascendelitehq",
    tiktok: "https://www.tiktok.com/@ascendeliteagency",
  },
} as const;

export const TALENT_CATEGORIES = [
  {
    id: "actors",
    label: "Actors",
    description: "Screen, stage, commercial, voice, and performance talent preparing for casting and professional representation opportunities.",
    specialties: ["Screen Actor", "Stage Actor", "Commercial Actor", "Voice Actor", "Comedian", "Performance Artist"],
    profileEmphasis: "video" as const,
  },
  {
    id: "actresses",
    label: "Actresses",
    description: "Screen, stage, commercial, voice, and performance talent who prefer actress as their public professional label.",
    specialties: ["Screen Actress", "Stage Actress", "Commercial Actress", "Voice Actress", "Presenter", "Performance Artist"],
    profileEmphasis: "video" as const,
  },
  {
    id: "media-personalities",
    label: "Media Personalities",
    description: "Television anchors, radio hosts, podcast leaders, commentators, and broadcast talent shaping modern media. Includes demo reel development, on-camera training, and broadcast positioning assets.",
    specialties: ["TV Anchor", "Radio Host", "Podcast Host", "Commentator", "Broadcast Journalist", "Panel Moderator"],
    profileEmphasis: "video" as const,
  },
  {
    id: "hosts-presenters",
    label: "Hosts & Presenters",
    description: "Event emcees, show hosts, moderators, MCs, and stage presenters commanding audiences with authority and charisma.",
    specialties: ["Event MC", "Show Host", "Moderator", "Conference Speaker", "Gala Host", "Awards Presenter"],
    profileEmphasis: "video" as const,
  },
  {
    id: "musicians",
    label: "Musicians",
    description: "Artists, vocalists, producers, and composers creating sound that moves the world. Includes EPK development, release strategy guidance, and global distribution positioning.",
    specialties: ["Vocalist", "Instrumentalist", "Producer", "Composer", "DJ", "Songwriter"],
    profileEmphasis: "audio" as const,
  },
  {
    id: "voice-narration",
    label: "Voice & Narration",
    description: "Voice-over artists, narrators, dubbing talent, and spoken word performers lending their voice to stories, brands, and productions worldwide. Includes voice demo production and commercial positioning assets.",
    specialties: ["Voice-Over Artist", "Narrator", "Dubbing Talent", "Audiobook Narrator", "Commercial VO", "Spoken Word Artist"],
    profileEmphasis: "audio" as const,
  },
  {
    id: "speakers-storytellers",
    label: "Speakers & Storytellers",
    description: "Keynote speakers, cultural storytellers, spoken word artists, and public voices who command rooms and shape conversations.",
    specialties: ["Keynote Speaker", "Cultural Storyteller", "Spoken Word Artist", "TEDx Speaker", "Motivational Speaker", "Panel Speaker"],
    profileEmphasis: "video" as const,
  },
  {
    id: "influencers",
    label: "Influencers",
    description: "Digital thought leaders and social media voices driving culture and conversation.",
    specialties: ["Lifestyle Influencer", "Fashion Influencer", "Tech Influencer", "Cultural Commentator", "Brand Ambassador"],
    profileEmphasis: "video" as const,
  },
  {
    id: "content-creators",
    label: "Content Creators",
    description: "Creators building audiences, original formats, brand partnerships, and platform-native media across social and streaming channels.",
    specialties: ["YouTuber", "Streamer", "Podcaster", "UGC Creator", "Lifestyle Creator", "Gaming Creator", "Technology Creator"],
    profileEmphasis: "video" as const,
  },
  {
    id: "models",
    label: "Models",
    description: "Editorial, commercial, and runway talent representing diverse beauty standards. Includes comp card development, test shoots, and portfolio positioning for agency and brand readiness.",
    specialties: ["Editorial", "Commercial", "Runway", "Fitness", "Plus-Size", "Parts Model"],
    profileEmphasis: "gallery" as const,
  },
  {
    id: "actors-performers",
    label: "Actors & Performers",
    description: "Film, television, theater, voice-over, and performance artists bringing stories to life across every medium. Includes headshots, casting profiles, and performance reel development.",
    specialties: ["Film Actor", "TV Actor", "Theater Performer", "Voice Actor", "Commercial Actor", "Stunt Performer"],
    profileEmphasis: "video" as const,
  },
  {
    id: "digital-creators",
    label: "Digital Creators",
    description: "Content creators, filmmakers, and digital storytellers defining the new creative economy. Includes content strategy systems, brand positioning kits, and platform growth alignment.",
    specialties: ["YouTuber", "Streamer", "Podcaster", "Filmmaker", "Photographer", "Videographer", "Editor", "Short-Form Creator"],
    profileEmphasis: "video" as const,
  },
  {
    id: "film-production",
    label: "Film, TV & Production",
    description: "Directors, producers, screenwriters, crew, editors, and production professionals building filmed, live, and digital projects.",
    specialties: ["Director", "Producer", "Screenwriter", "Filmmaker", "Videographer", "Editor", "Production Crew"],
    profileEmphasis: "video" as const,
  },
  {
    id: "fashion-beauty",
    label: "Fashion & Beauty",
    description: "Fashion designers, stylists, makeup artists, hair artists, and beauty professionals supporting talent, campaigns, and productions.",
    specialties: ["Fashion Designer", "Stylist", "Makeup Artist", "Hair Artist", "Beauty Creator", "Wardrobe Professional"],
    profileEmphasis: "gallery" as const,
  },
  {
    id: "sports-fitness",
    label: "Sports & Fitness",
    description: "Athletes, trainers, wellness personalities, fitness creators, and sport-focused talent with media and brand potential.",
    specialties: ["Athlete", "Fitness Creator", "Coach", "Sports Creator", "Wellness Creator", "Trainer"],
    profileEmphasis: "video" as const,
  },
  {
    id: "writers-journalists",
    label: "Writers & Journalists",
    description: "Writers, journalists, commentators, bloggers, and editorial voices with perspective, audience, or production potential.",
    specialties: ["Journalist", "Writer", "Author", "Blogger", "Commentator", "Business Creator"],
    profileEmphasis: "narrative" as const,
  },
  {
    id: "cultural-voices",
    label: "Cultural Voices",
    description: "Multidisciplinary talent bridging art, culture, and community on a global stage — from curators and writers to cultural strategists.",
    specialties: ["Cultural Strategist", "Curator", "Writer", "Community Leader", "Multidisciplinary Artist", "Cultural Commentator"],
    profileEmphasis: "narrative" as const,
  },
] as const;

export type TalentCategory = typeof TALENT_CATEGORIES[number];
export type ProfileEmphasis = TalentCategory["profileEmphasis"];

export type ApplicantMediaRole = "headshot" | "media_kit" | "sample";

export type CategoryApplicationRequirement = {
  summary: string;
  requiredMedia: ApplicantMediaRole[];
  recommendedMedia: ApplicantMediaRole[];
  linkRequirement: "portfolio_or_social" | "social_platform" | "portfolio_or_reel" | "optional";
  guidance: string[];
};

export const CATEGORY_APPLICATION_REQUIREMENTS: Record<string, CategoryApplicationRequirement> = {
  models: {
    summary: "Models need current photos that show face, proportions, and presentation.",
    requiredMedia: ["headshot", "media_kit"],
    recommendedMedia: ["sample"],
    linkRequirement: "portfolio_or_social",
    guidance: ["Upload a clear headshot.", "Upload a full-length or profile image.", "Portfolio, comp card, or social links help reviewers evaluate fit."],
  },
  actors: {
    summary: "Actors need a clear headshot. A reel or resume helps when available, but beginners may still apply.",
    requiredMedia: ["headshot"],
    recommendedMedia: ["media_kit", "sample"],
    linkRequirement: "portfolio_or_reel",
    guidance: ["Upload a recent headshot.", "Add resume, credits, or reel if available.", "Do not invent credits or training."],
  },
  actresses: {
    summary: "Actresses need a clear headshot. A reel or resume helps when available, but beginners may still apply.",
    requiredMedia: ["headshot"],
    recommendedMedia: ["media_kit", "sample"],
    linkRequirement: "portfolio_or_reel",
    guidance: ["Upload a recent headshot.", "Add resume, credits, or reel if available.", "Do not invent credits or training."],
  },
  "actors-performers": {
    summary: "Performers need a clear headshot plus performance evidence when available.",
    requiredMedia: ["headshot"],
    recommendedMedia: ["media_kit", "sample"],
    linkRequirement: "portfolio_or_reel",
    guidance: ["Upload a recent headshot.", "Add clips, reel, resume, or training notes where available."],
  },
  "content-creators": {
    summary: "Creators need a profile image and active platform links so audience and content style can be reviewed.",
    requiredMedia: ["headshot"],
    recommendedMedia: ["sample"],
    linkRequirement: "social_platform",
    guidance: ["Provide public social or channel links.", "Sample content links are more useful than follower claims alone."],
  },
  influencers: {
    summary: "Influencers need profile media and public social links for brand-fit review.",
    requiredMedia: ["headshot"],
    recommendedMedia: ["sample"],
    linkRequirement: "social_platform",
    guidance: ["Provide Instagram, TikTok, YouTube, or website links.", "Add collaboration or media kit if available."],
  },
  "digital-creators": {
    summary: "Digital creators need public work samples or channels for content-quality review.",
    requiredMedia: ["headshot"],
    recommendedMedia: ["sample"],
    linkRequirement: "social_platform",
    guidance: ["Provide channel or portfolio links.", "Upload a sample clip or media kit when available."],
  },
  "film-production": {
    summary: "Production professionals need a reel, portfolio, credits, or project links.",
    requiredMedia: [],
    recommendedMedia: ["media_kit", "sample"],
    linkRequirement: "portfolio_or_reel",
    guidance: ["Add portfolio, reel, or project links.", "Upload credits, resume, or samples if available."],
  },
  musicians: {
    summary: "Musicians need listenable work samples or public music links.",
    requiredMedia: [],
    recommendedMedia: ["headshot", "sample"],
    linkRequirement: "portfolio_or_reel",
    guidance: ["Provide streaming, music, or performance links.", "Upload audio/video sample when available."],
  },
  "voice-narration": {
    summary: "Voice talent needs a voice sample or demo link.",
    requiredMedia: [],
    recommendedMedia: ["sample"],
    linkRequirement: "portfolio_or_reel",
    guidance: ["Provide a voice demo, narration sample, or commercial read link."],
  },
  "fashion-beauty": {
    summary: "Fashion and beauty professionals need portfolio evidence of finished work.",
    requiredMedia: [],
    recommendedMedia: ["headshot", "media_kit", "sample"],
    linkRequirement: "portfolio_or_reel",
    guidance: ["Provide portfolio or campaign links.", "Upload lookbook, resume, or samples where available."],
  },
};

export const DEFAULT_APPLICATION_REQUIREMENT: CategoryApplicationRequirement = {
  summary: "Submit the strongest current materials you have. Requirements adapt by category.",
  requiredMedia: ["headshot"],
  recommendedMedia: ["media_kit", "sample"],
  linkRequirement: "portfolio_or_social",
  guidance: ["Upload a clear profile image.", "Add portfolio, social, reel, or sample links when available."],
};

export const ACADEMY_TRACKS = [
  "Media & Hosting",
  "On-Camera Confidence",
  "Interview Skills",
  "Influencer Growth",
  "Social Media Strategy",
  "Artist Branding",
  "Music Industry Basics",
  "Public Speaking",
  "Voice & Narration Craft",
  "Professionalism & Etiquette",
  "Intellectual Property Basics",
] as const;

// Roster status — controls the submission → review → public pipeline
export type RosterStatus = "submitted" | "under-review" | "represented" | "alumni";

// Sample roster structure for future backend integration
export interface RosterTalent {
  slug: string;
  name: string;
  categoryId: string;
  specialties: string[];
  location: string;
  image: string;
  shortBio: string;
  status: RosterStatus;
  profileEmphasis: ProfileEmphasis;
  // Modular content — populated based on talent type
  reelUrl?: string;
  audioDemo?: string;
  galleryImages?: string[];
  narrativeBio?: string;
}
