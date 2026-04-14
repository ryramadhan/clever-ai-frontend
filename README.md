# 🌙 MoodWrite AI Frontend

Monochrome AI Mood Caption Generator — React frontend for generating aesthetic captions based on mood. Minimal, modern, responsive.

🌐 **Bilingual UI** — Toggle between English and Indonesia with one click.

## 🌐 Live Demo

🌐 [https://moodwrite-ai.vercel.app](https://moodwrite-ai.vercel.app)

## 🧰 Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 19 |
| Build Tool | Vite |
| Language | TypeScript |
| Styling | Tailwind CSS (Monochrome) |
| Deploy | Vercel |

## ✨ Features

- **Monochrome UI** — Minimal, clean aesthetic
- **5 Mood Options** — Lonely, Night, Nostalgic, Lost, Calm
- **Bilingual Support** — Toggle EN/ID language in navbar
- **Real-time Generation** — AI-powered captions via backend API
- **History** — View previously generated captions
- **Copy to Clipboard** — One-click caption copy
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

| Mode | `VITE_API_BASE_URL` |
|------|---------------------|
| Development | `/api` (Vite proxy ke localhost:4000) |
| Production | `https://your-backend.vercel.app` |

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
VITE_API_BASE_URL=https://moodwrite-api.vercel.app
```

## 📁 Project Structure

```
src/
├── components/     # Reusable UI components
├── contexts/       # React contexts (LanguageContext)
├── pages/          # Page components
├── services/       # API service layer
├── assets/         # Images, icons
├── App.jsx         # Root component
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

POST ${API_BASE}/api/generate
GET  ${API_BASE}/api/captions
```

## 🔗 Related

- [moodwrite-ai-backend](https://github.com/ryramadhan/moodwrite-ai-backend) — Express API

## 📄 License

MIT
