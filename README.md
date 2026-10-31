# Gummy Fever Ecommerce Website

A modern, minimalist ecommerce website for premium gummy clothing, built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Features

- 🛍️ Product catalog with categories and collections
- 🛒 Shopping cart with persistent storage
- 💳 Paystack checkout (ZAR) with signed webhooks
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
PAYSTACK_SECRET_KEY=
```

3. Set up the database:
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Run the SQL script from `supabase/schema.sql`
   - Run `supabase/migrations/20261031120000_add_payment_columns.sql` for payment columns (do not apply it from this app)

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
│   ├── checkout/          # Checkout + Paystack return pages
│   ├── api/               # Checkout + Paystack webhook routes
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── Header.tsx        # Navigation header
│   ├── Cart.tsx          # Shopping cart sidebar
│   └── Footer.tsx        # Footer component
├── lib/                   # Utility functions
│   ├── supabase/         # Supabase client setup
│   ├── paystack/         # Paystack API helpers
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
- `orders` - Customer orders (pending until Paystack verify/webhook marks paid)
- `order_items` - Order line items
- `payment_webhook_events` - Idempotent payment webhook deliveries
- `newsletter_subscribers` - Newsletter email list

## Adding Products

You can add products through the Supabase dashboard or by creating an admin interface. Products should include:
- Name
- Description
- Price
- Images (array of image URLs)
- Category ID
- Stock status

## Payment Integration (Paystack)

Checkout uses [Paystack](https://paystack.com/docs/payments/accept-payments/) in **ZAR** (South Africa). Totals are recomputed server-side from Supabase `products` / `product_variants` prices. Client prices are ignored. The customer is redirected to Paystack Checkout (`authorization_url`). Card details never touch this site.

The success page calls `GET /transaction/verify/:reference` on the server. A signed `charge.success` webhook is the durable confirmation. The callback URL alone is not treated as proof of payment.

### Owner setup (required before live payments)

1. **Apply the database migration** in the Supabase SQL editor: run `supabase/migrations/20261031120000_add_payment_columns.sql`. Do not skip this — orders need `payment_provider`, `payment_reference`, `payment_status`, and `paid_at`, and webhooks need `payment_webhook_events`.
2. **Supabase keys** (Project → Settings → API):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (server-only; never `NEXT_PUBLIC_`)
3. **Site URL**: set `NEXT_PUBLIC_SITE_URL` to `https://gummyfever.com` in production (or `http://localhost:3000` locally). This is used as Paystack `callback_url` (`https://gummyfever.com/checkout/success`).
4. **Paystack secret key**: log in at [Paystack Dashboard](https://dashboard.paystack.com) (South Africa). Open **Settings → API Keys & Webhooks**. Copy the **Test Secret Key** (`sk_test_...`) into `PAYSTACK_SECRET_KEY`. The public key is not required for this redirect integration.
5. **Webhook URL** (same dashboard page, Test mode):  
   `https://gummyfever.com/api/webhooks/paystack`
6. **Callback URL** (same dashboard page, and also sent per transaction):  
   `https://gummyfever.com/checkout/success`
7. Add the same env var **names** on Vercel (Project → Settings → Environment Variables). Do not commit values.
8. **Test**: complete a checkout with [Paystack test cards](https://paystack.com/docs/payments/test-payments/) (for example `4084084084084081`). Confirm the order in Supabase moves from `pending` to `paid` after verify/webhook. Amount is in cents (R1.00 = 100). Minimum charge here is R2.00.
9. **Go live**: switch the dashboard to Live, copy the **Live Secret Key** (`sk_live_...`) into `PAYSTACK_SECRET_KEY`, and set the **Live** webhook URL to `https://gummyfever.com/api/webhooks/paystack` (test and live webhooks are configured separately).

Never put `PAYSTACK_SECRET_KEY` in client code. `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` is unused here.

## Security Notes

- Row Level Security (RLS) is enabled on all tables
- Public read access is granted for products and categories
- User-specific access is enforced for orders (read own orders only)
- Orders are created with the service role after server-side price checks; clients cannot insert orders
- Paystack webhook signatures are verified (HMAC-SHA512 of the raw body vs `x-paystack-signature`)
- The success page verifies the transaction with Paystack before clearing the cart
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
