# The Français Hub — V2 patch

This patch adds a second landing page at `/v2/` without replacing V1.

## Files to add
- `app/v2/page.tsx`
- `app/v2/v2.module.css`
- `components/v2/V2Landing.tsx`
- `components/SiteFrame.tsx`

## File to replace
- `app/layout.tsx`

No new npm packages are required. V2 uses the existing `motion`, Next.js and React dependencies already present in V1.

After uploading/committing these files to `main`, the existing GitHub Pages Action should rebuild automatically. The deployed V2 URL will be your normal GitHub Pages URL followed by `/v2/`.

The registration form is static-hosting safe: it builds a pre-filled WhatsApp message in the browser and opens WhatsApp; no API route or backend is required.
