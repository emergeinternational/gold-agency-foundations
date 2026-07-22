# Ascend Phase 1 QA Report

## Scope

This report covers the production submission path, deployment path, and high-priority privacy checks for Ascend Elite Agency.

## Results

| Check | Result | Evidence |
| --- | --- | --- |
| Correct repository | Passed | Local repo: `/Users/s.w.roseburgh/Documents/Playground/gold-agency-foundations`; remote: `https://github.com/emergeinternational/gold-agency-foundations.git`. |
| Local production build | Passed | `npm run build` completed successfully. |
| Lint | Passed with warnings | `npm run lint` returned 0 errors and 8 existing Fast Refresh warnings. |
| Tests | Passed | `npm test` ran Vitest 3.2.7 and passed `src/test/example.test.ts`. |
| Vercel deployment | Passed | Production deployment `dpl_7ZFQyR6baroU7NC4fetKAKDbMKaP` reached READY. |
| Direct route refresh | Passed | Vercel returned HTTP 200 for `/`, `/submit`, and `/admin`. |
| Browser bucket creation | Passed | Source search found no `createBucket`, `ensureStorageBucket`, or `storage.buckets` call in browser code. |
| Duplicate RPC | Passed | `POST /rest/v1/rpc/check_casting_duplicate` with `_handle` and `_phone` returned HTTP 200 and `false`. |
| Anonymous storage upload | Passed | Upload to `ascend-applicant-media/submissions/...` returned HTTP 200. |
| Anonymous database insert | Passed | `submissions`, `submission_media`, and `prequalification_results` inserts returned HTTP 201. |
| Anonymous privacy select | Passed | Anonymous `submissions?select=id` returned HTTP 200 with `[]`. |
| Browser E2E submission | Passed on Vercel URL | Deployed UI reached `/submission-success?id=1a3c447d-bf9e-46a6-87c7-ac66192286b0`. |
| Browser console | Passed | Captured 0 warnings/errors for the successful UI submission. |
| Custom domain | Blocked | `www.ascendeliteagency.com` is attached in Vercel but DNS still points to `185.158.133.1`. |
| Admin row/media verification | Blocked | Vercel admin route redirects to sign-in; Supabase CLI has no access token. |

## QA Records

- API QA submission id: `e97957fa-f9fc-4b20-b126-89b16e0f3a9d`
- API QA email: `ascend-vercel-api-1784761002397@example.com`
- API QA object path: `submissions/e97957fa-f9fc-4b20-b126-89b16e0f3a9d/headshot-a0f10533-35aa-4d03-8776-85ef682dd688.png`
- Browser QA submission id: `1a3c447d-bf9e-46a6-87c7-ac66192286b0`
- Browser QA email: `ascend-ui-vercel-1784761173539@example.com`

## Remaining Verification

After DNS cutover, repeat the public submission test on `https://www.ascendeliteagency.com/submit` and verify the QA record/media in the authenticated admin UI.

