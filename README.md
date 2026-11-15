# YatraOne — clickable prototype

A mobile-first, clickable product prototype for **YatraOne**, a South India pilgrimage travel marketplace. This build covers the customer experience for the pilot circuit:

> **Bengaluru → Tirupati → Srikalahasti → Kanipakam**

The prototype follows the YatraOne v2.0 direction: a hybrid marketplace + managed yatra, INR pricing, transparent partner statuses, and senior/mobility care carried through the entire journey.

---

## Run it locally

```bash
npm install
npm run dev
```

Open **http://localhost:3000**.

Production build:

```bash
npm run build
npm run start
```

Quality checks:

```bash
npx tsc --noEmit
npm run lint
```

Requires Node.js 20.9+ and npm.

---

## The demo scenario

The app opens with a realistic draft already in place, so the full flow can be explored without filling every field:

- **6 travellers** — 4 adults, 2 seniors
- **10–13 January 2027** — 4 days, 3 nights
- **Relaxed pace**
- **Care requests:** wheelchair assistance, step-free stays, frequent rest stops, vegetarian meals
- **Estimate:** approximately **₹95,759**, with a **₹23,940** advance (25%)
- **Pilot route:** Tirupati, Srikalahasti, Kanipakam

Everything is editable in the trip builder.

---

## What is included

### Customer journey

1. **Home** — editorial discovery, pilot route, trip starter, traveller personas
2. **Explore** — circuits across South India with filters
3. **Destination** — temple detail, access notes, route context
4. **Plan** — route, dates, travellers, pace, care needs, live estimate
5. **Itinerary** — AI-assisted day-by-day plan, rest windows, warnings, printable view
6. **Stay** — access-matched hotels, explicit gaps, blocked continuation when a stay fails care needs
7. **Transport** — accessible vehicle selection, inaccessible options visibly unavailable under a wheelchair request
8. **Extras** — guide, meals, wheelchair attendant; the wheelchair add-on is locked on when required
9. **Checkout** — traveller details, pickup, emergency contact, demo payment methods, consent
10. **Confirmation** — honest vendor-by-vendor status, advance receipt, what happens next
11. **My Yatra** — draft, upcoming and past journeys, partner progress
12. **Trip detail** — overview, day-by-day plan, payments, documents, coordinator
13. **Profile** — personal details, emergency contact, care defaults, language, notifications, demo payment methods, reset data

### Trust and care rules baked in

- A paid advance **never** implies every vendor is confirmed.
- Vendor states are deliberately mixed: stay requested, vehicle confirmed, wheelchair requested, guide confirmed, darshan subject to the temple.
- Selecting a stay that misses an access request opens a clear blocking dialog — the app does not silently remove the request or swap the service.
- Vehicles without a ramp/wheelchair space are disabled while wheelchair assistance is requested, and the reason is shown.
- The wheelchair add-on cannot be removed while the request is active.
- Darshan timings are labelled as subject to the temple, not guaranteed.
- Prices are shown as estimates until checkout; no hidden fees or dark patterns.
- The persistent care bar keeps the current requests visible on every screen.

### Prototype transparency

This is a **front-end prototype**, not a live marketplace:

- No backend, database, authentication, or live vendor integrations.
- Payments are **simulated**. No card, UPI, or bank credentials are collected, and no money moves.
- Ratings, availability, vendor confirmations, prices, and coordinator details are illustrative.
- Drafts, bookings, profile edits, and language choice are stored in **`localStorage`** under `yatraone.prototype.v1`.
- Data is local to the browser. Use **Profile → Clear demo data** to reset.

---

## Routes

Hash-based routing keeps the prototype deployable as a static front end.

| Screen | Route |
| --- | --- |
| Home | `#/` |
| Explore | `#/explore` |
| Destination | `#/destination/:id` |
| Plan | `#/plan` |
| Itinerary | `#/itinerary` |
| Stay | `#/stay` |
| Transport | `#/transport` |
| Extras | `#/extras` |
| Checkout | `#/checkout` |
| Confirmation | `#/confirmation/:reference` |
| My Yatra | `#/trips` |
| Trip detail | `#/trip/:reference` |
| Profile | `#/profile` |

Unknown or stale booking links fall back to **My Yatra** rather than showing an empty confirmation.

---

## Project structure

```
src/
  app/
    globals.css          design tokens, component classes, print styles
    layout.tsx           fonts, metadata
    page.tsx             client-only entry point
  components/
    yatra-app.tsx        state, hash routing, persistence, booking creation
    app-shell.tsx        header, language menu, footer, mobile nav
    ui.tsx               buttons, stepper, sheets, price lines, tags
    itinerary-view.tsx   care metadata, day tabs, timeline
    route-map.tsx        custom illustrative SVG route map
    screens/             all 13 customer screens
  lib/
    types.ts             domain types
    data.ts              destinations, circuits, hotels, vehicles, add-ons
    pricing.ts           rooms, GST, advance, balance (integer paise)
    itinerary.ts         route estimation and day generation
    format.ts            INR, dates, labels
public/images/           local photography
```

### Design system

- Deep forest green, warm saffron, ivory, sage and sand
- **Fraunces** for display type, **Inter** for interface text
- 8px spacing rhythm, 20–30px radii, restrained shadows
- Mobile-first with a persistent bottom nav outside the booking flow
- Printable itinerary, receipt, and trip detail styles
- Reduced-motion support and visible focus states

---

## Known limitations

- Balance payment, cancellations, vendor messaging, live support, and document downloads are UI-only.
- The AI itinerary assistant uses deterministic local rules and canned responses, not an LLM.
- Language selection is a preview; sample content stays in English.
- Route maps are illustrative, not geographic navigation.
- The prototype is client-rendered after mount to keep `localStorage` hydration clean.

---

## Photography

Photography is sourced from **Wikimedia Commons** and **Unsplash** for this prototype and is stored locally under `public/images/`. Images are illustrative of the destinations and properties, not the specific hotels or vehicles in the mock inventory.

Before a public production launch, replace these with licensed, attributed assets and record the source URL and licence for each file.

---

## Status

Pilot customer experience complete. Next up: vendor and operations views, real availability and payment integrations, and a production data model.
