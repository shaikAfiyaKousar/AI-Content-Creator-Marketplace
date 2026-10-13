# ⚡ Synthetix — AI Content Creator Marketplace

[![React](https://img.shields.io/badge/React-18.2-blue.svg)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.19-lightgrey.svg)](https://expressjs.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8.svg)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose%208-47A248.svg)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)

**Synthetix** is an AI-native marketplace platform designed specifically for generative media production. It connects enterprise brands, marketing directors, and creative agencies with elite AI content creators (prompt engineers, model fine-tuners, and AI video directors specializing in Midjourney, Flux, Runway Gen-3, ComfyUI, ElevenLabs, Kling, and Stable Diffusion).

---

## 🌟 Key Features

### 1. User Authentication & Role Architecture
- **Dual Personas:** Sign up or log in as an **AI Creator** or **Brand / Agency**.
- **Role-Based Portals:** Dedicated dashboards tailored to each role's specific workflows.
- **Secure Authentication:** JWT tokens with bcrypt-hashed passwords and bearer authorization interceptors.
- **Local Demo Switcher:** Development mode includes one-click test accounts; production does not seed shared demo passwords.

### 2. Creator Profiles & AI Provenance Portfolios
- **Technical Profiles:** AI tools stack, skill tags, hourly rates, project minimums, experience years, and availability badges.
- **AI-Specific Portfolio Modal:** Inspect full generative prompts, negative prompts, model checkpoints (e.g., *Midjourney v6.1*, *Flux Dev*, *Runway Gen-3*), seeds, samplers, and CFG scale settings.
- **One-Click Prompt Copying:** Test or study generation prompts directly from the portfolio showcase.
- **Portfolio Management:** Creators can upload new AI artworks, document technical parameters, or remove assets.

### 3. Creator Discovery & Multidimensional Filters
- **Natural Search:** Search by creator name, prompt styles, LoRA keywords, and tools.
- **Deep Filtering:** Filter by creative discipline, AI tool pipeline (Midjourney, Runway, Flux, ComfyUI, etc.), hourly rate ceiling, and real-time availability.
- **Multi-Sort Options:** Highest rated, most projects completed, years of experience, or pricing.
- **Interactive Previews:** Hover and click on portfolio previews directly on creator cards.

### 4. Dynamic Creative Briefs (Brand Hub)
- **Structured AI Brief Authoring:** Specify campaign title, category, target audience, deliverables checklist, required AI tools, deadline date, and budget range ($min - $max).
- **Prompt Guidelines:** Define lighting, aspect ratios, style references, and negative prompt constraints.
- **Applicant Evaluation:** Review applicant proposals with automated **AI Match Scores** and explanations.

### 5. Intelligent AI-Powered Matching Engine
- **Multi-Factor Weighted Algorithm:**
  1. **AI Tool Overlap (35% weight):** Matches required tools in the brief against creator's declared tools and portfolio items.
  2. **Category & Aesthetic Fit (25% weight):** Evaluates category experience and portfolio tags.
  3. **Budget Compatibility (20% weight):** Assesses proposed rate and creator project minimum against brief budget.
  4. **Reputation & Track Record (10% weight):** Historical ratings and volume of completed projects.
  5. **Real-Time Availability (10% weight):** Available, Busy, or Booked status.
- **Natural Language Explanations:** Clear, human-readable rationale explaining why a creator matches (e.g., *"96% Match: Exceptional tool alignment (Midjourney + Flux); Proven portfolio history in Advertising; Creator baseline ($800) fits budget ($1,200 - $2,500); 4.95★ rating across 34 projects"*).
- **Automated Scoring on Application:** Evaluates creators automatically as soon as they submit a pitch.

### 6. Full Project Management Lifecycle
- **End-to-End Stages:**
  - `Pending` ➔ `In Progress` ➔ `Submitted` ➔ `Revision Requested` ➔ `Completed`
- **Asset Deliverables Section:** Creators upload renders with asset URLs, notes, prompt logs, and tools used.
- **Revision Workflow:** Brands request iterations with targeted feedback, automatically moving the project to `Revision Requested`.
- **Completion & Verified Reviews:** Brands approve masters, release funds, and rate creator performance (1–5 stars) with written feedback that updates the creator's public rating.
- **Workspace Collaboration Chat:** Project-specific messaging stream between brand and creator.

### 7. Direct Messaging Platform
- Two-pane responsive chat application with active contact list, unread indicators, and timestamps.
- One-click prompt helper pills for swift agency-creator communication.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite 5, Tailwind CSS 3, Lucide React, Axios, React Router v6 |
| **Backend** | Node.js, Express.js, Morgan, CORS, Dotenv |
| **Database** | MongoDB (Mongoose 8) with automatic `mongodb-memory-server` fallback |
| **Authentication** | JSON Web Tokens (JWT), Bcrypt.js |
| **AI Matching** | Custom Multi-Factor Scoring Engine with Natural Language Justification |

---

## 📁 Project Structure

```
HackXlerate/
├── client/                      # React 18 + Vite frontend
│   ├── src/
│   │   ├── api/                 # Axios client with JWT interceptors
│   │   ├── context/             # AuthContext (with 1-click demo switcher) & ThemeContext
│   │   ├── components/          # Reusable UI components (Navbar, Sidebar, CreatorCard, PortfolioModal, etc.)
│   │   ├── pages/               # 10 core application pages
│   │   ├── App.jsx              # Application router & protected routes
│   │   ├── main.jsx             # React entry point
│   │   └── index.css            # Tailwind directives & glow utilities
│   ├── tailwind.config.js       # Dark/light theme & brand colors
│   └── vite.config.js           # Vite dev server with backend API proxy
├── server/                      # Node.js + Express backend
│   ├── config/
│   │   └── db.js                # MongoDB connection (URI or auto memory fallback)
│   ├── controllers/             # Auth, Creator, Brief, Application, Project, Message, Match controllers
│   ├── middleware/              # JWT verification (protect) and role authorization (authorize)
│   ├── models/                  # Mongoose models (User, CreatorProfile, BrandProfile, Brief, etc.)
│   ├── routes/                  # Express API routers
│   ├── services/
│   │   └── aiMatcher.js         # Multi-factor AI matching and scoring engine
│   ├── seeds/
│   │   └── seedData.js          # Realistic development seed script
│   ├── .env                     # Server environment variables
│   └── index.js                 # Express server bootstrap & auto-seeder
├── package.json                 # Monorepo orchestration scripts
├── .env.example                 # Root environment template
└── README.md                    # Platform documentation
```

---

## 🚀 Quick Start & Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm
- *Optional:* Local MongoDB (if not running, the application **automatically initializes an embedded in-memory MongoDB instance** without manual configuration).

### Step 1: Install Dependencies
From the project root:
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
cd ..
```

### Step 2: Seed the Database
Populate realistic AI creators, briefs, applications, and multi-stage projects:
```bash
npm run seed
# or: cd server && npm run seed
```

### Configure the Backend Database
The API reads `server/.env` when started from the `server` directory. Copy `server/.env.example` to `server/.env`, then set `MONGODB_URI` to your MongoDB Atlas connection string (including a database name) for persistent data. Keep the real `.env` file private; it is ignored by Git. If `MONGODB_URI` is blank, development first tries local MongoDB and then uses a temporary in-memory database. A configured URI that cannot connect now stops the API with an error instead of silently losing persistence.

For deployment, set `MONGODB_URI`, `JWT_SECRET`, and `CORS_ORIGIN` in the hosting provider's environment settings. `render.yaml` already defines the API service and the GitHub Pages origin. The GitHub Pages workflow now builds with the Render API origin by default; set the GitHub Actions repository variable `VITE_API_URL` only if you host the API at a different origin (without `/api`).

### Step 3: Run the Application
Open two terminal windows:

**Terminal 1 (Backend API):**
```bash
cd server
npm run dev
# Starts API server on http://localhost:5000
```

**Terminal 2 (Frontend Client):**
```bash
cd client
npm run dev
# Starts React frontend on http://localhost:5173
```

Open your browser and navigate to: **`http://localhost:5173`**

---

## 🔑 Demo Accounts for Rapid Evaluation

Use the **"Demo Switcher"** button in the top navigation bar to test any account with one click, or use these credentials:

| Role | Name | Email | Password | Primary Specialty |
|---|---|---|---|---|
| **Brand** | Apex Digital Studios | `brand@apex.com` | `password123` | Gaming & AAA Commercials |
| **Brand** | Lumina Beauty Collective | `brand@lumina.com` | `password123` | Luxury Cosmetics & Skincare |
| **Creator** | Elena Rostova | `creator@elena.com` | `password123` | Midjourney v6.1 & Flux Photorealism |
| **Creator** | Marcus Vance | `creator@marcus.com` | `password123` | Runway Gen-3 & Kling AI Video |
| **Creator** | Aria Chen | `creator@aria.com` | `password123` | ComfyUI Workflows & LoRA Training |
| **Creator** | David O'Connor | `creator@david.com` | `password123` | ElevenLabs Voice & Audio Storytelling |
| **Creator** | Sofia Ramos | `creator@sofia.com` | `password123` | Haute Couture Editorial Imagery |

---

## 📡 API Reference Overview

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register as a Creator or Brand.
- `POST /api/auth/login` — Sign in and receive JWT token.
- `GET /api/auth/me` — Retrieve authenticated user and profile.
- `PUT /api/auth/profile` — Update user profile details and rates.
- `GET /api/auth/demo-accounts` — List pre-seeded demo accounts.

### Creators & Portfolios (`/api/creators`)
- `GET /api/creators` — Search and filter creators by category, tool, rate, rating, or availability.
- `GET /api/creators/:id` — Retrieve full creator profile, stats, and portfolio items.
- `POST /api/creators/portfolio` — Add a new portfolio item with prompt metadata (Creator only).
- `PUT /api/creators/portfolio/:id` — Update a portfolio item (Creator only).
- `DELETE /api/creators/portfolio/:id` — Remove a portfolio item (Creator only).

### Creative Briefs (`/api/briefs`)
- `GET /api/briefs` — Retrieve all open creative briefs with filters.
- `GET /api/briefs/:id` — Retrieve single brief details.
- `GET /api/briefs/brand/my-briefs` — Retrieve briefs published by logged-in brand.
- `POST /api/briefs` — Publish a new creative brief (Brand only).
- `PUT /api/briefs/:id` — Update brief specs (Brand only).
- `DELETE /api/briefs/:id` — Close brief (Brand only).

### Applications (`/api/applications`)
- `POST /api/applications/:briefId` — Submit a pitch with automated AI Match Score calculation (Creator only).
- `GET /api/applications/brief/:briefId` — View applications submitted for a brief (Brand only).
- `GET /api/applications/creator/my-applications` — View all applications submitted by logged-in creator.
- `PUT /api/applications/:id/status` — Accept or reject application; automatically creates active `Project` workspace when accepted.

### Projects Lifecycle (`/api/projects`)
- `GET /api/projects` — Retrieve active and completed projects for logged-in user.
- `GET /api/projects/:id` — Retrieve full project workspace.
- `PUT /api/projects/:id/stage` — Update project stage.
- `POST /api/projects/:id/deliverables` — Submit deliverables with prompts and tool tags (Creator only).
- `POST /api/projects/:id/revisions` — Request revisions with feedback notes (Brand only).
- `PUT /api/projects/:id/complete` — Approve deliverables, complete project, and submit star review (Brand only).

### AI Matchmaker (`/api/match`)
- `GET /api/match/recommendations/:briefId` — Retrieve top AI-ranked creators for a specific brief with percentage scores and rationale.
- `POST /api/match/evaluate` — Evaluate ad-hoc match score between any creator and brief criteria.

### Messaging (`/api/messages`)
- `GET /api/messages/conversations` — Retrieve all active conversation threads.
- `GET /api/messages/thread/:otherUserId` — Retrieve conversation history with a user.
- `POST /api/messages` — Send a direct or project message.

---

## 🧪 Verification & Testing Checklist

- [x] **Authentication:** Login and registration work for both Creator and Brand accounts with validation.
- [x] **Discovery & Search:** Real-time search filters creators by tool (*Runway*, *Midjourney*, *Flux*), rate slider, and rating.
- [x] **Portfolio Modals:** Clicking any portfolio preview renders high-res media, prompt inspector, seed, and model checkpoints.
- [x] **Brief Creation:** Brands can post briefs with deliverables checklists and required AI tools.
- [x] **AI Matching Engine:** Accurately matches Marcus Vance (99%) for video briefs and Elena Rostova (96%) for commercial packshot briefs with dynamic explanations.
- [x] **Application Submissions:** Creators apply for briefs and receive an instant AI compatibility score.
- [x] **Acceptance & Project Workspace:** Brands accept applications, automatically provisioning a `Project` workspace.
- [x] **Lifecycle Stages:** Stage moves from `In Progress` ➔ `Submitted` (on deliverable upload) ➔ `Revision Requested` (on brand feedback) ➔ `Completed` (on approval + star review).
- [x] **Direct Messaging:** Live chat between brand and creator within projects and on the messages page.
- [x] **Responsive UI:** Works on mobile, tablet, and desktop with dark and light theme toggle.

---

## 🛡️ Security & Architecture Best Practices

- **Zero Hardcoded Secrets:** Configured via `.env` files with sane development defaults.
- **Development DB Fallback:** Local development can use MongoDB Atlas/local Mongo or an isolated memory database. Production requires a configured persistent MongoDB URI.
- **Scoped Authorization:** Strict middleware guards enforce role privileges (brands cannot apply to briefs; creators cannot approve briefs).
- **Graceful Error Handling:** Centralized Express error handler catches CastErrors, duplicate keys, and validation exceptions.
## Production Deployment

GitHub Pages hosts the React frontend only. Account registration, sign-in, profiles, briefs, applications, projects, and messages require the Express API and a persistent MongoDB database.

## Deploy the API

1. Create a MongoDB Atlas database and database user. In Atlas Network Access, allow connections from your API host. Keep the database URI private.
2. In Render, choose **New → Blueprint**, connect this repository, and deploy the `render.yaml` service.
3. When Render asks for `MONGODB_URI`, enter the Atlas connection string, including the database name. Render generates `JWT_SECRET` from the Blueprint.
4. Wait for the Render service health check at `/api/health` to pass. Copy the service origin, for example `https://ai-content-creator-marketplace-api.onrender.com` (do not append `/api`).

## Connect GitHub Pages to the API

1. In the GitHub repository, open **Settings → Secrets and variables → Actions → Variables**.
2. Add a repository variable named `VITE_API_URL` with the Render service origin.
3. In **Settings → Pages**, confirm the source is **GitHub Actions**. Then rerun **Deploy Website** from the **Actions** tab, or push another commit.

The frontend build appends `/api` to `VITE_API_URL`. The API only permits the GitHub Pages origin and local Vite development by default. User accounts and marketplace records are stored in MongoDB and survive API restarts.
