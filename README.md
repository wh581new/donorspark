# DonorSpark by BetterWorld

AI-powered auction item advisor that helps donors discover creative, high-value items they never knew they could offer.

## Deploy to Vercel (Step-by-Step)

### Step 1: Get your Anthropic API Key
1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign up or log in
3. Go to **API Keys** in the left sidebar
4. Click **Create Key**
5. Copy and save the key somewhere safe

### Step 2: Push to GitHub
1. Go to [github.com](https://github.com) and sign in (or create an account)
2. Click the **+** button (top right) → **New repository**
3. Name it `donorspark`
4. Keep it **Public** (or Private if you prefer)
5. Click **Create repository**
6. Follow the instructions on the page to push this code (see below)

### Step 3: Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) and sign up with your GitHub account
2. Click **Add New** → **Project**
3. Find and select your `donorspark` repository
4. Before deploying, expand **Environment Variables**
5. Add: `ANTHROPIC_API_KEY` = (paste your API key from Step 1)
6. Click **Deploy**
7. Wait ~1 minute — your app is live!

### Step 4: Share your app
Vercel will give you a URL like `donorspark.vercel.app`. Share this with your team!

## Local Development

```bash
npm install
cp .env.example .env.local
# Edit .env.local and add your ANTHROPIC_API_KEY
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Tech Stack
- Next.js 14 (React)
- Tailwind CSS
- Anthropic Claude API (claude-sonnet-4-5)
- Deployed on Vercel
