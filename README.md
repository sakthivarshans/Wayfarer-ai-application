# Wayfarer AI — Travel Discovery & Itinerary Platform

Wayfarer AI is an AI-native travel platform built with React 18, Vite, TypeScript, Tailwind CSS, Leaflet, and Firebase. It combines TripAdvisor-style browse-first discovery with an AI itinerary planner, on-site AI assistant, and a personal Telegram trip assistant.

---

## 🎨 Brand & Theme (Strict)
- **Palette**: White (#FFFFFF), soft surfaces (#F5F3FF), borders (#EDE9FE). Primary violet #6D28D9 (hover #5B21B6), accent #8B5CF6, deep text #1F1637, muted text #6B6385. Amber (#F59E0B) for star ratings.
- **Typography**: Plus Jakarta Sans for headings, Inter for body prose.
- **Logo**: Toucan mark with violet wordmark.
- **Booking**: 100% redirect-only via affiliate partner links with clear disclosures (`rel="sponsored noopener"`).

---

## 🚀 Key Features

1. **Browse-First Discovery (`/`, `/destination/:slug`)**:
   - Hero destination search ("Where to?"), trending destinations, and category filtering (*Essentials*, *Family friendly*, *Hidden gems*, *Museums*, *Outdoors*, *Arts and theatre*, *Nightlife*).
   - Sticky tab bar: Overview, Things to Do, Hotels, Restaurants, Interactive Map, and Community Q&A.

2. **Cold-Start-Safe Rating System**:
   - **0 reviews**: Displays *"Be the first to review"* with a call-to-action.
   - **Imported external rating**: Displays small source badge (e.g. *"4.4 from OpenStreetMap/Geoapify"*), never mixed into Wayfarer's average.
   - **1 to 4 reviews**: Displays *"New on Wayfarer"* and individual reviews without distribution chart.
   - **5+ reviews**: Displays true average, star distribution bar chart, filters, and helpful votes.

3. **Interactive Leaflet & OSM Map (`<WayfarerMap />`)**:
   - Custom violet pin icons for places, hotels, and restaurants.
   - Synchronized side-list: hover highlights marker, clicking marker centers popup.
   - Dynamic radius circle (1, 3, 5, 10 km) and *"Search this area"* on pan.
   - Geolocation and full-screen view.

4. **AI Trip Planner & Results (`/plan`, `/trips/:id`, `/trips/:id/itinerary`)**:
   - Form with origin, destination, days, budget, and transport mode preferences.
   - Results tabs: Places, Transport (sorted by price with booking links), Hotels, and Dining.
   - Day-by-day timeline view with top summary and public shareable URL (`/trip/share/:shareId`).

5. **On-Site AI Assistant**:
   - Floating violet drawer on every page.
   - Context-aware grounding in approved reviews and trip itineraries.
   - Suggestion chips for quick queries.

6. **Personal Telegram Trip Guide (`/telegram`)**:
   - 3-step @BotFather setup with copyable commands.
   - Live status indicator (Connected as @botname, Not connected).
   - Zero client credential persistence: token sent directly to backend for AES-256-GCM encryption.

7. **Admin Dashboard & Moderation Hub (`/admin`)**:
   - Overview metrics & 7-day affiliate click volume chart.
   - Hotels manager with coordinates, amenities, and per-hotel click counters.
   - CSV bulk import with live validation preview.
   - Reviews moderation queue: Approve, Reject, or Ban abusive users.
   - Coverage Map: flags destinations with &lt; 5 listings as coverage gaps.

---

## 🛠️ Environment Configuration (`.env`)
```bash
# Firebase Client SDK
VITE_FIREBASE_API_KEY=""
VITE_FIREBASE_AUTH_DOMAIN=""
VITE_FIREBASE_PROJECT_ID=""
VITE_FIREBASE_APP_ID=""

# Wayfarer Express Backend (Render / Cloud Run)
VITE_API_BASE_URL=""

# Cloudinary Unsigned Upload
VITE_CLOUDINARY_CLOUD_NAME=""
VITE_CLOUDINARY_UPLOAD_PRESET=""
```
*Note: In the preview environment, the app includes robust in-memory fallbacks and preloaded seed data (Amalfi Coast, Kyoto, Goa) so all features and admin controls work out of the box immediately.*

---

## 🛡️ Firestore Security Rules (`firestore.rules`)
- Public read access for published destinations, places, hotels, restaurants, and approved reviews.
- Authenticated users create reviews with forced initial state `status: 'pending'`, `helpfulCount: 0`, and `reportCount: 0`.
- Only `admin` role can approve/reject reviews, modify listings, and view affiliate click logs.
