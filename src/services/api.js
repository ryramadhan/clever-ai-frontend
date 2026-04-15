const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

async function request(path, options = {}) {
  // Use VITE_API_BASE_URL for external API, or empty for same-origin
  const base = API_BASE || "";
  const url = `${base}${path}`;
  const { method = "GET", body } = options;
  const res = await fetch(url, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const message = data?.error?.message || `Request failed (${res.status})`;
    throw new Error(message);
  }

  return data;
}

export async function generateResponse({ context }) {
  return request("/api/generate", { method: "POST", body: { context } });
}

export async function getCaptions({ limit = 20, offset = 0 } = {}) {
  const qs = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
  }).toString();
  return request(`/api/captions?${qs}`);
}

