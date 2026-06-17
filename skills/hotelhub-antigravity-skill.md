---
name: hotelhub-frontend
description: Generate HotelHub frontend code (pages, components, dashboards) following strict structural patterns, design system, and business logic. Ensure consistency across landing page, hotel booking flow, director dashboard, and CEO dashboard. Maintain file organization, no deviation in color palette, typography, or component patterns.
license: Internal HotelHub Development
---

# HotelHub Frontend Development Skill

## Project Overview

**HotelHub** is a multilingual (FR/EN), full-stack hotel booking platform with three user roles:
- **Client** (guest): Browse hotels, book rooms, view reviews
- **Directeur** (hotel manager): Manage rooms, handle reservations for one hotel
- **PDG/Super Admin** (chain owner): Oversee all hotels and directors, manage billing

Stack: Next.js App Router, TypeScript, Tailwind CSS v4, Zustand, next-intl, Recharts, Lucide React

---

## CODE GENERATION RULES (Critical — Do Not Deviate)

### 1. File Structure & Organization

**For multi-component pages:**
- Single file per page-level component (e.g., `DirectorDashboard.tsx`, `AboutComponents.tsx`)
- One reusable component per file (e.g., `RoomCard.tsx`, `HotelCard.tsx`)
- No deep nesting; keep top-level structure flat

**Directory layout:**
```
src/
├── components/          # Reusable components (RoomCard, HotelCard, Header, Footer)
├── app/[locale]/        # Route pages (page.tsx files)
│   ├── page.tsx         # Landing page wrapper
│   ├── hotels/
│   │   ├── page.tsx     # Hotels listing
│   │   └── [hotelId]/
│   │       ├── page.tsx # Hotel detail
│   │       └── rooms/[roomId]/page.tsx
│   ├── about/
│   │   └── page.tsx
│   ├── services/
│   │   └── page.tsx
│   ├── contact/
│   │   └── page.tsx
│   ├── dashboard/
│   │   ├── page.tsx     # Client dashboard
│   │   ├── directeur/
│   │   │   └── page.tsx
│   │   └── pdg/
│   │       └── page.tsx
├── mocks/               # Mock data (hotelsData.ts, dashboardMocks.ts)
├── store/               # Zustand stores (authStore.ts, hotelsFilterStore.ts)
├── types/               # TypeScript interfaces (hotel.ts, reservation.ts)
├── messages/            # i18n translations (en.json, fr.json)
├── hooks/               # Custom hooks (useScrollReveal.ts)
└── globals.css          # Design tokens, shared utilities
```

---

### 2. Component Generation Pattern

**Always generate in this order:**

1. **Types** (`types/`) — Define all interfaces
2. **Mock data** (`mocks/`) — Seed data with nested relationships
3. **Stores** (`store/`) — Zustand state (if needed)
4. **Translations** (`messages/`) — en.json + fr.json keys
5. **Reusable components** (`components/`) — Card, Form, Badge, etc.
6. **Page-level components** (`components/PageName.tsx`) — Full page logic
7. **Route wrappers** (`app/[locale]/path/page.tsx`) — Thin imports

**Never:**
- Create a route page before the logic component exists
- Put business logic in route files
- Split a page into 5+ component files
- Use inline styles or CSS modules outside globals.css

---

### 3. Naming Conventions

| What | Pattern | Example |
|------|---------|---------|
| Type files | `types/{entity}.ts` | `types/hotel.ts`, `types/reservation.ts` |
| Mock data | `mocks/{entity}Data.ts` | `mocks/hotelsData.ts` |
| Stores | `store/{feature}Store.ts` | `store/authStore.ts`, `store/hotelsFilterStore.ts` |
| Components | `{PascalCase}.tsx` | `RoomCard.tsx`, `HotelCard.tsx` |
| Page components | `{Feature}Page.tsx` | `HotelsListPage.tsx`, `DirectorDashboard.tsx` |
| Hooks | `use{Feature}.ts` | `useScrollReveal.ts` |
| Utils | `{feature}Utils.ts` | `distanceUtils.ts` |

**Always use `"use client"` at the top of:**
- Any component using hooks (useState, useEffect, useRef, etc.)
- Any component using browser APIs (localStorage, geolocation, etc.)
- Any component from `next-intl` (useTranslations, useLocale)
- Form components with onChange handlers

---

### 4. Translation Keys Structure

When generating a new page, add translations under a top-level key:

```json
{
  "about": {
    "hero": { "badge": "...", "title": "...", "titleAccent": "..." },
    "mission": { "badge": "...", "title": "...", "body1": "...", "body2": "..." },
    "story": { ... },
    "values": { "items": [ { "title": "...", "desc": "..." } ] },
    "cta": { ... }
  }
}
```

