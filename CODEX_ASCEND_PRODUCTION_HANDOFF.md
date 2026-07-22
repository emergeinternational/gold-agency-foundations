# Ascend Elite Agency Production Handoff

## Repository
- Path: `/Users/s.w.roseburgh/Documents/Playground/gold-agency-foundations`
- Remote: `https://github.com/emergeinternational/gold-agency-foundations.git`
- Requested production branch: `main`
- Current local branch at audit start: `codex/setup-vite-pages-deploy`
- Branch state after fetch: current branch is 2 commits behind and 1 commit ahead of `origin/main`.
- Deployment platform: Vercel, matching the proven Emerge Globally pattern where technically appropriate.
- Vercel project: `ascend-elite-agency` (`prj_vqPb1szFGAV9qhk3CboA1W7yqLbW`).
- Latest Vercel production deployment: `dpl_7ZFQyR6baroU7NC4fetKAKDbMKaP`.
- Production deployment URL: `https://ascend-elite-agency-q5ye3oces-emerges-projects-c1ae993a.vercel.app`.
- Production alias: `https://ascend-elite-agency.vercel.app`.
- Custom domain: `www.ascendeliteagency.com` is attached to the Vercel project but DNS still points to the prior host.
- Production URL: `https://www.ascendeliteagency.com`
- Supabase project: `fqphlzqactfvaiuoahcd`

## Business Positioning
- Ascend Elite Agency is the talent discovery, development, creator education, portfolio, original content, and career-preparation platform.
- Emerge Globally is the representation and deal-making platform.
- Brand language must keep Ascend development-focused and global, not local-only or representation-first.

## Competitive Benchmark Notes
- Major agencies emphasize global reach, multidisciplinary service lines, and trust signals.
- Creator-facing businesses emphasize creator-business development, brand partnerships, podcasting, gaming, platform strategy, and long-term monetization.
- Model/casting applications commonly ask for concise identity/location/contact/socials/media, clear age/guardian terms, no-fee/scam warnings, and simple next-step expectations.
- Launch-safe improvements should clarify global development positioning, make forms reliable, protect applicant data, and avoid overbuilding large CRM/media systems before traffic starts.

## Inventory
- Frontend: Vite, React, TypeScript, React Router, shadcn/Radix UI, Tailwind, Framer Motion.
- Public routes: `/`, `/about`, `/mr-zik`, `/representation`, `/talent-categories`, `/submit`, `/academy`, `/classes-workshops`, `/tutorials`, `/opportunities`, `/book-talent`, `/partnerships`, `/faq`, `/contact`, `/privacy`, `/terms`, `/submission-terms`, `/submission-success`, `/booking-success`, `/enrollment-success`, `/roster`, `/roster/:slug`, `/sign-in`, `/sign-up`.
- Admin routes: `/admin`, `/admin/review`, `/admin/banners`, `/admin/opportunities`, `/admin/partners`.
- Public forms found: talent submission, partnership inquiry, contact inquiry, booking inquiry.
- Supabase client: `src/integrations/supabase/client.ts` points to project `fqphlzqactfvaiuoahcd` with anon publishable key only.
- Edge Functions: `admin-next-action-trigger`, `admin-telegram-message`, `telegram-start-webhook`.
- Key tables discovered from migrations/types: `submissions`, `prequalification_results`, `admin_notes`, `submission_messages`, `partnership_inquiries`, `partner_inquiries`, `banner_messages`, `opportunity_cards`, `user_roles`, `user_profiles`.

## Bugs Found
- Local working tree started with uncommitted launch fixes for contact/booking persistence, admin partner inquiries, applicant notes display, and anonymous talent submission ID handling.
- Brought the `origin/main` SQL-only public insert fix for `casting_submissions` into this branch so the live duplicate-RPC repair is represented locally.
- Talent submission on `origin/main` still uses `.insert(...).select("id").single()`, which can fail for anonymous users when anon has INSERT but not SELECT.
- Live `prequalification_results` RLS rejected anonymous insert with HTTP 401 / SQLSTATE `42501`.
- Live `is_privileged_user()` was used by RLS policies but anon/authenticated did not have execute permission, causing anonymous protected-table selects to fail with SQLSTATE `42501` instead of returning no rows.
- Live `check_casting_duplicate` was still exposed with the outdated three-argument signature `p_ip_address, p_messaging_handle, p_phone`; the updated two-argument RPC was missing from PostgREST schema cache.
- Public talent form collected files but did not persist uploaded media to Supabase Storage or link uploaded media to the applicant record.
- Supporting-materials copy still said uploads would be active once the backend was connected.
- Footer rendered an external `<a>` inside a React Router `<Link>`, producing a React DOM nesting console error on local browser verification.
- Baseline lint failed on five errors: empty interface types in shadcn components, `any` in `AdminBanners`, `prefer-const` in `telegram-start-webhook`, and Tailwind `require`.
- The old GitHub Pages workflow was an unproven production path and failed because the repository integration could not create/configure Pages. It also required the `build:pages` base path, which is not appropriate for the custom domain/Vercel deployment.

