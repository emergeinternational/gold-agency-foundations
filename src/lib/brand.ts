// Centralized brand configuration — change the flagship name here and it updates everywhere
export const BRAND = {
  name: "Ascend Elite Agency",
  tagline: "Development-Stage Talent Representation",
  poweredBy: "Emerge Globally",
  poweredByLine: "An Emerge Globally Affiliated Agency",
  legalEntity: "Casa Noir LLC",
  legalRelationship: "Emerge Globally, a subsidiary of Casa Noir LLC",
  locationPrimary: "Addis Ababa",
  locationVision: "New York City",
  email: "info@ascendeliteagency.com",
  phone: "+251 000 000 000",
  socialLinks: {
    instagram: "https://instagram.com/ascendeliteagency",
    twitter: "https://x.com/ascendeliteagency",
    youtube: "https://youtube.com/@ascendeliteagency",
    linkedin: "https://linkedin.com/company/ascendeliteagency",
    tiktok: "https://tiktok.com/@ascendeliteagency",
  },
} as const;

export const TALENT_CATEGORIES = [
  {
    id: "media-personalities",
    label: "Media Personalities",
    description: "Television anchors, radio hosts, podcast leaders, commentators, and broadcast talent shaping modern media.",
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
    description: "Artists, vocalists, producers, and composers creating sound that moves the world.",
    specialties: ["Vocalist", "Instrumentalist", "Producer", "Composer", "DJ", "Songwriter"],
    profileEmphasis: "audio" as const,
  },
  {
    id: "voice-narration",
    label: "Voice & Narration",
    description: "Voice-over artists, narrators, dubbing talent, and spoken word performers lending their voice to stories, brands, and productions worldwide.",
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
    id: "models",
    label: "Models",
    description: "Editorial, commercial, and runway talent representing diverse beauty standards.",
    specialties: ["Editorial", "Commercial", "Runway", "Fitness", "Plus-Size", "Parts Model"],
    profileEmphasis: "gallery" as const,
  },
  {
    id: "actors-performers",
    label: "Actors & Performers",
    description: "Film, television, theater, voice-over, and performance artists bringing stories to life across every medium.",
    specialties: ["Film Actor", "TV Actor", "Theater Performer", "Voice Actor", "Commercial Actor", "Stunt Performer"],
    profileEmphasis: "video" as const,
  },
  {
    id: "digital-creators",
    label: "Digital Creators",
    description: "Content creators, filmmakers, and digital storytellers defining the new creative economy.",
    specialties: ["YouTuber", "Filmmaker", "Photographer", "Animator", "Short-Form Creator", "Documentary Maker"],
    profileEmphasis: "video" as const,
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
