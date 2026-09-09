# LUNE — لون سبا

Private Arabic spa-management review application, built with Vinext, React, Cloudflare Workers and D1.

## Surfaces
- `/` and `/book`: public customer booking, with no account required and no administration link.
- `/admin`: management dashboard, restricted server-side to the configured owner email.
- `/staff`: owner-protected staff workspace preview.
- `/api/public`: public catalog and guest booking creation only.
- `/api/public/receipt`: minimal single-booking read-back using a high-entropy receipt token.
- `/api/spa`: owner-only management API.

All surfaces use one configured salon tenant in D1. A customer booking appears in the management dashboard; the dashboard polls every 15 seconds and the private customer receipt polls every 20 seconds. Existing records in the configured owner tenant are preserved.

## Implemented
Durable D1 records; server-enforced owner authorization; anonymous guest booking; server-calculated pricing; atomic room/staff reservations and 15-minute cleanup buffers; concurrency checks; cancellations and manual collection; preferences; editable catalog/team/inventory; CSV and reports. Guest receipt secrets are hashed in the database, and public catalog responses exclude private records. Guest creation and receipt lookups are rate-limited.

## Hosting and GitHub
The code repository is private. The live site is publicly hosted on Sites; no sign-in is required for customer pages or booking. Admin pages require the owner's ChatGPT identity. GitHub rejected enabling Pages for the private repository because the current account plan does not support it (HTTP 422). A manually triggered Pages workflow and static customer build are provided for optional future use if private-repository Pages becomes available. No GitHub Pages deployment is claimed.

Runtime configuration (set through the hosting provider, never committed):
- `SPA_ADMIN_EMAIL`: owner's verified sign-in email.
- `SPA_TENANT_ID`: shared salon tenant, preserving the owner's existing data.
- `PUBLIC_CUSTOMER_ORIGIN`: optional allowed static frontend origin.

## Release boundary
The public site is a working demonstration, not a fully launched commercial salon system. Example services/prices/team are editable. Payment processing, refunds, SMS/WhatsApp, tax invoicing, independent employee roles, loyalty balances, recurring memberships and shift qualification rules are not implemented. Staff currently use the owner-authorized preview. Bookings are now shared across visitors rather than isolated per visitor.

## Verification
`tests/public-flow.py` covers anonymous catalog and booking, owner-only management, field filtering, collisions, server pricing, shared dashboard read-back, receipt-token isolation and status synchronization. It also checks server-rendered customer pages have no administration link. `tests/booking-flow.py` covers the management booking lifecycle. Production and static customer builds and TypeScript checking are run locally.

No browser visual/interaction testing was requested. WebMCP `start_spa_booking` is feature-detected but no supported validation context was available.

## Sources
Reviewed September 9, 2026:
- https://www.fresha.com/for-business/features
- https://www.zenoti.com/spa-management-software
- https://www.vagaro.com/en-gb/pro/spa-software
- https://support.vagaro.com/hc/en-us/articles/360000157854-Create-a-Membership

Spa stock photo, illustrative rather than an actual venue photo:
https://unsplash.com/photos/indoor-swimming-pool-with-lounge-chairs-and-large-window-ekBaPA2eN2Q (standard Unsplash free license).
