// Centralized brand configuration — change the flagship name here and it updates everywhere
export const BRAND = {
  name: "Ascend Elite Agency",
  tagline: "Global Talent Development & Career Readiness",
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
    "Ascend Elite Agency is an international talent-development platform based in New York City, with on-the-ground partnerships and creative activity across Africa, including Addis Ababa, Ethiopia.",
  positioningShort:
    "International talent development, career preparation, and market positioning across Africa and global markets.",
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
    id: "media-personalities",
    label: "Media Personalities",
    description: "Television anchors, radio hosts, podcast leaders, commentators, and broadcast talent building credible, camera-ready careers. Development may include demo reels, on-camera coaching, and broadcast positioning.",
    specialties: ["TV Anchor", "Radio Host", "Podcast Host", "Commentator", "Broadcast Journalist", "Panel Moderator"],
    profileEmphasis: "video" as const,
  },
  {
    id: "hosts-presenters",
    label: "Hosts & Presenters",
    description: "Event emcees, show hosts, moderators, MCs, and stage presenters developing the presence, preparation, and versatility required to lead live and recorded formats.",
    specialties: ["Event MC", "Show Host", "Moderator", "Conference Speaker", "Gala Host", "Awards Presenter"],
    profileEmphasis: "video" as const,
  },
  {
    id: "musicians",
    label: "Musicians",
    description: "Artists, vocalists, producers, and composers strengthening their creative identity and commercial readiness. Development may include EPK preparation, release strategy, and market positioning.",
    specialties: ["Vocalist", "Instrumentalist", "Producer", "Composer", "DJ", "Songwriter"],
    profileEmphasis: "audio" as const,
  },
  {
    id: "voice-narration",
    label: "Voice & Narration",
    description: "Voice-over artists, narrators, dubbing talent, and spoken-word performers preparing for commercial, editorial, and production opportunities across markets. Development may include voice demos and professional positioning assets.",
    specialties: ["Voice-Over Artist", "Narrator", "Dubbing Talent", "Audiobook Narrator", "Commercial VO", "Spoken Word Artist"],
    profileEmphasis: "audio" as const,
  },
  {
    id: "speakers-storytellers",
    label: "Speakers & Storytellers",
    description: "Keynote speakers, cultural storytellers, spoken-word artists, and public voices refining their message, delivery, and professional positioning for influential platforms.",
    specialties: ["Keynote Speaker", "Cultural Storyteller", "Spoken Word Artist", "TEDx Speaker", "Motivational Speaker", "Panel Speaker"],
    profileEmphasis: "video" as const,
  },
  {
    id: "influencers",
    label: "Influencers",
    description: "Digital personalities and social-media voices developing stronger audience trust, brand alignment, and long-term commercial potential.",
    specialties: ["Lifestyle Influencer", "Fashion Influencer", "Tech Influencer", "Cultural Commentator", "Brand Ambassador"],
    profileEmphasis: "video" as const,
  },
  {
    id: "models",
    label: "Models",
    description: "Editorial, commercial, and runway talent preparing for professional agency, casting, and brand environments. Development may include comp cards, test shoots, portfolio strategy, and industry-readiness guidance.",
    specialties: ["Editorial", "Commercial", "Runway", "Fitness", "Plus-Size", "Parts Model"],
    profileEmphasis: "gallery" as const,
  },
  {
    id: "actors-performers",
    label: "Actors & Performers",
    description: "Film, television, theater, voice, and performance talent building the materials, discipline, and professional readiness required for casting consideration. Development may include headshots, casting profiles, and performance reels.",
    specialties: ["Film Actor", "TV Actor", "Theater Performer", "Voice Actor", "Commercial Actor", "Stunt Performer"],
    profileEmphasis: "video" as const,
  },
  {
    id: "digital-creators",
    label: "Digital Creators",
    description: "Content creators, filmmakers, and digital storytellers strengthening their positioning, platform strategy, and partnership readiness within the modern creator economy.",
    specialties: ["YouTuber", "Filmmaker", "Photographer", "Animator", "Short-Form Creator", "Documentary Maker"],
    profileEmphasis: "video" as const,
  },
  {
    id: "cultural-voices",
    label: "Cultural Voices",
    description: "Multidisciplinary talent working across art, culture, media, and community, with development focused on clear positioning, credible platforms, and broader market relevance.",
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
