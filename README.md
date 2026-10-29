# Gummy Fever Ecommerce Website

A modern, minimalist ecommerce website for premium gummy clothing, built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Features

- 🛍️ Product catalog with categories and collections
- 🛒 Shopping cart with persistent storage
- 💳 Yoco checkout (ZAR) with signed webhooks
- 📱 Fully responsive design
- 🎨 Modern, clean UI inspired by cultish.com
- 🔐 Secure authentication ready (Supabase Auth)
- 📊 Database schema with products, orders, and categories

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **State Management**: Zustand
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account and project

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your credentials (names only — never commit real keys):
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
YOCO_SECRET_KEY=
YOCO_WEBHOOK_SECRET=
```

3. Set up the database:
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Run the SQL script from `supabase/schema.sql`
   - Run `supabase/migrations/20261029170000_add_yoco_payment_columns.sql` for Yoco payment columns (do not apply it from this app)

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── page.tsx           # Homepage
│   ├── collections/       # Collection pages
│   ├── products/          # Product detail pages
│   ├── checkout/          # Checkout + Yoco return pages
│   ├── api/               # Checkout + Yoco webhook routes
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── Header.tsx        # Navigation header
│   ├── Cart.tsx          # Shopping cart sidebar
│   └── Footer.tsx        # Footer component
├── lib/                   # Utility functions
│   ├── supabase/         # Supabase client setup
│   ├── yoco/             # Yoco Checkout API helpers
│   ├── checkout/         # Server-side totals
│   └── store/            # Zustand stores
├── types/                 # TypeScript type definitions
└── supabase/              # Database schema + migrations
    ├── schema.sql
    └── migrations/
```

## Database Schema

The database includes the following tables:
- `categories` - Product categories
- `products` - Product information
- `product_variants` - Product variants (size, color, etc.)
- `orders` - Customer orders (pending until Yoco webhook marks paid/failed)
- `order_items` - Order line items
- `yoco_webhook_events` - Idempotent Yoco webhook deliveries
- `newsletter_subscribers` - Newsletter email list

## Adding Products

You can add products through the Supabase dashboard or by creating an admin interface. Products should include:
- Name
- Description
- Price
- Images (array of image URLs)
- Category ID
- Stock status

## Payment Integration (Yoco)

Checkout uses [Yoco Checkout API](https://developer.yoco.com) in **ZAR**. Totals are recomputed server-side from Supabase `products` / `product_variants` prices. Client prices are ignored. Card details are collected on Yoco's hosted page, never on this site.

### Owner setup (required before live payments)

1. **Apply the database migration** in the Supabase SQL editor: run `supabase/migrations/20261029170000_add_yoco_payment_columns.sql`. Do not skip this — orders need `yoco_checkout_id` / `yoco_payment_id`, and webhooks need `yoco_webhook_events`.
2. **Supabase keys** (Project → Settings → API):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (server-only; never `NEXT_PUBLIC_`)
3. **Site URL**: set `NEXT_PUBLIC_SITE_URL` to `https://gummyfever.com` in production (or `http://localhost:3000` locally). This is used for Yoco `successUrl` / `cancelUrl` / `failureUrl`.
4. **Yoco test secret key**: in the Yoco App open **Checkout API → How to connect → Test keys** and copy the Test secret key into `YOCO_SECRET_KEY` (`sk_test_...`). Domain verification is not required for test keys.
5. **Register the webhook** with that same secret key (the secret in the response is shown **once**):

```bash
curl -X POST https://payments.yoco.com/api/webhooks \
  -H "Authorization: Bearer $YOCO_SECRET_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name":"gummy-fever-orders","url":"https://gummyfever.com/api/webhooks/yoco"}'
```

Local testing: expose the app with HTTPS (for example ngrok) and use that URL as `url`. Production webhook URL is `https://gummyfever.com/api/webhooks/yoco`.

6. Set `YOCO_WEBHOOK_SECRET` to the returned `secret` (`whsec_...`).
7. Add the same env var **names** on Vercel (Project → Settings → Environment Variables). Do not commit values.
8. **Test**: complete a checkout with [Yoco test card details](https://developer.yoco.com/docs/checkout-api/testing) from the Yoco App. Confirm the order in Supabase moves from `pending` to `paid` after the webhook. Minimum charge is R2.00 (200 cents).
9. **Go live**: verify `gummyfever.com` under Yoco **Verified Domains**, switch `YOCO_SECRET_KEY` to the live secret (`sk_live_...`), and register a live webhook the same way (or reuse the URL) so you get a live `YOCO_WEBHOOK_SECRET`.

Never put `YOCO_SECRET_KEY` or `YOCO_WEBHOOK_SECRET` in client code. Payment success is confirmed only by the signed webhook, not by the success URL.

## Security Notes

- Row Level Security (RLS) is enabled on all tables
- Public read access is granted for products and categories
- User-specific access is enforced for orders (read own orders only)
- Orders are created with the service role after server-side price checks; clients cannot insert orders
- Yoco webhook signatures are verified (HMAC-SHA256, `whsec_` secret); replay window is 3 minutes
- Never commit `.env.local` files to version control

## Deployment

1. Build the project:
```bash
npm run build
```

2. Deploy to Vercel (recommended):
   - Connect your GitHub repository
   - Add environment variables in Vercel dashboard
   - Deploy automatically on push

## License

Private project - All rights reserved
