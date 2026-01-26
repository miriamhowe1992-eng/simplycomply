const API_BASE = process.env.REACT_APP_API_URL || "";

function getToken() {
  return localStorage.getItem("admin_token");
}

export function setToken(token) {
  localStorage.setItem("admin_token", token);
}

export function clearToken() {
  localStorage.removeItem("admin_token");
}

export function isLoggedIn() {
  return !!getToken();
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  // Helpful error text
  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      msg = data?.detail || msg;
    } catch (_) {}
    throw new Error(msg);
  }

  // Some endpoints may return empty body
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) return res.json();
  return res.text();
}

export async function adminLogin(username, password) {
  // FastAPI OAuth2PasswordRequestForm expects form-encoded
  const body = new URLSearchParams();
  body.set("username", username);
  body.set("password", password);

  const data = await request(`/api/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  // { access_token, token_type }
  setToken(data.access_token);
  return data;
}

export async function listDocuments() {
  return request(`/api/admin/documents`);
}

export async function uploadDocument(title, file) {
  const form = new FormData();
  form.append("title", title);
  form.append("file", file);

  return request(`/api/admin/documents`, {
    method: "POST",
    body: form,
  });
}

export async function getDownloadUrl(docId) {
  return request(`/api/admin/documents/${docId}/download`);
}

export async function deleteDocument(docId) {
  return request(`/api/admin/documents/${docId}`, { method: "DELETE" });
}
