# PHISH_DEF

PHISH_DEF is a phishing and social-engineering detection app built as a pnpm monorepo. It combines a React frontend, an Express API, rule-based heuristics, and an in-process ML-style classifier to analyze email or message content and classify it as:

- `Legitimate`
- `AI-Generated Suspicious`
- `Phishing`

The project also includes scan history, statistics, confidence scoring, threat levels, indicator extraction, and deployment support for Vercel.

## Features

- Hybrid phishing detection using text patterns, behavioral rules, and link/domain heuristics
- Social-engineering detection for CEO fraud, gift card scams, fake delivery notices, job scams, and similar attacks
- Confidence score and threat level output
- Suspicious keyword and URL extraction
- History and analytics dashboard
- In-memory fallback when `DATABASE_URL` is not configured
- Vercel-ready setup for frontend and API in a single deployment

## Project Structure

```text
.
|-- api/                            # Root Vercel API entrypoints
|-- artifacts/
|   |-- api-server/                # Express backend
|   |-- phishing-detector/         # React + Vite frontend
|   `-- mockup-sandbox/            # Additional sandbox app
|-- lib/
|   |-- api-client-react/          # Shared frontend API client
|   |-- api-zod/                   # Shared API schemas
|   `-- db/                        # DB access + memory fallback
|-- scripts/
|-- package.json
|-- pnpm-workspace.yaml
`-- vercel.json
```

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, TanStack Query, Framer Motion
- Backend: Express 5, TypeScript, esbuild, pino
- Shared packages: Zod, workspace API client, workspace DB package
- Package manager: pnpm via Corepack

## Local Development

Use `corepack pnpm` if plain `pnpm` is not available on your machine.

### 1. Install dependencies

```powershell
cd C:\Users\HP\Downloads\AI-Insight-Engine-main\AI-Insight-Engine-main
corepack pnpm install --no-frozen-lockfile
```

### 2. Start the backend

```powershell
cd C:\Users\HP\Downloads\AI-Insight-Engine-main\AI-Insight-Engine-main
$env:PORT='8080'
corepack pnpm --filter @workspace/api-server run dev
```

If backend dev mode fails in your environment, use the bundled output:

```powershell
cd C:\Users\HP\Downloads\AI-Insight-Engine-main\AI-Insight-Engine-main
$env:PORT='8080'
node --enable-source-maps .\artifacts\api-server\dist\index.mjs
```

### 3. Start the frontend

```powershell
cd C:\Users\HP\Downloads\AI-Insight-Engine-main\AI-Insight-Engine-main
$env:PORT='22772'
$env:BASE_PATH='/'
$env:API_BASE_URL='http://127.0.0.1:8080'
corepack pnpm --filter @workspace/phishing-detector run dev
```

### 4. Open the app

- Frontend: `http://127.0.0.1:22772`
- API home: `http://127.0.0.1:8080`
- API health: `http://127.0.0.1:8080/api/healthz`

## One-Terminal Startup

This starts the backend in a new PowerShell window and the frontend in the current terminal:

```powershell
cd C:\Users\HP\Downloads\AI-Insight-Engine-main\AI-Insight-Engine-main
Start-Process powershell -ArgumentList '-NoExit','-Command', '$env:PORT="8080"; node --enable-source-maps .\artifacts\api-server\dist\index.mjs'
$env:PORT='22772'
$env:BASE_PATH='/'
$env:API_BASE_URL='http://127.0.0.1:8080'
corepack pnpm --filter @workspace/phishing-detector run dev
```

## API Endpoints

- `GET /api/healthz` - health check
- `POST /api/predict` - analyze email/message content
- `GET /api/history` - recent predictions
- `GET /api/stats` - aggregate scan statistics

## Detection Logic

The visible score breakdown in the UI is:

- `ml_score`
- `rule_score`
- `ai_score`

The backend also uses additional internal risk signals:

- Behavioral scoring for social engineering
- Domain/link risk scoring
- Hybrid scoring to combine model and rule signals

This helps catch attacks that do not look like classic phishing at first glance, such as:

- CEO fraud
- Gift card requests
- Job scams requesting ID proof
- Fake password reset domains
- Delivery reschedule scams
- Human-like malicious document sharing emails

## Data Storage

If `DATABASE_URL` is set, the backend can use Postgres through the shared DB package.

If `DATABASE_URL` is not set, the app falls back to in-memory storage:

- history and stats still work
- data resets when the backend restarts
- serverless persistence will be limited

## Build Commands

From the repo root:

```powershell
corepack pnpm run typecheck
corepack pnpm run build
```

Useful package-level commands:

```powershell
corepack pnpm --filter @workspace/phishing-detector run build
corepack pnpm --filter @workspace/phishing-detector run typecheck
corepack pnpm --filter @workspace/api-server run build
corepack pnpm --filter @workspace/api-server run typecheck
```

## Vercel Deployment

This repository is configured so the root Vercel deployment serves:

- static frontend output from `artifacts/phishing-detector`
- API routes from the bundled backend through `api/`

Current root Vercel build flow:

1. Build `artifacts/api-server` into `dist/`
2. Build the frontend
3. Serve SPA routes through `index.html`
4. Keep `/api/*` routed to the backend

Important notes:

- If you set `VITE_API_BASE_URL`, the frontend will use that external backend URL instead of same-origin `/api`
- If you want persistent history/stats on Vercel, configure `DATABASE_URL`

## Current Status

The project currently includes:

- fixed history page runtime error
- improved phishing logic for social-engineering cases
- API root status page
- local development fallback for missing `pnpm`
- Vercel configuration for frontend + backend from one repo

## License

MIT
