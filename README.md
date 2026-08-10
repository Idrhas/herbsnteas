# Herbs & Teas

Premium herbal teas sourced and cultivated in Benin, Edo State, Nigeria.

## Stack

- **React 18** + **TypeScript**
- **Vite** (build tooling)
- **React Router v6** (client-side routing)
- **CSS Modules** (scoped styles, no CSS-in-JS)
- **Formspree / EmailJS** (form submission — no backend required)

## Project Structure

```
src/
├── components/
│   ├── layout/         # Nav, Footer
│   └── ui/             # ProductCard, ProductDetailModal, FormField, etc.
├── data/
│   └── products.json   # Product catalogue — edit here to update the site
├── pages/
│   ├── TeasPage.tsx
│   ├── EngageUsPage.tsx
│   └── ContactPage.tsx
├── styles/
│   ├── tokens.css      # Design tokens (colours, type scale, spacing)
│   └── global.css      # Reset + global styles
└── types/
    └── index.ts        # Shared TypeScript types
```

## Getting Started

```bash
npm install
cp .env.example .env        # Add your Formspree endpoint
npm run dev
```

## Updating Products

Edit `src/data/products.json`. The site reads this file at build time — no deployment step needed beyond a rebuild.

Each product supports these fields:

| Field | Type | Notes |
|-------|------|-------|
| `id` | string | Unique identifier |
| `name` | string | Product name |
| `category` | `herbal-tea` \| `other-tea` \| `gift-set` \| `accessory` | Controls which section the product appears in |
| `teaType` | string? | e.g. "Green Tea", "Herbal Blend" |
| `description` | string | Full description |
| `origin` | string | e.g. "Benin City, Edo State, Nigeria" |
| `ingredients` | string | Comma-separated ingredient list |
| `brewingInstructions` | string? | Optional brewing guide |
| `price` | number \| null | Set `null` to show "Request Price" |
| `currency` | string | ISO 4217 code, e.g. "NGN" |
| `inStock` | boolean | `false` shows "Out of Stock" badge |
| `featured` | boolean | `true` includes product in Featured section |
| `imageUrl` | string | Path or URL — falls back to a placeholder if missing |
| `variants` | `{size, weight}[]` | Optional size/weight variants |
| `tags` | string[] | Used for search and SEO keywords |

## Form Setup

Copy `.env.example` to `.env` and add your Formspree form URL:

```
VITE_FORMSPREE_ENDPOINT=https://formspree.io/f/YOUR_FORM_ID
```

Get a free form at [formspree.io](https://formspree.io).

## Build

```bash
npm run build       # Outputs to dist/
npm run preview     # Preview the production build locally
```

## Design Notes

- Colour palette: deep botanical greens, warm creams, muted earth browns
- Typography: Cormorant Garamond (serif headlines) + DM Sans (body/UI)
- All product images are optional — the site renders a designed placeholder when an image is missing or fails to load
- `prefers-reduced-motion` is respected — all animations are disabled when the user has set this preference
- WCAG 2.1 AA contrast ratios are maintained throughout
