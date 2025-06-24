# Property Rental Website with Hybrid Recommender System

A modern property rental platform built with Next.js and FastAPI, featuring a hybrid recommender system that combines collaborative filtering and content-based techniques to provide personalized property recommendations.

## Live Demo

- **Website**: [https://fyp-renralhome.vercel.app/](https://fyp-rentalhome.vercel.app/)
- **API**: [https://property-recommender-api.onrender.com](https://property-recommender-api.onrender.com)

> **Important**: The API service is hosted on Render's free tier, which automatically spins down after 15 minutes of inactivity. **The API requires manual restart through the Render dashboard**. If the recommendation section keeps loading indefinitely, the API service is likely sleeping and needs to be manually restarted.

## Features

- 🏠 Property listing and search functionality
- 🔍 Advanced filtering (location, price, property type, etc.)
- 🗺️ Google Maps integration for property locations
- 👤 User authentication with email verification
- 💼 Landlord verification system
- ⭐ Wishlist functionality
- 🤖 Hybrid recommender system (NCF + Content-based)
- 📱 Fully responsive design
- 👨‍💼 Admin dashboard for managing users and applications

## Installation

1. Clone the repository:
```bash
git clone https://github.com/chanzb0119/fyp.git
```

2. Install frontend dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Fill in the required environment variables:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key
NEXTAUTH_SECRET=your_nextauth_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SMTP_HOST=your_smtp_host
SMTP_PORT=your_smtp_port
SMTP_USER=your_smtp_user
SMTP_PASSWORD=your_smtp_password
```

4. Run the development server:
```bash
npm run dev
```