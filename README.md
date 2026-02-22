# Gummy Fever Ecommerce Website

A modern, minimalist ecommerce website for premium gummy clothing, built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Features

- 🛍️ Product catalog with categories and collections
- 🛒 Shopping cart with persistent storage
- 💳 Checkout flow
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

Edit `.env.local` and add your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Set up the database:
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Run the SQL script from `supabase/schema.sql`

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
│   ├── checkout/          # Checkout pages
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── Header.tsx        # Navigation header
│   ├── Cart.tsx          # Shopping cart sidebar
│   └── Footer.tsx        # Footer component
├── lib/                   # Utility functions
│   ├── supabase/         # Supabase client setup
│   └── store/            # Zustand stores
├── types/                 # TypeScript type definitions
└── supabase/              # Database schema
    └── schema.sql        # SQL schema file
```

## Database Schema

The database includes the following tables:
- `categories` - Product categories
- `products` - Product information
- `product_variants` - Product variants (size, color, etc.)
- `orders` - Customer orders
- `order_items` - Order line items
- `newsletter_subscribers` - Newsletter email list

## Adding Products

You can add products through the Supabase dashboard or by creating an admin interface. Products should include:
- Name
- Description
- Price
- Images (array of image URLs)
- Category ID
- Stock status

## Payment Integration

The checkout page is set up but requires integration with a payment processor (Stripe recommended). Update the `handleSubmit` function in `app/checkout/page.tsx` to integrate with your payment provider.

## Security Notes

- Row Level Security (RLS) is enabled on all tables
- Public read access is granted for products and categories
- User-specific access is enforced for orders
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
