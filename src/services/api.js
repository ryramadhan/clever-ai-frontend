const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

function getToken() {
  return localStorage.getItem("token");
}

const pending = new Map();

async function dedupedRequest(key, fn) {
  if (pending.has(key)) {
    return pending.get(key);
  }
  const promise = fn().finally(() => pending.delete(key));
  pending.set(key, promise);
  return promise;
}

async function request(path, options = {}) {
  const base = API_BASE || "";
  const url = `${base}${path}`;
  const { method = "GET", body, requireAuth } = options;

  const headers = {
    "Content-Type": "application/json",
  };

  const token = getToken();
  if (token && (requireAuth || options.headers?.Authorization)) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const message = data?.error?.message || `Request failed (${res.status})`;
    const err = new Error(message);
    err.status = res.status;
    err.statusCode = res.status;
    throw err;
  }

  return data;
}

export async function generateResponse({ context }) {
  return request("/api/generate", {
    method: "POST",
    body: { context },
    requireAuth: !!getToken(),
  });
}

export async function* generateResponseStream({ context, signal }) {
  const base = API_BASE || "";
  const url = `${base}/api/generate/stream`;

  const headers = {
    "Content-Type": "application/json",
  };

  const token = getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({ context }),
    signal, // For abort controller
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    const message = data?.error?.message || `Request failed (${res.status})`;
    const err = new Error(message);
    err.status = res.status;
    err.statusCode = res.status;
    throw err;
  }

  // Read SSE stream
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    // Process SSE events in buffer
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        const data = line.slice(6);
        if (data) {
          try {
            const parsed = JSON.parse(data);
            yield parsed;
          } catch {
            // Skip invalid JSON
          }
        }
      }
    }
  }

  // Process remaining buffer
  if (buffer.startsWith("data: ")) {
    const data = buffer.slice(6);
    if (data) {
      try {
        const parsed = JSON.parse(data);
        yield parsed;
      } catch {
        // Skip invalid JSON
      }
    }
  }
}

export async function getCaptions({ limit = 20, offset = 0, useCache = true } = {}) {
  const qs = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
  }).toString();

  const cacheKey = `captions_${limit}_${offset}_${getToken() || "guest"}`;

  if (useCache && offset === 0) {
    try {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < 300000) {
          setTimeout(() => {
            request(`/api/captions?${qs}`, { requireAuth: !!getToken() })
              .then((fresh) => sessionStorage.setItem(cacheKey, JSON.stringify({ data: fresh, timestamp: Date.now() })))
              .catch(() => { });
          }, 100);
          return data;
        }
      }
    } catch { }
  }

  return dedupedRequest(cacheKey, async () => {
    const data = await request(`/api/captions?${qs}`, { requireAuth: !!getToken() });
    if (offset === 0) {
      try {
        sessionStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: Date.now() }));
      } catch { }
    }
    return data;
  });
}

export function clearCaptionsCache() {
  try {
    const prefix = "captions_";
    for (let i = sessionStorage.length - 1; i >= 0; i--) {
      const key = sessionStorage.key(i);
      if (key && key.startsWith(prefix)) {
        sessionStorage.removeItem(key);
      }
    }
  } catch { }
}

export async function register({ name, email, password }) {
  return request("/api/auth/register", {
    method: "POST",
    body: { name, email, password },
  });
}

export async function login({ email, password }) {
  return request("/api/auth/login", {
    method: "POST",
    body: { email, password },
  });
}

export async function googleLogin(idToken) {
  return request("/api/auth/google", {
    method: "POST",
    body: { idToken },
  });
}

export async function getMe() {
  return request("/api/auth/me", { requireAuth: true });
}

export async function forgotPassword(email) {
  return request("/api/auth/forgot-password", {
    method: "POST",
    body: { email },
  });
}

export async function resetPassword({ token, newPassword }) {
  return request("/api/auth/reset-password", {
    method: "POST",
    body: { token, newPassword },
  });
}

export async function renameCaption(id, title) {
  const result = await request(`/api/captions/${id}`, {
    method: "PATCH",
    body: { title },
    requireAuth: true,
  });
  clearCaptionsCache();
  return result;
}

export async function pinCaption(id, isPinned) {
  const result = await request(`/api/captions/${id}/pin`, {
    method: "PATCH",
    body: { is_pinned: isPinned },
    requireAuth: true,
  });
  clearCaptionsCache();
  return result;
}

export async function deleteCaption(id) {
  const result = await request(`/api/captions/${id}`, {
    method: "DELETE",
    requireAuth: true,
  });
  clearCaptionsCache();
  return result;
}

// Public stats for social proof (no auth required)
export async function getStats() {
  return request("/api/stats", { requireAuth: false });
}
