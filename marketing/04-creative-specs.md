# Static creative production

Six independent HTML files in creatives/, one per family. Each includes its own CSS and uses system fonts. There is no React, network request, remote font or external image. Default is 1080×1350; add ?ratio=916 for 1080×1920. Copy is headline → one supporting idea → CTA → IWantToMove.ca. The text is editable in HTML; scripts/create-creatives.py can regenerate all files from the source concepts and copy.

From the repository root:

```sh
PLAYWRIGHT_BROWSERS_PATH=./.data/browsers npx playwright install chromium
PLAYWRIGHT_BROWSERS_PATH=./.data/browsers npm run creatives
```

The renderer creates 12 PNGs in marketing/creatives/out/, checks the canvas bounds and PNG headers, checks text bounds, and rejects external requests. Device scale factor is 1. All 12 generated PNGs are committed alongside the reproducible HTML and renderer. Re-render them after changing the creative sources.

The 4:5 canvas uses an 86px horizontal inset. The 9:16 version reserves 270px above and 280px below the main content to keep copy away from common Stories/Reels overlays. Inspect the actual placement preview before publishing; UI overlays vary. These are static artboards, not video files. Use the 4:5 version for feed and 9:16 for vertical placements that accept static images. Create other ratios only after checking the placement requirements in the live account.

Palette: forest green, cream, muted lime, warm clay. Type: Arial/Helvetica with tight headline spacing. Illustrations are CSS geometry with directional light and restrained depth. No stars, ratings, awards, insurance badges or invented business facts appear.

Files: relationship.html, friend-with-a-truck.html, moving-stress.html, couch.html, professional.html, stairs.html. The professional control uses the dark background; the others use lighter fields. Pair each with its matching copy family in 03-ad-copy.md.

Owner approves the concept, final text and placements before any ad is published. Replace the website’s separate hero-photo placeholder only with an owned or licensed image.
