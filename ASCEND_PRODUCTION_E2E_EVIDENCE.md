# Ascend Production E2E Evidence

## Deployment

- Vercel project: `ascend-elite-agency`
- Vercel project id: `prj_vqPb1szFGAV9qhk3CboA1W7yqLbW`
- Production deployment id: `dpl_7ZFQyR6baroU7NC4fetKAKDbMKaP`
- Production deployment URL: `https://ascend-elite-agency-q5ye3oces-emerges-projects-c1ae993a.vercel.app`
- Production alias: `https://ascend-elite-agency.vercel.app`

## Build And Route Evidence

- `npm run build`: passed.
- Vercel build: passed.
- `curl -I https://ascend-elite-agency.vercel.app`: HTTP 200, `server: Vercel`.
- `curl -I https://ascend-elite-agency.vercel.app/submit`: HTTP 200.
- `curl -I https://ascend-elite-agency.vercel.app/admin`: HTTP 200.

## Live API Evidence

- Duplicate RPC: HTTP 200, `false`.
- Storage upload: HTTP 200.
- `submissions` insert: HTTP 201.
- `submission_media` insert: HTTP 201.
- `prequalification_results` insert: HTTP 201.
- Anonymous protected `submissions` select: HTTP 200, `[]`.

## Browser E2E Evidence

- Browser test URL: `https://ascend-elite-agency.vercel.app/submit`.
- Submitted QA applicant: `ASCEND QA UI VERCEL - DO NOT CONTACT`.
- Submitted QA email: `ascend-ui-vercel-1784761173539@example.com`.
- Success URL: `https://ascend-elite-agency.vercel.app/submission-success?id=1a3c447d-bf9e-46a6-87c7-ac66192286b0`.
- Browser console warnings/errors captured for successful run: `0`.

## DNS Blocker

`www.ascendeliteagency.com` is attached to Vercel, but DNS is not yet pointed at Vercel.

Current Vercel verification result:

- Current nameservers: `ns57.domaincontrol.com`, `ns58.domaincontrol.com`.
- Current `www` A value: `185.158.133.1`.
- Required record: `CNAME www -> 7a7eba8e32c9a538.vercel-dns-017.com.`

After changing DNS, run:

```bash
npx vercel domains verify www.ascendeliteagency.com
```

