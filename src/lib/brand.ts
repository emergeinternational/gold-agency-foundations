// Centralized brand configuration — change the flagship name here and it updates everywhere
export const BRAND = {
  name: "The Gold Agency",
  tagline: "Premier Talent Representation & Development",
  poweredBy: "Emerge Globally",
  legalEntity: "Casa Noir LLC",
  legalRelationship: "Emerge Globally, a subsidiary of Casa Noir LLC",
  locationPrimary: "Addis Ababa",
  locationVision: "New York City",
  email: "info@thegoldagency.com",
  phone: "+251 000 000 000",
  socialLinks: {
    instagram: "https://instagram.com/thegoldagency",
    twitter: "https://x.com/thegoldagency",
    youtube: "https://youtube.com/@thegoldagency",
    linkedin: "https://linkedin.com/company/thegoldagency",
    tiktok: "https://tiktok.com/@thegoldagency",
  },
} as const;

export const TALENT_CATEGORIES = [
  { id: "media-personalities", label: "Media Personalities", description: "Television anchors, radio hosts, podcast leaders, and broadcast talent shaping modern media." },
  { id: "hosts-presenters", label: "Hosts & Presenters", description: "Event emcees, show hosts, and stage presenters commanding audiences with charisma." },
  { id: "musicians", label: "Musicians", description: "Artists, vocalists, producers, and composers creating sound that moves the world." },
  { id: "influencers", label: "Influencers", description: "Digital thought leaders and social media voices driving culture and conversation." },
  { id: "models", label: "Models", description: "Editorial, commercial, and runway talent representing diverse beauty standards." },
  { id: "actors-performers", label: "Actors & Performers", description: "Film, television, theater, and performance artists bringing stories to life." },
  { id: "digital-creators", label: "Digital Creators", description: "Content creators, filmmakers, and digital storytellers defining the new creative economy." },
  { id: "cultural-voices", label: "Cultural Voices", description: "Multidisciplinary talent bridging art, culture, and community on a global stage." },
] as const;

export const ACADEMY_TRACKS = [
  "Media & Hosting",
  "On-Camera Confidence",
  "Interview Skills",
  "Influencer Growth",
  "Social Media Strategy",
  "Artist Branding",
  "Music Industry Basics",
  "Public Speaking",
  "Professionalism & Etiquette",
  "Intellectual Property Basics",
] as const;
