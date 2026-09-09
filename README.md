# LUNE — لون سبا

Private Arabic spa-management review application, built with Vinext, React, Cloudflare Workers and D1.

## Surfaces
- `/`: owner review dashboard, bookings, client records, services, staff, manual collections, inventory, reports, waitlist, marketing drafts, competitor comparison and settings.
- `/book`: client booking experience and booking history.
- `/staff`: staff-view preview within the owner's review account.

## Implemented
Durable D1 records; account-scoped queries; server-calculated service pricing; room and staff reservations in atomic batches; 15-minute cleanup buffer; concurrent-conflict handling; booking cancellation; arrival/completion; manual payment acknowledgement with duplicate protection; preferences for quiet and fragrance-free sessions; editable catalog/team/inventory; CSV export; reports from persisted data.

## Release boundary
This is a private functional first version, not a commercially launched salon system. Each signed-in account owns its isolated review data. Customer and staff pages preview workflows in that account, not separately authorized commercial roles. Keep the site owner-private. A public rollout needs salon-scoped customer identity, independently enforced employee roles, staff skill and shift scheduling, actual business setup, and operational testing.

Online payments, refunds, WhatsApp/SMS delivery, tax invoicing, loyalty balances, recurring memberships, automated campaigns, multi-branch operations, automatic material consumption, and multi-guest booking are not implemented. Marketing records are drafts only. Prices, staff names, and opening inventory are editable examples; bookings and revenue start empty. The app must not claim tax compliance or exclusive features relative to established vendors.

## Verification
- Production build and TypeScript check.
- `tests/booking-flow.py`: local HTTP integration tests cover unauthenticated access, validation, concurrent double booking, resource conflict across staff, cleaning buffer, persistence, server-authoritative pricing, cancellation/release, payments, state transitions, inventory validation, and all three routes.
- No browser visual/interaction testing was requested or performed.
- Optional imperative WebMCP tool `start_spa_booking` stages the same booking dialog; unsupported browsers skip it. No supported WebMCP validation context was available, so registration/execution is unverified.

## Sources
Reviewed September 9, 2026:
- https://www.fresha.com/for-business/features
- https://www.zenoti.com/spa-management-software
- https://www.vagaro.com/en-gb/pro/spa-software
- https://support.vagaro.com/hc/en-us/articles/360000157854-Create-a-Membership

Spa stock photo, illustrative rather than an actual venue photo:
https://unsplash.com/photos/indoor-swimming-pool-with-lounge-chairs-and-large-window-ekBaPA2eN2Q (standard Unsplash free license).
