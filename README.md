# AgriHold AI

AgriHold AI is a fullstack agricultural intelligence platform built with Next.js App Router, TypeScript, Tailwind CSS, Auth.js, an internal Antigravity UI component layer, and MongoDB Atlas.

## Stack

- Next.js 16 App Router with route handlers
- TypeScript and Tailwind CSS 4
- Auth.js through `next-auth@beta`
- MongoDB Atlas through the official MongoDB driver
- Zod request and environment validation
- Reusable Antigravity UI primitives in `src/components/antigravity`

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Then open `http://localhost:3000`.

Required production variables:

```bash
MONGODB_URI="mongodb+srv://USER:PASSWORD@cluster.mongodb.net/?retryWrites=true&w=majority"
MONGODB_DB="agrihold-ai"
AUTH_SECRET="replace-with-openssl-rand-base64-32"
NEXTAUTH_SECRET="replace-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"
```

## Architecture

- `app/`: App Router pages, route groups, and public API endpoints.
- `app/api/auth/[...nextauth]`: Auth.js route handlers.
- `app/api/farms`: protected farm holding read/write API.
- `app/api/insights`: protected AI insight API scaffold.
- `app/api/health`: service readiness endpoint.
- `src/lib/db`: MongoDB Atlas client and collection factories.
- `src/lib/auth`: Auth.js configuration and exported helpers.
- `src/lib/api`: shared API response helpers.
- `src/components/antigravity`: internal startup-grade UI primitive system.
- `src/features`: feature modules for product screens and future domain workflows.

## Verification

```bash
npm run lint
npm run build
```
