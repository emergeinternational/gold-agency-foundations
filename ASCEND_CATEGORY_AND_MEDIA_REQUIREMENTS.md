# Ascend Category And Media Requirements

## Current Implementation

- Public category selection is centralized in `src/lib/brand.ts` through `TALENT_CATEGORIES`.
- The submit gate maps category IDs to readiness questions in `src/pages/Submit.tsx`.
- Current required media controls are generic: headshot/photo, media kit/resume, and video/audio sample.

## Phase 2 Requirement

Ascend should move from one generic upload package to category-aware requirements:

| Category Family | Examples | Required Media Direction |
| --- | --- | --- |
| Performance | Actor, Actress, Screen Actor, Stage Actor, Voice Actor, Host, Comedian, Dancer | Headshot, recent photo, reel/scene link when available, voice sample for voice roles, training/credits fields. |
| Modeling and Fashion | Fashion Model, Commercial Model, Runway Model, Stylist, Makeup Artist | Headshot, full-length image, profile/side image, optional comp card, measurements, runway/test-shoot media. |
| Content and Digital Media | Content Creator, Influencer, YouTuber, Streamer, Podcaster, UGC Creator | Profile image, social handles, platform metrics, sample content links, niche/language fields. |
| Film, Television and Production | Director, Producer, Filmmaker, Screenwriter, Videographer, Editor | Portfolio/reel, credits/resume, equipment/software skills, project links. |
| Audio and Music | Recording Artist, Songwriter, Composer, DJ, Voiceover Artist | Photo, audio/video performance sample, music links, genre, live experience. |
| Specialty Talent | Athlete, Coach, Public Speaker, Journalist, Author, Creative Entrepreneur | Profile image, credentials, speaking/writing/media samples, niche/market fields. |

## Required Action

Create an authoritative category and requirement model that can feed public forms, admin detail, search, filters, exports, analytics, and future opportunity matching without scattering hard-coded lists.

