# Ascend Admin Operations Audit

## Current Findings

- `/admin` and `/admin/review` are protected routes and redirect unauthenticated users to sign-in.
- The Vercel deployment route fallback works for `/admin`.
- The browser session is signed in on `https://ascend-elite-agency.vercel.app` and authorized for `/admin/review`.
- Admin search, filters, reset controls, result count, pagination controls, and CSV export control are visible.
- Admin search by application id `e4009e01-09bd-42ec-a28c-948ce9dbb2a4` returns the final QA applicant.
- Media metadata is linked and visible: `UPLOADED MEDIA (3)`, roles, MIME type, and upload date.
- Media previews are blocked at Storage signed URL creation with `The database schema is invalid or incompatible.`
- Supabase CLI is not authenticated locally, so applying the targeted Storage policy repair requires `supabase login`, `SUPABASE_ACCESS_TOKEN`, or a database connection string/password.

## Required Admin Verification

1. Sign in as an authorized admin on the Vercel/custom Ascend domain.
2. Open `/admin/review`.
3. Search for `ASCEND QA FINAL API - DO NOT CONTACT` or submission id `e4009e01-09bd-42ec-a28c-948ce9dbb2a4`.
4. Apply `supabase/migrations/20260722232000_repair_ascend_admin_media_storage_read.sql`.
5. Reload `/admin/review` and verify thumbnails/previews replace the current signed URL error.
6. Confirm unauthorized anonymous access still cannot read applicant rows or media metadata.

## Required Product Improvements

- Keep admin navigation obvious across dashboard, review, opportunities, banners, partners, public site, and sign-out.
- Make search/filter state visible with result count, reset controls, and empty states.
- Ensure applicant media blocks show file role, upload date, file type, and a clear empty state.
