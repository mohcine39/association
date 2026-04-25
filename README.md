# Association Ajyal Kighlan - Web Application

A modern, automated web application for the "Ajyal Kighlan Association" to aggregate events from Facebook and provide a professional presence online.

## 🚀 Features

- **Automated Sync**: Scrapes events (posts) from the association's Facebook page using Puppeteer.
- **Modern UI**: Clean, responsive design built with Next.js, Tailwind CSS, and Framer Motion.
- **RTL Support**: Optimized for both Arabic and French content.
- **Admin Panel**: Manually trigger syncs and manage events.
- **PostgreSQL Storage**: Durable event storage using Prisma ORM.

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), Tailwind CSS, Lucide React, Framer Motion.
- **Backend**: Next.js API Routes, Prisma ORM.
- **Scraper**: Puppeteer.
- **Database**: PostgreSQL.

## 📦 Getting Started

### 1. Prerequisites

- Node.js 18+
- PostgreSQL database

### 2. Installation

```bash
# Clone the repository
# (Assuming you are in the project folder)

# Install dependencies
npm install
```

### 3. Database Setup

Update the `DATABASE_URL` in your `.env` file, then run:

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init
```

### 4. Running Locally

```bash
npm run dev
```

Visit `http://localhost:3000` to see the site.
Visit `http://localhost:3000/admin` to trigger the first sync.

## 🚢 Deployment Guide

### Vercel (Frontend & API)

1. Connect your GitHub repository to Vercel.
2. Add your environment variables (`DATABASE_URL`, `NEXT_PUBLIC_APP_URL`).
3. **Note**: Puppeteer requires a special build step on Vercel. You may need to use `puppeteer-core` and a serverless-friendly browser (like `@sparticuz/chromium`) for production serverless functions.

### Railway / Render (Database)

1. Create a new PostgreSQL database on Railway or Render.
2. Copy the connection string and paste it into Vercel's environment variables.

## 🛡️ Important Notes on Facebook Scraping

Facebook's layout changes frequently. The scraper in `src/lib/scraper.ts` uses generic selectors to minimize breakage, but if the sync fails, you may need to update the selectors in that file.

---
© 2024 Association Ajyal Kighlan
