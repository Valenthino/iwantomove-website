# Search architecture

The canonical site is https://iwantomove.ca. Confirm domain ownership, TLS and the preferred hostname before launch. The implementation uses this hostname consistently; redirect www and HTTP at the reverse proxy after approval.

| Page | Purpose | Links |
|---|---|---|
| / | Brand and local moving overview | Services, both service pages, quote, privacy |
| /services | Only the two confirmed services | Residential, office, quote |
| /services/residential | Local home moves | Services, office, quote |
| /services/office | Local workplace moves | Services, residential, quote |
| /quote | Paid and organic lead capture | Call, privacy |
| /privacy | Information practices | Analytics opt-out |
| /thank-you | Confirmation for redirect flows | Call; noindex |

Homepage schema: MovingCompany and FAQPage for the visible questions. Service pages: Service and BreadcrumbList. No opening hours, ratings, address or insurance claim is invented. The insurance answer remains [[PLACEHOLDER: insurance status]]. areaServed remains [[PLACEHOLDER: service area]]. Replace these before indexing. There are no location pages in v1.

## Location pages after service areas are confirmed

Owner supplies [[PLACEHOLDER: confirmed cities]]. Create /locations as a useful service-area overview, then /locations/{confirmed-city-slug} only for cities actually served. No city names are assumed. Don’t create a residential × office × neighbourhood grid.

Each location page needs a unique title under 60 characters, description under 155, canonical, an H1 naming the confirmed city, useful owner-verified moving details, the actual availability of both services, and a quote CTA. Include building-access considerations only when relevant and verified. Use genuine local photos with permission. Add a short real FAQ if the owner has answers, then mirror those exact answers in FAQ schema. No address or branch schema without a real staffed location. A page with only a swapped city name stays unpublished.

Link map: homepage → service-area overview → confirmed location pages → relevant services → quote. Services link back to the overview. Location breadcrumbs: Home / Locations / confirmed city. Add approved published URLs to sitemap.ts. Keep unknown locations out of sitemap and navigation.

## Google Business Profile tasks

Owner confirms eligibility and access, exact business identity, [[PLACEHOLDER: business address or service-area profile choice]], hours and approved service areas. Use the correct moving category available in the profile interface. Publish only Residential Moving and Office Moving as offered services. Use 778-513-7503 and the canonical domain; quote link goes to /quote with clean campaign tags.

Verify the profile through Google’s offered method. Add owned photos, check mobile tap-to-call, and keep business details consistent wherever listed. Ask actual customers for honest reviews after completed moves. Don’t incentivise, filter or write reviews for customers. There are no reviews to publish now.

After launch: verify Search Console, submit sitemap.xml, inspect canonical URLs and indexing, and monitor actual search queries before adding pages. These account and deployment tasks remain pending.