**Rules:**
- One top-level key per page (e.g., `about`, `services`, `hotels`, `hotelsPage`)
- Nested by logical section
- Keep keys flat; don't over-nest
- Always provide both en.json AND fr.json equivalents

---

### 5. Hotel-Room Correspondence

**Data relationship pattern:**

```ts
// Hotel contains nested rooms array
interface Hotel {
  id: string;
  name: string;
  rooms: Room[];  // ← nested
}

// Room also has hotelId foreign key for queries
interface Room {
  id: string;
  hotelId: string;  // ← reference back
  type: string;
  statut: "DISPONIBLE" | "INDISPONIBLE";
}
```

**Helper functions in mock data:**

```ts
export function getHotelById(id: string): Hotel | undefined { ... }
export function getRoomById(hotelId: string, roomId: string): Room | undefined { ... }
export function getAvailableRooms(hotel: Hotel): Room[] { ... }
export function getLowestPrice(hotel: Hotel, availableOnly: boolean): number | null { ... }
```

**Usage in components:**
- List rooms for a hotel → `hotel.rooms`
- Get single room details → `getRoomById(hotelId, roomId)`
- Filter by availability → `getAvailableRooms(hotel)`

---

## DESIGN SYSTEM (Non-Negotiable)

### Colors (Dark Theme — Primary)

```
--charcoal: #1c1714          (card background)
--warm-gray: #2a2522         (secondary surface)
--purple (--blue): rgb(83, 31, 143)  (primary accent)
--gold: rgb(212, 175, 55)    (highlight, luxury)
--cyan: rgb(7, 186, 202)     (rare, accent accent)
```

**Light Theme (Landing Page Only):**
```
Background: #ffffff or cream (#fdfbf7)
Text: #000000 or charcoal
Accents: Same purple/gold
```

### Typography

```
Headings (Playfair Display):    style={{ fontFamily: "var(--font-playfair)" }}
Body (DM Sans):                 Default via globals.css
Never use Inter, Arial, Roboto
```

### Component Patterns

**Card (informational):**
```tsx
<div className="bg-charcoal rounded-2xl p-6 shadow-lg
  hover:-translate-y-1.5 hover:scale-[1.03]
  hover:shadow-xl hover:shadow-gold/20
  transition-all duration-300">
```

**Card (interactive — forms, no lift):**
```tsx
<div className="bg-charcoal rounded-2xl p-6 border border-white/10
  focus-within:border-gold/30
  transition-colors duration-200">
```

**Status badge (pill):**
```tsx
<span className="px-3 py-1 rounded-full text-xs font-semibold
  bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
  DISPONIBLE
</span>
```

**Button (primary):**
```tsx
<button className="bg-purple dark:bg-gold text-white dark:text-[#1c1714]
  px-6 py-3 rounded-xl font-bold
  hover:opacity-90 transition-colors">
```

### Borders & Spacing

- Card border: `border border-white/10` (dark) or `border border-purple/20` (light)
- Divider: `border-t border-gold/10`
- Padding: `p-4`, `p-6`, `p-8` (multiples of 4)
- Gap: `gap-3`, `gap-6`, `gap-8`
- Rounded: `rounded-xl`, `rounded-2xl`, `rounded-3xl`

---

## BUSINESS LOGIC PATTERNS

### Data Filtering (Zustand + useMemo)

```tsx
// Store state
const { filter, setFilter } = useFilterStore();

// Component logic
const filtered = useMemo(() => {
  return data.filter(item => 
    item.name.includes(filter) &&
    item.price <= maxPrice
  );
}, [filter, maxPrice]);
```

### Availability Toggle

```tsx
const [showAvailableOnly, setShowAvailableOnly] = useState(false);

const rooms = showAvailableOnly 
  ? getAvailableRooms(hotel) 
  : hotel.rooms;
```

### Geolocation + Distance

```tsx
const [userLocation, setUserLocation] = useState(null);

const handleGeolocate = () => {
  navigator.geolocation.getCurrentPosition(pos => {
    setUserLocation({
      lat: pos.coords.latitude,
      lng: pos.coords.longitude
    });
  });
};

// Distance calculation (Haversine)
const distance = distanceKm(userLocation, hotelLocation);
```

### Form Handling (No `<form>` tags)

```tsx
const [formData, setFormData] = useState({ ... });
const [errors, setErrors] = useState({});

const handleSubmit = () => {
  if (!validate()) return;
  // Submit logic
};

return (
  <div>
    <input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
    <button onClick={handleSubmit}>Submit</button>
  </div>
);
```

---

## TRANSLATION USAGE

Every page component imports translations:

