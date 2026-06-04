# PULSE — Nightlife Entertainment Platform (MVP)

A mobile-first, neon-themed nightlife app: discover events, book tables & VIP, pay with test Stripe, manage clubs, and receive notifications.

## Tech Stack
- React + TypeScript + Vite
- Tailwind CSS (mobile-first, neon theme)
- Supabase Edge Functions (Stripe Payment Gateway)
- Stripe.js (CDN) test payments

## Frontend Setup
`npm install` then `npm run dev`. Entry: `src/components/AppLayout.tsx` with global state in `src/store/AppStore.tsx`.

## Backend (Supabase)
Edge function `create-payment-intent` creates Stripe PaymentIntents via the gateway (`GATEWAY_API_KEY`). Email signups POST to the CRM subscribe endpoint.

## Test Stripe
Use card `4242 4242 4242 4242`, any future expiry, any CVC/ZIP. PaymentIntent is created server-side; client confirms with Stripe.js.

## Roles & Admin Dashboard
Sign up choosing role user/manager/admin. Managers/admins get the Manage tab (create events, mock analytics, revenue).

## Notifications
In-app alerts feed; booking/event creation push live notifications. (Hook up Expo/FCM for native push.)

## Deployment
Deploy frontend to Vercel; Supabase functions are already deployed.

## MVP Timeline
- W1: Auth + feed + prototype
- W2: Detail + booking + test payment
- W3: User dashboard + notifications
- W4: Manager dashboard + analytics
- W5: Polish + deploy

## Roadmap
Loyalty points, live DJ schedules, event chat, premium subscriptions, geolocation promos.
