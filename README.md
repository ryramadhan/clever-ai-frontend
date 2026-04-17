# 🤖 MoodWrite AI Frontend

AI Assistant Chat Interface — React frontend for asking questions and getting AI-powered responses. Minimal, modern, responsive.

🌐 **Bilingual UI** — Toggle between English and Indonesia with one click.

## 🌐 Live Demo

🌐 [https://clever-ai-chat.vercel.app](https://clever-ai-chat.vercel.app)

## 🧰 Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 19 |
| Build Tool | Vite |
| Language | TypeScript |
| Styling | Tailwind CSS (Monochrome) |
| Auth | JWT + Google OAuth |
| Routing | React Router DOM |
| Deploy | Vercel |

## ✨ Features

- **Monochrome UI** — Minimal, clean aesthetic
- **Authentication System** — Email/Password + Google OAuth login
- **Guest Mode** — Use without login (history not saved)
- **Data Separation** — Each user sees only their own history
- **Single Context Input** — Ask anything in one text area (max 2000 chars)
- **Bilingual Support** — Toggle EN/ID language in navbar
- **Real-time AI Responses** — Get answers via backend API with fallback
- **History** — View previously asked questions and responses
- **Copy to Clipboard** — One-click response copy
- **Typing Effect** — Smooth text animation
- **Fully Responsive** — Mobile & desktop

## 🚀 Setup Local

```bash
npm install
```

### 🔧 Environment Variables

```bash
cp .env.example .env
```

| Mode | `VITE_API_BASE_URL` | `VITE_GOOGLE_CLIENT_ID` |
|------|---------------------|-------------------------|
| Development | `/api` (Vite proxy) | From Google Cloud Console |
| Production | `https://your-backend.vercel.app` | From Google Cloud Console |

### ▶️ Run Dev

```bash
npm run dev
```

Frontend: `http://localhost:5173`

### 📦 Build

```bash
npm run build
```

Output: `dist/` folder

## ☁️ Deployment (Vercel)

### 1. Vercel Project Settings

- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### 2. Environment Variables

Add di Vercel Dashboard:

```
VITE_API_BASE_URL=https://your-backend.vercel.app
```

## 📁 Project Structure

```
src/
├── components/     # Reusable UI components
├── contexts/       # React contexts (AuthContext, LanguageContext)
├── pages/          # Page components (Home, Login, Register, etc)
├── services/       # API service layer (auth + chat APIs)
├── assets/         # Images, icons
├── App.jsx         # Root component (Router + AuthProvider)
├── main.jsx        # Entry point
└── index.css       # Global styles (Tailwind + custom)
```

## 🏗️ Architecture

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Vercel    │──────▶   Vercel    │──────▶    Neon     │
│  Frontend   │      │   Backend   │      │  PostgreSQL │
│  (React)    │      │  (Express)  │      │             │
└─────────────┘      └─────────────┘      └─────────────┘
                              │
                              ▼
                       ┌─────────────┐
                       │    Gemini   │
                       │     AI      │
                       └─────────────┘
```

## 🔌 API Integration

Base URL configured via `VITE_API_BASE_URL`:

```typescript
// services/api.ts
const API_BASE = import.meta.env.VITE_API_BASE_URL;

// Auth Endpoints
POST ${API_BASE}/api/auth/register
POST ${API_BASE}/api/auth/login
POST ${API_BASE}/api/auth/google
POST ${API_BASE}/api/auth/forgot-password
POST ${API_BASE}/api/auth/reset-password
GET  ${API_BASE}/api/auth/me

// Chat Endpoints
POST ${API_BASE}/api/generate
GET  ${API_BASE}/api/captions
```

## 🔐 Authentication Flow

### Guest Mode (No Login)
- Can use AI chat without authentication
- History saved as "global" (user_id = NULL)
- Cannot access personal history across devices

### Email/Password Login
1. Register at `/register` with email + password
2. Login at `/login`
3. JWT token stored in localStorage
4. All history private to that user

### Google OAuth Login
1. Click "Sign in with Google" button
2. One-tap login (desktop) or popup (mobile)
3. Auto-register if new user, login if existing
4. Same JWT token system

### Data Privacy
- Strict data separation: users only see their own data
- No cross-user data leakage
- Guest data is separate from authenticated user data

## 🔗 Related

- [clever-ai-backend](https://github.com/ryramadhan/clever-ai-backend) — Express AI API