## Bugs Fixed In This Audit
- Fixed lint-blocking empty interface/type errors without changing UI behavior.
- Replaced `any` role row typing in `AdminBanners`.
- Replaced mutable `content` with `const` in `telegram-start-webhook`.
- Replaced Tailwind CommonJS plugin require with ESM import.
- Restored explicit public insert policy for `prequalification_results` while keeping reads admin-only.
- Added private `ascend-applicant-media` bucket provisioning, `submission_media` metadata table, and narrow upload/read/manage policies.
- Added browser-side media uploads before submission insert and linked uploaded objects via `submission_media`.
- Added admin review signed-url loading for applicant media.
- Granted execute on `public.is_privileged_user()` to anon/authenticated/service_role so RLS policies can evaluate without exposing rows.
- Replaced the live `check_casting_duplicate` function only, removing the stale `cs.ip_address`/`p_ip_address` path and creating the safe boolean two-argument function.
- Fixed footer nested-link markup.
- Updated supporting-materials copy to describe secure private review uploads.

## Validation
- `npm run build`: passed.
- `npm run lint`: passed with 8 warnings and 0 errors.
- `git diff --check`: passed.
- `npm test`: passed with Vitest 3.2.7.
- Vercel production deployment `dpl_7ZFQyR6baroU7NC4fetKAKDbMKaP`: READY.
- Vercel direct route checks: `/`, `/submit`, and `/admin` return HTTP 200.
- Live anon REST/API verification after migrations:
  - `is_privileged_user` RPC returns HTTP 200 with `false`.
  - `check_casting_duplicate` RPC returns HTTP 200 with `false` for unique QA input.
  - Storage upload to `ascend-applicant-media/submissions/...` returns HTTP 200.
  - `submissions` insert returns HTTP 201.
  - `submission_media` insert returns HTTP 201.
  - `prequalification_results` insert returns HTTP 201.
  - Anonymous selects from protected applicant/media tables return HTTP 200 with `[]`, not PII and not 42501.
- Local browser verification:
  - `/submit` loads.
  - Category gate completes.
  - Three files attach through visible upload controls.
  - Submit navigates to `/submission-success?id=dc754af7-a6d3-448c-8d3a-a51d38555fdc`.
  - Browser dev logs show no application/Supabase errors; only React Router v7 future-flag warnings remain.
- Vercel browser verification:
  - `/submit` loads on `https://ascend-elite-agency.vercel.app`.
  - Category gate completes.
  - Three files attach through visible upload controls.
  - Submit navigates to `/submission-success?id=1a3c447d-bf9e-46a6-87c7-ac66192286b0`.
  - Browser dev logs show 0 warnings/errors for the successful run.
- Admin SQL verification on project `fqphlzqactfvaiuoahcd`:
  - Browser-submitted row exists: `dc754af7-a6d3-448c-8d3a-a51d38555fdc`.
  - Row values: `status=new`, `source=emerge`, `mode=general`, `category=models`, `is_minor=false`, `guardian_consent=false`.
  - Linked records: `media_rows=3`, `storage_objects=3`, `prequalification_rows=1`.

## Remaining Work
- Commit the Vercel deployment config and documentation changes, then merge into `main`.
- Change DNS for `www.ascendeliteagency.com` to `CNAME www -> 7a7eba8e32c9a538.vercel-dns-017.com.`
- Rerun `npx vercel domains verify www.ascendeliteagency.com` after DNS propagation.
- Repeat the public `/submit` E2E against `https://www.ascendeliteagency.com`.
- Sign in on the Vercel/custom domain admin route and verify submission id `1a3c447d-bf9e-46a6-87c7-ac66192286b0` plus its three media files.
- Consider a later non-emergency cleanup for bundle chunk size and React Router future-flag warnings.

## Exact Next Action
- Complete DNS cutover to Vercel, verify the domain, and repeat `/submit` plus admin media review on `https://www.ascendeliteagency.com`.
