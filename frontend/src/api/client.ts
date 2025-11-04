// api/client.ts
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5001";

function getToken() {
  return localStorage.getItem("token");
}

export async function api(path: string, opts: RequestInit = {}) {
  const headers = new Headers(opts.headers as HeadersInit || {});
  headers.set("Content-Type", "application/json");
  
  const token = getToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${API_BASE}${path}`, { ...opts, headers });
  
  const text = await res.text();
  
  try {
    const data = text ? JSON.parse(text) : null;
    
    if (!res.ok) {
      throw data || { message: res.statusText };
    }
    
    return data;
  } catch (error) {
    throw error;
  }
}