```tsx
import { useTranslations } from "next-intl";

export default function PageComponent() {
  const t = useTranslations("pageKey");
  
  return <h1>{t("hero.title")}</h1>;
}
```

**For language toggle:**
```tsx
const locale = useLocale();
<Link href={`/${locale === "fr" ? "en" : "fr"}/path`}>
  Toggle Language
</Link>
```

---

## LANDING PAGE COMPONENTS (Established Pattern)

When generating landing page sections, follow this structure:

1. **Hero** — Full-screen image + headline + CTA
2. **Section with badge** — Badge label, heading (with accent word), subtitle
3. **Image + text blocks** (alternating) — For story/values sections
4. **Card grid** (staggered optional) — For features/values
5. **Testimonials carousel** — Sliding review cards
6. **CTA banner** — Full-width purple/gold with watermark text

All sections:
- Bilingual (en/fr via next-intl)
- Light + dark theme support
- Wrapped in `RevealSection` for scroll animations
- Use Unsplash image URLs (with query params: `?w=1800&q=85&auto=format&fit=crop`)

---

## DASHBOARD COMPONENTS (Established Pattern)

When generating director/PDG dashboards:

1. **Floating header pill** (fixed, top-4) — Nav + auth controls
2. **Sidebar** (left, 72px → 240px on hover) — Navigation icons + labels
3. **Top bar** (sticky, below sidebar) — Page title + date + notifications
4. **Main content grid** — 2-column (sidebar + content)
5. **KPI cards** (4-card grid) — Stats with up/down trend
6. **Charts** (Recharts with dark theme) — Bar, line, pie
7. **Tables** — Booking/reservation lists with filter tabs
8. **Modals** — Room management, approval workflows
9. **Drawers** — Settings, filters (slide from right/left)

All use `bg-charcoal`, gold accents, emerald for positive status.

---

## CODE QUALITY CHECKLIST

Before submitting, verify:

- [ ] `"use client"` at top of every component using hooks/browser APIs
- [ ] Types defined in `types/` before components
- [ ] Mock data in `mocks/` with helper functions
- [ ] All text translated (en.json + fr.json both complete)
- [ ] No inline styles (only Tailwind + globals.css)
- [ ] No `<form>` tags (use `<div>` + onClick)
- [ ] Status badges use correct color (emerald/gold/red)
- [ ] Cards use `bg-charcoal`, text uses `text-white` variants
- [ ] Headings use Playfair (`style={{ fontFamily: "var(--font-playfair)" }}`)
- [ ] Button labels use purple/gold, text is white
- [ ] Imports are clean (no unused)
- [ ] responsive (mobile-first: 1 col → 2 col → 3+ col)
- [ ] Dark mode works (classes use `dark:` prefix where needed)
- [ ] FCFA currency formatting: `.toLocaleString("fr-FR")} FCFA`
- [ ] No Lorem Ipsum — use realistic Cameroonian context

---

## ANTI-PATTERNS (Never Do This)

❌ Create a page without first defining its types and mock data  
❌ Put business logic in route files (app/[locale]/path/page.tsx)  
❌ Split one page into 10 component files  
❌ Use `<form>` tags — use `<div>` + onClick handlers  
❌ Use inline `style={{}}` — only Tailwind classes  
❌ Use default gray Tailwind colors — warm them up  
❌ Use Inter, Arial, Roboto fonts  
❌ Bright white cards on bright background — use charcoal/warm-gray  
❌ Inconsistent color naming (don't invent new colors)  
❌ Missing translations in both languages  
❌ No `"use client"` on components with hooks  

---

## WORKING WITH THIS SKILL

When requesting a new page/component from Antigravity:

**Good requests:**
- "Generate a hotel detail page showing rooms with availability toggle and geolocation distance"
- "Build a director dashboard KPI section with 4 stat cards and a chart"
- "Create a contact page with email/phone contacts and social links"
- "Add an About page with hero, mission, story sections, and CTA"

**Include in request:**
1. What page/feature (landing, dashboard, booking flow)
2. What sections/components
3. Any specific functionality (filters, toggles, modals)
4. Reference design if available

**Expect in response:**
1. Types (if new data structures)
2. Mock data (if needed)
3. Translations (both languages)
4. Components (reusable + page-level)
5. Route files (thin wrappers)
6. Deployment checklist (where files go)

---

## Final Principle

**The goal:** Generate production-ready HotelHub pages that are:
- Visually cohesive with the existing design system
- Structured consistently (types → mocks → components → pages)
- Fully translated (FR/EN)
- Free of deviation (colors, fonts, patterns stay the same)
- Ready to integrate without refactoring

Consistency > Creativity. Follow the patterns exactly.
