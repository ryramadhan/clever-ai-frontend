import { useNavigate } from "react-router-dom";

export default function DocsPage() {
  const navigate = useNavigate();

  function goBack() {
    navigate(-1);
  }

  const endpoints = [
    {
      category: "Public",
      items: [
        { method: "GET", path: "/health", desc: "Health check" },
        { method: "POST", path: "/api/auth/register", desc: "Register new user (rate limited: 10/15min)" },
        { method: "POST", path: "/api/auth/login", desc: "Login user (rate limited: 10/15min)" },
        { method: "POST", path: "/api/auth/google", desc: "Google OAuth login (rate limited)" },
        { method: "POST", path: "/api/auth/forgot-password", desc: "Request password reset" },
        { method: "POST", path: "/api/auth/reset-password", desc: "Reset password with token" },
      ],
    },
    {
      category: "Protected (Auth Optional)",
      items: [
        { method: "GET", path: "/api/auth/me", desc: "Get current user (requires Bearer token)" },
        { method: "POST", path: "/api/generate/stream", desc: "SSE Streaming - Generate AI response with real-time streaming (rate limited: 20/min)" },
        { method: "POST", path: "/api/generate", desc: "Legacy non-streaming endpoint (rate limited: 20/min)" },
        { method: "GET", path: "/api/captions?limit=20&offset=0", desc: "List history. Guest: global data. Auth: own data" },
      ],
    },
  ];

  const methodColors = {
    GET: "text-emerald-400",
    POST: "text-amber-400",
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/[0.06]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={goBack}
              className="w-8 h-8 flex items-center justify-center text-white/50 hover:text-white/80 transition-colors"
              aria-label="Go back"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-sm font-medium text-white/80">API Documentation</h1>
          </div>
          <span className="text-xs text-white/40">v1.0</span>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Intro */}
        <section className="mb-10">
          <p className="text-sm text-white/60 leading-relaxed">
            REST API untuk AI Assistant dengan sistem autentikasi lengkap. Terima pertanyaan konteks dari user, generate respons dengan AI (Google Gemini) + fallback mock berbasis keyword, simpan history ke PostgreSQL dengan data separation antar user.
          </p>
        </section>

        {/* Endpoints */}
        <section className="space-y-8">
          {endpoints.map((section) => (
            <div key={section.category}>
              <h2 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-4">
                {section.category}
              </h2>
              <div className="space-y-2">
                {section.items.map((endpoint) => (
                  <div
                    key={endpoint.path}
                    className="flex items-start gap-4 p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.1] transition-colors"
                  >
                    <span className={`text-xs font-mono font-medium ${methodColors[endpoint.method]} w-12 shrink-0`}>
                      {endpoint.method}
                    </span>
                    <div className="flex-1 min-w-0">
                      <code className="text-xs text-white/70 font-mono block mb-1">
                        {endpoint.path}
                      </code>
                      <p className="text-xs text-white/40">{endpoint.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Authentication */}
        <section className="mt-10 pt-8 border-t border-white/[0.06]">
          <h2 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-4">
            Authentication
          </h2>
          <div className="p-4 rounded-lg bg-[#141414] border border-white/[0.08]">
            <p className="text-xs text-white/50 mb-3">
              Gunakan Bearer token di header untuk endpoint yang memerlukan autentikasi:
            </p>
            <pre className="text-xs text-white/60 font-mono overflow-x-auto">
              {`Authorization: Bearer <your_jwt_token>`}
            </pre>
          </div>
        </section>

        {/* Response Examples */}
        <section className="mt-10 pt-8 border-t border-white/[0.06]">
          <h2 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-4">
            Response Examples
          </h2>

          {/* Login Response */}
          <div className="mb-4">
            <p className="text-xs text-white/40 mb-2">POST /api/auth/login - Success</p>
            <div className="p-4 rounded-lg bg-[#141414] border border-white/[0.08]">
              <pre className="text-xs text-white/60 font-mono overflow-x-auto">
                {`{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}`}
              </pre>
            </div>
          </div>

          {/* Generate Stream */}
          <div>
            <p className="text-xs text-white/40 mb-2">POST /api/generate/stream - SSE Format</p>
            <div className="p-4 rounded-lg bg-[#141414] border border-white/[0.08]">
              <pre className="text-xs text-white/60 font-mono overflow-x-auto">
                {`data: {"chunk": "Berikut ", "provider": "gemini"}

data: {"chunk": "tips produktivitas...", "provider": "gemini"}

data: {"done": true, "result": "Berikut tips...", "provider": "gemini"}`}
              </pre>
            </div>
          </div>
        </section>

        {/* Error Codes */}
        <section className="mt-10 pt-8 border-t border-white/[0.06]">
          <h2 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-4">
            Error Codes
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { code: "400", desc: "Bad Request - Invalid input" },
              { code: "401", desc: "Unauthorized - Invalid token" },
              { code: "403", desc: "Forbidden - Access denied" },
              { code: "429", desc: "Rate Limited - Too many requests" },
              { code: "500", desc: "Server Error - Something went wrong" },
            ].map((error) => (
              <div
                key={error.code}
                className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]"
              >
                <span className="text-xs font-mono font-medium text-rose-400 w-8">
                  {error.code}
                </span>
                <span className="text-xs text-white/50">{error.desc}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Rate Limiting */}
        <section className="mt-10 pt-8 border-t border-white/[0.06]">
          <h2 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-4">
            Rate Limiting
          </h2>
          <div className="space-y-2">
            {[
              { endpoint: "Auth endpoints", limit: "10 requests / 15 minutes" },
              { endpoint: "Generate endpoints", limit: "20 requests / minute" },
            ].map((item) => (
              <div
                key={item.endpoint}
                className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]"
              >
                <span className="text-xs text-white/60">{item.endpoint}</span>
                <span className="text-xs text-white/40 font-mono">{item.limit}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Code Examples */}
        <section className="mt-10 pt-8 border-t border-white/[0.06]">
          <h2 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-4">
            Code Example
          </h2>
          <div className="p-4 rounded-lg bg-[#141414] border border-white/[0.08]">
            <p className="text-xs text-white/40 mb-2">JavaScript - Streaming Request</p>
            <pre className="text-xs text-white/60 font-mono overflow-x-auto">
              {`const response = await fetch('/api/generate/stream', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
  },
  body: JSON.stringify({ context: 'Hello AI' })
});

const reader = response.body.getReader();
while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  // Process chunk
}`}
            </pre>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-10 pt-6 border-t border-white/[0.06] text-center">
          <p className="text-xs text-white/30">
            Built with Express.js + PostgreSQL + Gemini AI
          </p>
          <p className="text-[10px] text-white/20 mt-1">
            Documentation v1.0 • Last updated April 2024
          </p>
        </footer>
      </main>
    </div>
  );
}
