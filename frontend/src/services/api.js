const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000/api";

async function request(path, options) {
  const response = await fetch(`${API_URL}${path}`, options);
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(body.error || `Erreur ${response.status}`);
    error.body = body;
    throw error;
  }
  return body;
}

export function apiGet(path) {
  return request(path);
}

export function apiPost(path, data) {
  return request(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}
