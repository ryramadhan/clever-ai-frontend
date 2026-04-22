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

- **ChatGPT/Gemini-style UI** — Professional monochrome aesthetic
- **Authentication System** — Email/Password + Google OAuth login
- **Guest Mode** — Use without login (history not saved)
- **Data Separation** — Each user sees only their own history
- **Personalized Hero** — "Hello {name}" greeting like Gemini
- **Smart Chat Layout** — User messages right, AI responses left
- **Error Resilience** — Auto-retry (3x) with exponential backoff for network errors
- **Timeout Handling** — "Taking longer than usual..." after 30s
- **HTTP Status Code Logic** — Smart retry based on error type (429/401/403 vs network)
- **Single Context Input** — Ask anything in one text area (max 2000 chars)
- **Bilingual Support** — Toggle EN/ID language
- **Real-time AI Streaming** — Server-Sent Events (SSE) for ChatGPT-style response streaming
- **History Management** — View, rename, pin, delete conversations
- **Copy to Clipboard** — One-click response copy
- **Smart Auto-scroll** — Smooth scroll following streaming content
- **Stream Cancellation** — Stop button during AI streamings
- **Smooth New Chat Flow** — Fade transitions with loading states
- **Error Recovery** — Retry button with visual error states
- **History Skeleton Loading** — Animated placeholders while loading
- **Minimal Footer Navigation** — Clean bottom info with Product, Resources, Legal links
- **Smooth Page Navigation** — React Router with ScrollToTop component
- **Multi-page Support** — Docs, Guide, Changelog, Privacy, Terms, Security pages
- **Fully Responsive** — Mobile & desktop optimized

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
├── components/
│   ├── layout/                 # Layout & structural components
│   │   ├── Header.jsx          # Top navigation with auth & mobile toggle
│   │   ├── Footer.jsx          # Minimal bottom navigation with links
│   │   └── Sidebar.jsx         # Main sidebar (full height, no duplication)
│   ├── chat/                   # Chat-related components
│   │   ├── ChatResultCard.jsx      # AI response display with streaming indicator
│   │   ├── ChatHistoryList.jsx     # History list component
│   │   └── ChatHistorySkeleton.jsx # Loading skeleton for history
│   ├── ui/                     # UI primitives & reusable components
│   │   └── Button.jsx         # Reusable button component
│   ├── common/                 # Shared utility components
│   │   └── ScrollToTop.jsx    # Auto-scroll to top on route change
│   ├── sidebar/               # Sidebar sub-components
│   │   ├── SidebarChatHistory.jsx  # History list with skeleton loading
│   │   ├── SidebarUserFooter.jsx   # User avatar & logout (with Google profile pic)
│   │   ├── SidebarGuestFooter.jsx  # Guest CTA
│   │   ├── GuestSearchCta.jsx      # Guest search CTA
│   │   └── HistoryItemMenu.jsx     # Dropdown menu for history items
│   └── modals/                # Modal components
│       ├── LogoutConfirmModal.jsx  # Reusable logout confirmation
│       └── DeleteConfirmModal.jsx  # Delete history confirmation
├── contexts/
│   ├── AuthContext.jsx        # JWT + Google OAuth state
│   └── LanguageContext.jsx    # EN/ID translation
├── pages/
│   ├── HomePage.jsx           # Main chat interface with error handling
│   ├── auth/                  # Authentication pages
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── ForgotPasswordPage.jsx
│   │   └── ResetPasswordPage.jsx
│   ├── docs/                  # Documentation pages
│   │   ├── DocsPage.jsx      # API documentation
│   │   └── GuidePage.jsx     # User guide
│   ├── changelog/             # Changelog page
│   │   └── ChangelogPage.jsx
│   └── legal/                 # Legal pages
│       ├── PrivacyPage.jsx   # Privacy policy
│       ├── TermsPage.jsx     # Terms of service
│       └── SecurityPage.jsx  # Security information
├── services/
│   └── api.js                 # API layer with error status handling
├── assets/                    # Images, icons
├── App.jsx
├── main.jsx
└── index.css
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

