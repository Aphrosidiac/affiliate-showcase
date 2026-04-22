# AffiShowcase

Affiliate Marketing Showcase SaaS Platform — create a personalized page to showcase your affiliate products with stunning themes.

## Features

- **Personal Showcase Pages** — each user gets `/:username` with their products displayed as a branded storefront
- **5 Themes** — Luxury, Sporty, Futuristic, Minimal, Vibrant — each with unique colors, fonts, and card styles
- **Product Detail Pages** — swipeable image carousel, descriptions, pricing with discount badges, and a prominent CTA button linking to the affiliate platform (Shopee, TikTok Shop, Lazada, Amazon, etc.)
- **Admin Dashboard** — sidebar navigation with product CRUD, theme picker, store settings, and account info
- **Mobile-First Design** — built for phones, scales up to desktop

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, Vite, TypeScript, Tailwind CSS, React Router, Lucide Icons |
| Backend | Hono (Node.js), TypeScript, Zod validation |
| Database | Prisma ORM + SQLite (swap to PostgreSQL for production) |
| Auth | JWT (bcryptjs + jsonwebtoken) |

## Getting Started

```bash
# Install all dependencies
npm run setup

# Start both servers (API on :3001, client on :5173)
npm run dev
```

### Individual Commands

```bash
# Root
npm install

# Server
cd server && npm install
npx prisma generate
npx prisma db push

# Client
cd client && npm install
```

## Project Structure

```
affiliate-showcase/
├── client/                     # React + Vite frontend
│   └── src/
│       ├── components/
│       │   ├── ui/             # Button, Input
│       │   ├── dashboard/      # Sidebar, DashboardLayout, ProductForm
│       │   └── showcase/       # ProductCard, ImageCarousel, ThemedLayout
│       ├── pages/              # All route pages
│       ├── hooks/              # useAuth
│       ├── themes/             # 5 theme configs (CSS variables)
│       └── lib/                # API client
│
├── server/                     # Hono API backend
│   ├── src/
│   │   ├── routes/             # auth, products, store, users (public)
│   │   ├── middleware/         # JWT auth
│   │   └── lib/                # Prisma client
│   └── prisma/
│       └── schema.prisma       # User, Store, Product models
│
└── package.json                # Root scripts (concurrently)
```

## API Endpoints

### Auth
- `POST /api/auth/register` — create account
- `POST /api/auth/login` — login, returns JWT
- `GET /api/auth/me` — current user (auth required)

### Products (auth required)
- `GET /api/products` — list user's products
- `POST /api/products` — create product
- `PUT /api/products/:id` — update product
- `DELETE /api/products/:id` — delete product

### Store (auth required)
- `GET /api/store` — get store settings
- `PUT /api/store` — update theme, name, description

### Public
- `GET /api/u/:username` — user profile + store info
- `GET /api/u/:username/products` — active products
- `GET /api/u/:username/product/:id` — single product detail

## Themes

| Theme | Style |
|---|---|
| Luxury | Dark bg, gold accents, Playfair Display serif, sharp corners |
| Sporty | Dark bg, red accents, Oswald bold font, energetic feel |
| Futuristic | Navy bg, neon cyan, Space Grotesk, glassmorphism |
| Minimal | White, black text, Inter, clean borders, whitespace |
| Vibrant | Warm cream bg, orange accents, Poppins, rounded corners |

## Production Notes

- Swap SQLite to PostgreSQL — update `datasource` in `prisma/schema.prisma` and set `DATABASE_URL`
- Set `JWT_SECRET` environment variable
- Update CORS origin in `server/src/index.ts` to your production domain
- Update `API_URL` in `client/src/lib/api.ts` to your production API URL
