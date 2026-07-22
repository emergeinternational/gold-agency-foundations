# Ascend Elite Agency Production Handoff

## Repository
- Path: `/Users/s.w.roseburgh/Documents/Playground/gold-agency-foundations`
- Remote: `https://github.com/emergeinternational/gold-agency-foundations.git`
- Requested production branch: `main`
- Current local branch at audit start: `codex/setup-vite-pages-deploy`
- Branch state after fetch: current branch is 2 commits behind and 1 commit ahead of `origin/main`.
- Deployment platform: GitHub Pages via `.github/workflows/deploy-pages.yml`.
- Production deploy trigger: push to `main`; workflow runs `npm ci`, `npm run build:pages`, copies `dist/index.html` to `dist/404.html`, and deploys Pages.
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
- `npm test` / Vitest hangs before executing the trivial test in both configured jsdom and direct node-environment runs.

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
- `npm run build:pages`: passed.
- `npm run lint`: passed with 8 warnings and 0 errors.
- `git diff --check`: passed.
- `npm test`: blocked by Vitest runner hang before test execution; runner prints only `RUN v3.2.4` and never reports test execution.
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
- Admin SQL verification on project `fqphlzqactfvaiuoahcd`:
  - Browser-submitted row exists: `dc754af7-a6d3-448c-8d3a-a51d38555fdc`.
  - Row values: `status=new`, `source=emerge`, `mode=general`, `category=models`, `is_minor=false`, `guardian_consent=false`.
  - Linked records: `media_rows=3`, `storage_objects=3`, `prequalification_rows=1`.

## Remaining Work
- Commit the verified local changes and merge them into `main` for GitHub Pages deployment.
- Merge this branch with `origin/main` without losing existing launch fixes.
- Run the GitHub Pages workflow after merge to production `main`.
- Investigate Vitest startup hang separately; it is not caused by the submission-flow changes but blocks automated test reporting.
- Consider a later non-emergency cleanup for bundle chunk size and React Router future-flag warnings.

## Exact Next Action
- Commit and deploy the verified changes to `main`; then run the same `/submit` browser test against `https://www.ascendeliteagency.com` after Pages finishes deploying.
