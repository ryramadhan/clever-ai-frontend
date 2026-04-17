const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

function getToken() {
  return localStorage.getItem("token");
}

async function request(path, options = {}) {
  const base = API_BASE || "";
  const url = `${base}${path}`;
  const { method = "GET", body, requireAuth } = options;

  const headers = {
    "Content-Type": "application/json",
  };

  // Add auth token if required or available
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
    throw new Error(message);
  }

  return data;
}

export async function generateResponse({ context }) {
  // Optional auth - sends token if available
  return request("/api/generate", {
    method: "POST",
    body: { context },
    requireAuth: !!getToken(),
  });
}

export async function getCaptions({ limit = 20, offset = 0 } = {}) {
  const qs = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
  }).toString();
  // Optional auth - sends token if available
  return request(`/api/captions?${qs}`, {
    requireAuth: !!getToken(),
  });
}

// Auth API
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