// Chat Endpoints (Streaming)
POST ${API_BASE}/api/generate/stream  # SSE streaming (recommended)
POST ${API_BASE}/api/generate         # Legacy non-streaming
GET  ${API_BASE}/api/captions
```

## 🌊 Server-Sent Events (SSE) Streaming

The frontend now consumes AI responses via **SSE streaming** for real-time, ChatGPT-like experience:

### Architecture Change
```
BEFORE: Request → Wait full response → Client-side typing animation
AFTER:  Request → Stream chunks via SSE → Real-time display
```

### Key Changes
- **Removed:** `useTypingText` hook (client-side animation)
- **Added:** `generateResponseStream()` in `services/api.js` for SSE consumption
- **Added:** Auto-scroll following streaming content
- **Added:** AbortController for stream cancellation

### Frontend Implementation
```javascript
// services/api.js - SSE consumer
export async function* generateResponseStream({ context, signal }) {
  const res = await fetch('/api/generate/stream', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ context }),
    signal, // AbortController support
  });
  
  const reader = res.body.getReader();
  // ... SSE parsing logic
  yield { chunk: 'partial text', provider: 'gemini' };
}

// HomePage.jsx - Stream consumption
async function onGenerate() {
  for await (const data of generateResponseStream({ context, signal })) {
    if (data.chunk) {
      setResult(prev => prev + data.chunk); // Append chunk
    }
  }
}
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
4. Profile picture displayed in header/sidebar
5. Same JWT token system

### Data Privacy
- Strict data separation: users only see their own data
- No cross-user data leakage
- Guest data is separate from authenticated user data

## 🔄 Error Handling & Resilience

### Network Error Recovery
```javascript
// 3x retry with exponential backoff
// 1st retry: 1s delay
// 2nd retry: 2s delay  
// 3rd retry: 4s delay
```

### HTTP Status Code Logic
| Status | Behavior |
|--------|----------|
| No status (network error) | ✅ Auto-retry |
| 429 (Quota/Rate limit) | ❌ No retry, show error |
| 401/403 (Auth error) | ❌ No retry, show error |
| 5xx (Server error) | ❌ No retry, show error |

### Timeout Handling
- After 30s: Display "Taking longer than usual..."
- User can wait or retry manually

### Error Messages (i18n)
- English: "Taking longer than usual...", "Retrying (1/3)..."
- Indonesian: "Memerlukan waktu lebih lama...", "Mencoba lagi (1/3)..."

## 🎨 UI Refinements

### Layout
- **Sidebar**: Full height with right border as separator (ChatGPT-style)
- **Header**: Minimal with "Clever AI" branding and mobile hamburger
- **Hero**: Left-aligned greeting + question (Gemini-style)
- **Chat**: User messages right, AI responses left

### Styling
- Monochrome palette: `bg-[#0a0a0a]`, `border-white/[0.06]`
- Clean typography: `font-normal`, no unnecessary bold
- Text wrapping: `break-words` for long content
- Consistent spacing and transitions
- **WCAG AA Compliant**: All text meets minimum 4.5:1 contrast ratio

### Components
- **Skeleton Loading**: Shimmer effects for auth/history loading states
- **Modals**: Centered, no blur backdrop, monochrome theme
- **History Menu**: Dropdown with rename, pin, delete actions

### Accessibility (WCAG AA)
Text contrast standards applied across all pages:
- **Primary text**: `text-white` (100% opacity)
- **Important text**: `text-white/90` (90% opacity)
- **Supporting text**: `text-white/60` (60% opacity)
- **Muted/placeholder**: `text-white/45-50` (45-50% opacity minimum)

All pages updated: Auth, Legal, Docs, Changelog, Guide, Modals, Sidebar, Chat, Layout components

### Footer & Navigation
- **Minimal Bottom Info**: Single-line footer with organized sections:
  - **Product**: Chat, History, API links
  - **Resources**: Documentation, Changelog, GitHub
  - **Legal**: Privacy, Terms, Security pages
- **Smooth Scroll**: CSS `scroll-behavior: smooth` + React Router ScrollToTop
- **Smart Auto-focus**: Desktop auto-focus on Chat click, mobile stays clean
- **Back to Top**: Multi-fallback scroll mechanism for SPA compatibility

## 🔗 Related

- [clever-ai-backend](https://github.com/ryramadhan/clever-ai-backend) — Express AI API
