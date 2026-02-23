# Golden Dragon Restaurant - Chinese Restaurant Website

A full-stack restaurant ordering website built with Next.js 16, React 19, TypeScript, Tailwind CSS 4, and Supabase. Designed for a Chinese-style restaurant targeting Myanmar consumers with bilingual support (English and Myanmar/Burmese).

## Features

- 🏠 **Landing Page**: Hero section with tagline and signature dish categories
- 🔐 **Authentication**: Email/password login and registration with Supabase Auth
- 🌐 **Internationalization**: Full bilingual support (EN/MM) with language switcher
- 📱 **Responsive Design**: Mobile-first, fully responsive layout
- 🎨 **Modern UI**: Elegant Chinese restaurant theme with red/gold color scheme

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **React**: React 19
- **TypeScript**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Fonts**: Inter (body), Playfair Display (headings), Padauk (Myanmar script)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase project (sign up at [supabase.com](https://supabase.com))

### Installation

1. Clone the repository:
```bash
cd chinese-restaurant
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Add your Supabase credentials to `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
chinese-restaurant/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Landing page
│   ├── login/             # Login page
│   └── globals.css        # Global styles
├── components/            # React components
│   └── navbar.tsx         # Navigation bar
├── lib/                   # Utilities and configurations
│   ├── language-context.tsx  # i18n context provider
│   ├── translations.ts    # Translation strings
│   └── supabase/          # Supabase client setup
│       ├── client.ts      # Browser client
│       └── server.ts      # Server client
└── public/                # Static assets
```

## Supabase Setup

### Database Schema

The database schema will be set up in future steps. For now, ensure:

1. **Authentication** is enabled in your Supabase project
2. **Email** authentication method is enabled
3. **Storage** bucket for payment proofs (to be created)

### Required Tables (to be created)

- `profiles` - User profiles with roles
- `categories` - Menu categories
- `menu_items` - Menu items
- `cart_items` - Shopping cart items
- `orders` - Order records

## Current Status

✅ Project initialization  
✅ Landing page with hero and signature sections  
✅ Login page with Supabase Auth  
✅ Responsive navbar with language switcher  
✅ i18n system (EN/MM)  
✅ Supabase client configuration  

## Next Steps

- [ ] Signup page
- [ ] Menu page with categories
- [ ] About page
- [ ] Shopping cart functionality
- [ ] Checkout page with payment proof upload
- [ ] Orders history page
- [ ] Profile page
- [ ] Admin dashboard
- [ ] Supabase database schema and migrations

## License

Private project - All rights reserved
